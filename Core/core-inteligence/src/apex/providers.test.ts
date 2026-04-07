import test from "node:test";
import assert from "node:assert";
import { MultiProviderClient } from "./providers.js";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { AIMessage } from "@langchain/core/messages";

test("MultiProviderClient - Initialization and Configuration", () => {
  const client = new MultiProviderClient({
    openAiApiKey: "test-openai-key",
    anthropicApiKey: "test-anthropic-key",
    defaultProvider: "openai",
  });

  assert.strictEqual(client.getDefaultProvider(), "openai");
  assert.strictEqual(client.getDefaultModel("openai"), "gpt-4o-mini");
  assert.strictEqual(client.getDefaultModel("anthropic"), "claude-3-5-sonnet-latest");
  assert.strictEqual(client.getDefaultModel("ollama"), "qwen3:4b");

  const available = client.listAvailable();
  assert.ok(available.includes("ollama"));
  assert.ok(available.includes("openai"));
  assert.ok(available.includes("anthropic"));
});

test("MultiProviderClient - Fallback Provider if Default is Missing Key", () => {
  const client = new MultiProviderClient({
    defaultProvider: "openai",
    // No openAiApiKey provided
  });

  // Should fallback to ollama since openai is not available
  assert.strictEqual(client.getDefaultProvider(), "ollama");

  const available = client.listAvailable();
  assert.ok(available.includes("ollama"));
  assert.ok(!available.includes("openai"));
  assert.ok(!available.includes("anthropic"));
});

test("MultiProviderClient - Provider Resolution", () => {
  const client = new MultiProviderClient({
    openAiApiKey: "test-openai-key",
    defaultProvider: "ollama",
  });

  // Explicit valid provider
  assert.strictEqual(client.resolveProvider("openai", []), "openai");

  // Explicit unconfigured provider throws
  assert.throws(() => {
    client.resolveProvider("anthropic", []);
  }, /Provider anthropic is not configured/);

  // Preferred array resolution
  assert.strictEqual(client.resolveProvider("auto", ["anthropic", "openai", "ollama"]), "openai");
  assert.strictEqual(client.resolveProvider("auto", ["anthropic"]), "ollama"); // fallback to default
});

test("MultiProviderClient - completeOllama", async (t) => {
  t.mock.method(ChatOllama.prototype, "invoke", async () => {
    return new AIMessage("mocked ollama response");
  });

  const client = new MultiProviderClient();
  const res = await client.complete({
    provider: "ollama",
    messages: [{ role: "user", content: "hello" }]
  });

  assert.strictEqual(res.text, "mocked ollama response");
  assert.strictEqual(res.provider, "ollama");
  assert.strictEqual(res.model, "qwen3:4b");
});

test("MultiProviderClient - completeOpenAi", async (t) => {
  t.mock.method(globalThis, "fetch", async (url: any, options: any) => {
    assert.strictEqual(url, "https://api.openai.com/v1/chat/completions");
    assert.strictEqual(options.headers["Authorization"], "Bearer test-openai-key");
    const body = JSON.parse(options.body);
    assert.strictEqual(body.model, "gpt-4o-mini");
    assert.deepStrictEqual(body.messages, [{ role: "user", content: "hello" }]);

    return {
      ok: true,
      json: async () => ({
        model: "gpt-4o-mini-mocked",
        choices: [{
          message: {
            content: "mocked openai response"
          }
        }]
      })
    } as any;
  });

  const client = new MultiProviderClient({ openAiApiKey: "test-openai-key" });
  const res = await client.complete({
    provider: "openai",
    messages: [{ role: "user", content: "hello" }]
  });

  assert.strictEqual(res.text, "mocked openai response");
  assert.strictEqual(res.provider, "openai");
  assert.strictEqual(res.model, "gpt-4o-mini-mocked");
});

test("MultiProviderClient - completeOpenAi Failure", async (t) => {
  t.mock.method(globalThis, "fetch", async () => {
    return {
      ok: false,
      status: 401,
      text: async () => "Unauthorized"
    } as any;
  });

  const client = new MultiProviderClient({ openAiApiKey: "test-openai-key" });
  await assert.rejects(async () => {
    await client.complete({
      provider: "openai",
      messages: [{ role: "user", content: "hello" }]
    });
  }, /OpenAI request failed \(401\): Unauthorized/);
});

test("MultiProviderClient - completeAnthropic", async (t) => {
  t.mock.method(globalThis, "fetch", async (url: any, options: any) => {
    assert.strictEqual(url, "https://api.anthropic.com/v1/messages");
    assert.strictEqual(options.headers["x-api-key"], "test-anthropic-key");
    assert.strictEqual(options.headers["anthropic-version"], "2023-06-01");
    const body = JSON.parse(options.body);
    assert.strictEqual(body.model, "claude-3-5-sonnet-latest");
    assert.strictEqual(body.system, "system prompt");
    assert.deepStrictEqual(body.messages, [{ role: "user", content: "hello" }]);

    return {
      ok: true,
      json: async () => ({
        content: [{
          type: "text",
          text: "mocked anthropic response"
        }]
      })
    } as any;
  });

  const client = new MultiProviderClient({ anthropicApiKey: "test-anthropic-key" });
  const res = await client.complete({
    provider: "anthropic",
    messages: [
      { role: "system", content: "system prompt" },
      { role: "user", content: "hello" }
    ]
  });

  assert.strictEqual(res.text, "mocked anthropic response");
  assert.strictEqual(res.provider, "anthropic");
  assert.strictEqual(res.model, "claude-3-5-sonnet-latest");
});

test("MultiProviderClient - completeAnthropic Failure", async (t) => {
  t.mock.method(globalThis, "fetch", async () => {
    return {
      ok: false,
      status: 400,
      text: async () => "Bad Request"
    } as any;
  });

  const client = new MultiProviderClient({ anthropicApiKey: "test-anthropic-key" });
  await assert.rejects(async () => {
    await client.complete({
      provider: "anthropic",
      messages: [{ role: "user", content: "hello" }]
    });
  }, /Anthropic request failed \(400\): Bad Request/);
});
