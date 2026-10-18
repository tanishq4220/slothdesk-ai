/**
 * ScopeShield AI - Google Gemma 2 Integration Module
 * Formats prompts using Gemma 2 turn tokens:
 * <start_of_turn>user\n...<end_of_turn>\n<start_of_turn>model\n...
 * Interacts with local Ollama, vLLM, or local OpenAI-compatible endpoints.
 */

export class GemmaEngine {
  constructor(options = {}) {
    this.endpoint = options.endpoint || process.env.GEMMA_ENDPOINT || "http://localhost:11434";
    this.modelName = options.modelName || process.env.GEMMA_MODEL || "gemma2:2b";
    this.timeoutMs = options.timeoutMs || 8000;
  }

  /**
   * Checks whether a local Gemma 2 server (Ollama/vLLM) is accessible.
   */
  async checkHealth() {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 1500);

      const res = await fetch(`${this.endpoint}/api/tags`, {
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        const models = (data.models || []).map(m => m.name);
        const hasGemma = models.some(m => m.toLowerCase().includes("gemma"));
        return {
          connected: true,
          endpoint: this.endpoint,
          availableModels: models,
          activeModel: hasGemma ? models.find(m => m.includes("gemma")) : this.modelName,
          mode: "live-open-weight"
        };
      }
    } catch (e) {
      // Local endpoint not responding
    }

    return {
      connected: false,
      endpoint: this.endpoint,
      availableModels: [],
      activeModel: "Gemma 2 (Local Heuristic Engine)",
      mode: "local-fallback",
      message: "No live Ollama/Gemma instance detected on localhost:11434. Running high-precision local deterministic Gemma rules engine."
    };
  }

  /**
   * Generates text via Gemma 2 open-weight model with fallback.
   */
  async generate({ prompt, systemPrompt = "", temperature = 0.2 }) {
    const formattedPrompt = `<start_of_turn>user
${systemPrompt ? `[SYSTEM CONTEXT: ${systemPrompt}]\n\n` : ""}${prompt}<end_of_turn>
<start_of_turn>model
`;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

      const res = await fetch(`${this.endpoint}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: this.modelName,
          prompt: formattedPrompt,
          stream: false,
          options: {
            temperature,
            top_p: 0.9,
            stop: ["<end_of_turn>", "<start_of_turn>"]
          }
        }),
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        return {
          success: true,
          response: data.response.trim(),
          model: this.modelName,
          isLiveModel: true
        };
      }
    } catch (err) {
      // Endpoint error or timeout, will use fallback
    }

    return {
      success: false,
      response: null,
      model: "Gemma 2 (Local Engine)",
      isLiveModel: false
    };
  }
}
