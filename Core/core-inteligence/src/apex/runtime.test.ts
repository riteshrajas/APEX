import test, { describe } from "node:test";
import assert from "node:assert";
import { ApexRuntime } from "./runtime.js";

describe("ApexRuntime", () => {
  describe("constructor & health()", () => {
    test("initializes with default options and returns valid health state", () => {
      const options = {
        projectRoot: "/fake/root",
        maxHistory: 5,
        defaultSystem: "test system"
      };

      const runtime = new ApexRuntime(options);

      const health = runtime.health();
      assert.ok(health.defaultProvider);
      assert.ok(health.defaultModel);
      assert.ok(Array.isArray(health.providers));
      assert.ok(Array.isArray(health.agents));
      assert.strictEqual(health.maxHistory, 5);
      assert.ok(Array.isArray(health.recentThreads));
    });

    test("clamps maxHistory to at least 1", () => {
      const runtime = new ApexRuntime({ projectRoot: "/fake/root", maxHistory: 0 });
      const health = runtime.health();
      assert.strictEqual(health.maxHistory, 1);
    });
  });

  describe("inspectRoute(), searchMemory(), getThread()", () => {
    test("inspectRoute returns a valid RouteDecision", () => {
      const runtime = new ApexRuntime({ projectRoot: "/fake/root", maxHistory: 5 });
      const route = runtime.inspectRoute({ prompt: "hello" });
      assert.strictEqual(typeof route.agent, "string");
      assert.strictEqual(typeof route.provider, "string");
      assert.strictEqual(typeof route.reason, "string");
    });

    test("searchMemory and getThread delegate to memory methods correctly", () => {
      const runtime = new ApexRuntime({ projectRoot: "/fake/root", maxHistory: 5 });

      const searchRes = runtime.searchMemory("test query", 3);
      assert.ok(Array.isArray(searchRes));

      const threadRes = runtime.getThread("test-thread", 10);
      assert.ok(Array.isArray(threadRes));
    });
  });

  describe("runTool()", () => {
    test("handles valid tool inputs using mocked toolbox", async () => {
      const runtime = new ApexRuntime({ projectRoot: "/fake/root", maxHistory: 5 });
      // Stub the internal toolbox to avoid actual execution
      const tools = (runtime as any).tools;
      tools.webSearch = async (q: string) => ({ output: `search: ${q}` });
      tools.fsRead = async (p: string) => ({ output: `read: ${p}` });
      tools.fsWrite = async (p: string, c: string) => ({ output: `write: ${p} ${c.length}` });
      tools.fsList = async (p: string) => ({ output: `list: ${p}` });

      const searchRes = await runtime.runTool({ name: "web_search", query: "test-query" });
      assert.strictEqual(searchRes, "search: test-query");

      const readRes = await runtime.runTool({ name: "fs_read", path: "test.txt" });
      assert.strictEqual(readRes, "read: test.txt");

      const writeRes = await runtime.runTool({ name: "fs_write", path: "test.txt", content: "data" });
      assert.strictEqual(writeRes, "write: test.txt 4");

      const listRes = await runtime.runTool({ name: "fs_list", path: "dir" });
      assert.strictEqual(listRes, "list: dir");
    });

    test("throws an error for an unknown tool", async () => {
      const runtime = new ApexRuntime({ projectRoot: "/fake/root", maxHistory: 5 });

      try {
        await runtime.runTool({ name: "unknown" as any });
        assert.fail("Should have thrown error");
      } catch (err: any) {
        assert.strictEqual(err.message, "Unknown tool unknown");
      }
    });
  });

  describe("executeDirective() via chat()", () => {
    test("handles valid directives like /read", async () => {
      const runtime = new ApexRuntime({ projectRoot: "/fake/root", maxHistory: 5 });
      const tools = (runtime as any).tools;
      tools.fsRead = async (p: string) => ({ output: `mock read: ${p}` });

      // /read is a directReply directive, it bypasses LLM call and uses executeDirective inside chat()
      const chatRes = await runtime.chat({
        message: "/read test-file.txt",
        history: [],
        includeMemory: false
      });

      assert.strictEqual(chatRes.reply, "mock read: test-file.txt");
      assert.strictEqual(chatRes.usedTools.length, 1);
      assert.strictEqual(chatRes.usedTools[0].name, "fs_read");
    });
  });

  describe("chat()", () => {
    test("handles standard chat without memory", async () => {
      const runtime = new ApexRuntime({ projectRoot: "/fake/root", maxHistory: 5 });

      const providers = (runtime as any).providers;
      providers.complete = async (req: any) => ({
        text: "mock llm response",
        provider: req.provider,
        model: req.model || "mock-model"
      });

      const chatRes = await runtime.chat({
        message: "hello",
        history: [],
        includeMemory: false
      });

      assert.strictEqual(chatRes.reply, "mock llm response");
      assert.strictEqual(chatRes.model, "mock-model");
      assert.ok(chatRes.provider);
      assert.strictEqual(chatRes.usedTools.length, 0);
    });

    test("handles standard chat with memory", async () => {
      const runtime = new ApexRuntime({ projectRoot: "/fake/root", maxHistory: 5 });
      const providers = (runtime as any).providers;
      providers.complete = async () => ({
        text: "mock llm response with memory",
        provider: "ollama",
        model: "mock-model"
      });

      const memory = (runtime as any).memory;
      memory.appendTurn = () => {};
      memory.remember = () => {};
      memory.setThreadState = () => {};
      memory.getThreadTurns = () => [];
      memory.search = () => [{ score: 0.9, threadId: "id", text: "past msg" }];

      const chatRes = await runtime.chat({
        message: "hello with memory",
        history: [],
        includeMemory: true
      });

      assert.strictEqual(chatRes.reply, "mock llm response with memory");
    });

    test("handles all valid directive regex parsing", async () => {
      const runtime = new ApexRuntime({ projectRoot: "/fake/root", maxHistory: 5 });
      const tools = (runtime as any).tools;
      tools.webSearch = async (q: string) => ({ output: `mock search: ${q}` });
      tools.fsRead = async (p: string) => ({ output: `mock read: ${p}` });
      tools.fsWrite = async (p: string, c: string) => ({ output: `mock write: ${p} ${c.length}` });
      tools.fsList = async (p: string) => ({ output: `mock list: ${p}` });

      const providers = (runtime as any).providers;
      providers.complete = async () => ({ text: "fallback llm", provider: "ollama", model: "m" });

      // /search is not a directReply, so it will output to tools and still hit LLM
      const searchRes = await runtime.chat({ message: "/search query here", history: [], includeMemory: false });
      assert.strictEqual(searchRes.usedTools[0].name, "web_search");
      assert.strictEqual(searchRes.usedTools[0].output, "mock search: query here");
      assert.strictEqual(searchRes.reply, "fallback llm");

      // /list is directReply
      const listRes = await runtime.chat({ message: "/list .", history: [], includeMemory: false });
      assert.strictEqual(listRes.usedTools[0].name, "fs_list");
      assert.strictEqual(listRes.reply, "mock list: .");

      // /write is directReply
      const writeRes = await runtime.chat({ message: "/write out.txt\nline1\nline2", history: [], includeMemory: false });
      assert.strictEqual(writeRes.usedTools[0].name, "fs_write");
      assert.strictEqual(writeRes.reply, "mock write: out.txt 11");
    });
  });
});
