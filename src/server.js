/**
 * SlothDesk AI - Main Express API & Web Server
 * Hacktoberfest 2026: Open-Source AI Challenge - Week 3 (Slow and Steady)
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { GemmaEngine } from './engine/gemma.js';
import { DigestEngine } from './engine/digestEngine.js';
import { ReplyEngine } from './engine/replyEngine.js';
import { SortEngine } from './engine/sortEngine.js';
import { SanctuaryEngine } from './engine/sanctuaryEngine.js';
import { PRESETS } from './engine/presets.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, '../public')));

// Initialize AI engines
const gemma = new GemmaEngine({
  model: process.env.GEMMA_MODEL || 'gemma2:2b',
  endpoint: process.env.OLLAMA_HOST || 'http://127.0.0.1:11434'
});

const digestEngine = new DigestEngine(gemma);
const replyEngine = new ReplyEngine(gemma);
const sortEngine = new SortEngine(gemma);
const sanctuaryEngine = new SanctuaryEngine(gemma);

// Global Sloth Energy Conserved metrics counter
let globalStats = {
  totalDigestsProcessed: 14,
  totalRepliesDrafted: 22,
  totalFilesTamed: 84,
  totalMinutesConserved: 420,
  slothPeaceIndex: 98.4
};

// --- Endpoints ---

// 1. Health & Status
app.get('/api/status', async (req, res) => {
  let ollamaConnected = false;
  try {
    const check = await fetch(`${gemma.endpoint}/api/tags`, { method: 'GET', signal: AbortSignal.timeout(1200) });
    ollamaConnected = check.ok;
  } catch {
    ollamaConnected = false;
  }

  res.json({
    status: 'online',
    project: 'SlothDesk AI',
    theme: 'Hacktoberfest Week 3: Slow and Steady (International Sloth Day)',
    model: gemma.model,
    ollamaEndpoint: gemma.endpoint,
    ollamaConnected,
    mode: ollamaConnected ? 'Direct Local Gemma 2 Inference' : 'Deterministic Local Fallback Replica',
    stats: globalStats
  });
});

// 2. Curated Presets
app.get('/api/presets', (req, res) => {
  res.json(PRESETS);
});

// 3. Digest Unread Chats
app.post('/api/digest', async (req, res) => {
  try {
    const { rawText } = req.body;
    if (!rawText || !rawText.trim()) {
      return res.status(400).json({ error: 'rawText is required' });
    }
    const result = await digestEngine.digest(rawText);
    globalStats.totalDigestsProcessed += 1;
    globalStats.totalMinutesConserved += (result.stats.minutesSaved || 10);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Draft Low-Energy Reply
app.post('/api/reply', async (req, res) => {
  try {
    const { incomingRequest, energyLevel, intent } = req.body;
    if (!incomingRequest || !incomingRequest.trim()) {
      return res.status(400).json({ error: 'incomingRequest is required' });
    }
    const result = await replyEngine.draft(incomingRequest, { energyLevel, intent });
    globalStats.totalRepliesDrafted += 1;
    globalStats.totalMinutesConserved += (result.effortConservedMinutes || 30);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Clutter & File Tamer
app.post('/api/sort', async (req, res) => {
  try {
    const { fileList } = req.body;
    if (!fileList || (Array.isArray(fileList) && fileList.length === 0)) {
      return res.status(400).json({ error: 'fileList is required' });
    }
    const result = await sortEngine.organize(fileList);
    globalStats.totalFilesTamed += (result.totalFiles || 5);
    globalStats.totalMinutesConserved += (result.timeSavedMinutes || 25);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Bedtime Micro-Fable
app.post('/api/fable', async (req, res) => {
  try {
    const { theme } = req.body;
    const result = await sanctuaryEngine.generateFable(theme || 'canopyRain');
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SPA Fallback
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  🦥 SlothDesk AI Server active at http://localhost:${PORT}`);
  console.log(`  Open-weight engine: ${gemma.model}`);
  console.log(`  Hacktoberfest 2026: Slow & Steady (International Sloth Day)`);
  console.log(`======================================================\n`);
});
