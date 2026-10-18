import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { auditContractText } from "./engine/riskAuditor.js";
import { generateSOW } from "./engine/sowGenerator.js";
import { draftNegotiationEmail } from "./engine/emailDrafter.js";
import { PRESETS } from "./engine/presets.js";
import { GemmaEngine } from "./engine/gemma.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.static(path.join(rootDir, "public")));

const gemma = new GemmaEngine();

// API: Health & Status
app.get("/api/health", async (req, res) => {
  res.json({
    status: "healthy",
    app: "ScopeShield AI",
    version: "1.0.0",
    time: new Date().toISOString()
  });
});

// API: Model Status (Check connection to local Gemma 2 server)
app.get("/api/model-status", async (req, res) => {
  try {
    const status = await gemma.checkHealth();
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: Contract Presets
app.get("/api/presets", (req, res) => {
  res.json({ presets: PRESETS });
});

// API: Audit Contract / SOW
app.post("/api/audit", async (req, res) => {
  try {
    const { text, useLiveGemma = false } = req.body;
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Missing required 'text' field in request body." });
    }

    // Run deterministic 6-pillar analysis
    const auditResult = auditContractText(text);

    // If live Gemma requested and available, enrich with Gemma reasoning
    let gemmaEnrichment = null;
    if (useLiveGemma) {
      const gemmaCheck = await gemma.checkHealth();
      if (gemmaCheck.connected) {
        const prompt = `Analyze the following freelance agreement. Identify the 3 most dangerous clauses for the freelancer and suggest an immediate counter-clause:\n\n${text.substring(0, 3000)}`;
        const gemmaRes = await gemma.generate({
          prompt,
          systemPrompt: "You are ScopeShield AI, a top-tier legal risk auditor protecting independent freelancers from scope creep, unpaid revisions, and predatory contracts."
        });
        if (gemmaRes.success) {
          gemmaEnrichment = gemmaRes.response;
        }
      }
    }

    res.json({
      success: true,
      data: {
        ...auditResult,
        gemmaEnrichment
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: Generate Statement of Work (SOW)
app.post("/api/generate-sow", (req, res) => {
  try {
    const sow = generateSOW(req.body || {});
    res.json({ success: true, data: sow });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: Draft Negotiation Email
app.post("/api/draft-email", (req, res) => {
  try {
    const email = draftNegotiationEmail(req.body || {});
    res.json({ success: true, data: email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fallback to index.html for SPA routing
app.use((req, res) => {
  res.sendFile(path.join(rootDir, "public", "index.html"));
});

// Start Server
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`🛡️  ScopeShield AI running on http://localhost:${PORT}`);
    console.log(`✨ Open-weight Google Gemma 2 ready.`);
  });
}

export default app;
