import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ApexToolbox } from './tools.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Mock fs/promises
vi.mock('node:fs/promises', () => {
  return {
    default: {
      readdir: vi.fn(),
      readFile: vi.fn(),
      writeFile: vi.fn(),
      mkdir: vi.fn(),
    }
  };
});

describe('ApexToolbox', () => {
  const rootDir = '/workspace/root';
  let toolbox: ApexToolbox;

  beforeEach(() => {
    // We normalize to whatever platform we're on for accurate testing
    toolbox = new ApexToolbox(rootDir);
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  describe('resolvePath and Constructor', () => {
    it('should resolve paths within root directory', async () => {
      // Access private method via any or testing indirectly
      // We can test this indirectly by calling a public method like fsRead
      // If we mock fs.readFile, we can see what path it was called with.
      const mockReadFile = fs.readFile as ReturnType<typeof vi.fn>;
      mockReadFile.mockResolvedValue('test');

      await toolbox.fsRead('some/file.txt');

      // Should be called with normalized path
      expect(mockReadFile).toHaveBeenCalledWith(path.resolve(rootDir, 'some/file.txt'), 'utf8');
    });

    it('should throw if path escapes workspace root', async () => {
      await expect(toolbox.fsRead('../escaped.txt')).rejects.toThrow('Path escapes the allowed workspace root.');
    });

    it('should throw if path is empty', async () => {
      await expect(toolbox.fsRead(' ')).rejects.toThrow('Path cannot be empty.');
    });
  });

  describe('webSearch', () => {
    it('should return search results successfully', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          Heading: 'Test Heading',
          AbstractText: 'Test Abstract',
          AbstractURL: 'https://test.com',
          RelatedTopics: [
            { Text: 'Topic 1' },
            { Topics: [{ Text: 'Subtopic 1' }] }
          ]
        })
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      const result = await toolbox.webSearch('test query');

      expect(result.name).toBe('web_search');
      expect(result.output).toContain('Heading: Test Heading');
      expect(result.output).toContain('Abstract: Test Abstract');
      expect(result.output).toContain('Source: https://test.com');
      expect(result.output).toContain('Related:');
      expect(result.output).toContain('- Topic 1');
      expect(result.output).toContain('- Subtopic 1');
    });

    it('should handle failed web search', async () => {
      const mockResponse = {
        ok: false,
        status: 500
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      await expect(toolbox.webSearch('test query')).rejects.toThrow('Web search failed with status 500');
    });

    it('should fallback when no instant answer is found', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({})
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      const result = await toolbox.webSearch('test query');

      expect(result.output).toContain('No strong instant answer found. Try a narrower query.');
    });
  });

  describe('fsList', () => {
    it('should list files and directories sorted', async () => {
      const mockReaddir = fs.readdir as ReturnType<typeof vi.fn>;
      mockReaddir.mockResolvedValue([
        { name: 'file2.txt', isDirectory: () => false },
        { name: 'dir1', isDirectory: () => true },
        { name: 'file1.txt', isDirectory: () => false },
      ]);

      const result = await toolbox.fsList();

      expect(result.name).toBe('fs_list');
      expect(result.output).toBe('dir1/\nfile1.txt\nfile2.txt');
    });
  });

  describe('fsRead', () => {
    it('should read file content successfully', async () => {
      const mockReadFile = fs.readFile as ReturnType<typeof vi.fn>;
      mockReadFile.mockResolvedValue('file content');

      const result = await toolbox.fsRead('file.txt');

      expect(result.name).toBe('fs_read');
      expect(result.output).toBe('file content');
    });
  });

  describe('fsWrite', () => {
    it('should create directory and write to file', async () => {
      const mockMkdir = fs.mkdir as ReturnType<typeof vi.fn>;
      const mockWriteFile = fs.writeFile as ReturnType<typeof vi.fn>;

      mockMkdir.mockResolvedValue(undefined);
      mockWriteFile.mockResolvedValue(undefined);

      const result = await toolbox.fsWrite('dir/newfile.txt', 'new content');

      expect(result.name).toBe('fs_write');
      expect(result.output).toContain('Wrote 11 bytes');

      const expectedPath = path.resolve(rootDir, 'dir/newfile.txt');
      expect(mockMkdir).toHaveBeenCalledWith(path.dirname(expectedPath), { recursive: true });
      expect(mockWriteFile).toHaveBeenCalledWith(expectedPath, 'new content', 'utf8');
    });
  });
});
