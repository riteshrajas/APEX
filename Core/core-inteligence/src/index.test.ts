import { describe, it, expect, vi, beforeEach } from 'vitest';

// First mock ChatOllama
vi.mock('@langchain/community/chat_models/ollama', () => {
  return {
    ChatOllama: class MockChatOllama {
      async invoke() {
        throw new Error('Job failed from ChatOllama');
      }
    }
  };
});

import { __TEST__ } from './index';

describe('processQueue', () => {
  beforeEach(() => {
    __TEST__.jobQueue.length = 0;
    __TEST__.jobStore.clear();
    __TEST__.workerActive = false;
  });

  it('should reset workerActive state when job throws an error', async () => {
    const job = {
      id: 'error-job-1',
      prompt: 'throw an error',
      status: 'queued',
      maxSteps: 3,
      stepsCompleted: 0,
      patches: [], // Added to prevent undefined error
      log: [],
      pauseRequested: false
    };

    __TEST__.jobStore.set(job.id, job as any);
    __TEST__.jobQueue.push(job.id);

    await __TEST__.processQueue();

    // Since runJob catches the error, it shouldn't throw here!
    expect(__TEST__.workerActive).toBe(false);
    expect(__TEST__.jobStore.get(job.id)!.status).toBe('failed');
    expect(__TEST__.jobStore.get(job.id)!.error).toContain('Job failed from ChatOllama');
  });
});
