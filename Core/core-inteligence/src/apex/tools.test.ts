import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
    mkdirs,
    listFiles,
    readFile,
    makeFile,
    deleteFile,
    folderTree
} from './tools.js';
import * as fsSync from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

describe('File System Tools', () => {
    let testDir: string;

    beforeEach(async () => {
        // Create a unique temporary directory for each test
        const tmpBase = os.tmpdir();
        testDir = await fs.mkdtemp(path.join(tmpBase, 'apex-tools-test-'));
    });

    afterEach(async () => {
        // Clean up the temporary directory after each test
        await fs.rm(testDir, { recursive: true, force: true });
    });

    describe('mkdirs', () => {
        it('should create a directory successfully', () => {
            const newDir = path.join(testDir, 'new_dir');
            const result = mkdirs(newDir);

            expect(result).toBe(`Directory '${newDir}' created successfully`);
            expect(fsSync.existsSync(newDir)).toBe(true);
            expect(fsSync.statSync(newDir).isDirectory()).toBe(true);
        });

        it('should create nested directories recursively', () => {
            const nestedDir = path.join(testDir, 'nested', 'dirs', 'test');
            const result = mkdirs(nestedDir);

            expect(result).toBe(`Directory '${nestedDir}' created successfully`);
            expect(fsSync.existsSync(nestedDir)).toBe(true);
            expect(fsSync.statSync(nestedDir).isDirectory()).toBe(true);
        });
    });

    describe('makeFile and readFile', () => {
        it('should create a file and then read its content', () => {
            const filePath = path.join(testDir, 'test.txt');
            const content = 'Hello, World!';

            const makeResult = makeFile(filePath, content);
            expect(makeResult).toBe(`File '${filePath}' created successfully`);
            expect(fsSync.existsSync(filePath)).toBe(true);

            const readResult = readFile(filePath);
            expect(readResult).toBe(content);
        });

        it('should throw an error when reading a non-existent file', () => {
            const nonExistentPath = path.join(testDir, 'missing.txt');
            expect(() => readFile(nonExistentPath)).toThrowError(`File '${nonExistentPath}' does not exist`);
        });
    });

    describe('listFiles', () => {
        it('should list all files and directories in a given path', () => {
            const dir1 = path.join(testDir, 'dir1');
            const file1 = path.join(testDir, 'file1.txt');
            const file2 = path.join(testDir, 'file2.txt');

            fsSync.mkdirSync(dir1);
            fsSync.writeFileSync(file1, 'content1');
            fsSync.writeFileSync(file2, 'content2');

            const result = listFiles(testDir);
            // The order from readdirSync might vary, but all should be present
            expect(result).toHaveLength(3);
            expect(result).toContain('dir1');
            expect(result).toContain('file1.txt');
            expect(result).toContain('file2.txt');
        });

        it('should throw an error when listing a non-existent directory', () => {
            const nonExistentDir = path.join(testDir, 'missing_dir');
            expect(() => listFiles(nonExistentDir)).toThrowError(`Directory '${nonExistentDir}' does not exist`);
        });
    });

    describe('deleteFile', () => {
        it('should delete an existing file successfully', () => {
            const filePath = path.join(testDir, 'to_delete.txt');
            fsSync.writeFileSync(filePath, 'content');
            expect(fsSync.existsSync(filePath)).toBe(true);

            const result = deleteFile(filePath);
            expect(result).toBe(`File '${filePath}' deleted successfully`);
            expect(fsSync.existsSync(filePath)).toBe(false);
        });

        it('should throw an error when deleting a non-existent file', () => {
            const nonExistentPath = path.join(testDir, 'missing_to_delete.txt');
            expect(() => deleteFile(nonExistentPath)).toThrowError(`File '${nonExistentPath}' does not exist`);
        });
    });

    describe('folderTree', () => {
        it('should return a string representation of the folder structure', async () => {
            const dirA = path.join(testDir, 'A');
            const dirB = path.join(dirA, 'B');
            const file1 = path.join(dirA, 'file1.txt');
            const file2 = path.join(dirB, 'file2.txt');

            fsSync.mkdirSync(dirB, { recursive: true });
            fsSync.writeFileSync(file1, 'content');
            fsSync.writeFileSync(file2, 'content');

            const result = await folderTree(dirA);

            // Should contain dir names and file names
            // Since order might depend on OS/fs, we check inclusion and structure
            expect(result).toContain('A/\n');
            expect(result).toContain('    B/\n');
            expect(result).toContain('        file2.txt\n');
            expect(result).toContain('    file1.txt\n');
        });

        it('should throw an error if the directory does not exist', async () => {
            const nonExistentDir = path.join(testDir, 'missing_tree');
            await expect(folderTree(nonExistentDir)).rejects.toThrowError(`Directory '${nonExistentDir}' does not exist`);
        });
    });
});
