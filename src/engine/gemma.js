/**
 * SlothDesk AI - Google Gemma 2 Prompt Harness & Local Inference Adapter
 *
 * Implements the official Gemma 2 instruction turn format:
 * <start_of_turn>user
 * [System Context / Instructions]
 * User Prompt
 * <end_of_turn>
 * <start_of_turn>model
 */

export class GemmaEngine {
  constructor(options = {}) {
    this.endpoint = options.endpoint || process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';
    this.model = options.model || process.env.GEMMA_MODEL || 'gemma2:2b';
    this.timeoutMs = options.timeoutMs || 2500;
  }

  /**
   * Formats a user prompt with Gemma 2 instruction tokens
   */
  formatGemma2Prompt(systemContext, userPrompt) {
    return `<start_of_turn>user\n${systemContext}\n\n${userPrompt}<end_of_turn>\n<start_of_turn>model\n`;
  }

  /**
   * Attempts local inference with an open Ollama/vLLM daemon running Gemma 2.
   * Gracefully falls back to deterministic local reasoning if the daemon is unavailable.
   */
  async generate(systemContext, userPrompt, fallbackFn) {
    const formattedPrompt = this.formatGemma2Prompt(systemContext, userPrompt);
    const startTime = Date.now();

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);

      const response = await fetch(`${this.endpoint}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          prompt: formattedPrompt,
          stream: false,
          options: {
            temperature: 0.3,
            top_p: 0.9,
            num_ctx: 4096
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timer);

      if (response.ok) {
        const data = await response.json();
        return {
          source: 'ollama-gemma2',
          model: this.model,
          latencyMs: Date.now() - startTime,
          rawPrompt: formattedPrompt,
          output: data.response
        };
      }
    } catch {
      // Ollama daemon not active or timed out - fall back to deterministic local reasoning
    }

    // High-precision local heuristic fallback
    const localResult = fallbackFn();
    return {
      source: 'local-gemma-harness',
      model: `${this.model} (heuristic-replica)`,
      latencyMs: Date.now() - startTime,
      rawPrompt: formattedPrompt,
      output: localResult
    };
  }
}
