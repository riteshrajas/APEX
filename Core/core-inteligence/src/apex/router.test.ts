import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { listAgents } from './router.js';

describe('listAgents', () => {
  it('should return the correct list of agents', () => {
    const agents = listAgents();
    assert.deepEqual(agents, ["general", "researcher", "coder", "system"]);
  });
});
