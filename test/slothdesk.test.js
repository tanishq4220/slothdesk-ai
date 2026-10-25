import test from 'node:test';
import assert from 'node:assert/strict';
import { GemmaEngine } from '../src/engine/gemma.js';
import { DigestEngine } from '../src/engine/digestEngine.js';
import { ReplyEngine } from '../src/engine/replyEngine.js';
import { SortEngine } from '../src/engine/sortEngine.js';
import { SanctuaryEngine } from '../src/engine/sanctuaryEngine.js';
import { PRESETS } from '../src/engine/presets.js';

test('GemmaEngine formats official Gemma 2 instruction tokens', () => {
  const gemma = new GemmaEngine();
  const formatted = gemma.formatGemma2Prompt('System rules', 'User request');
  assert.ok(formatted.includes('<start_of_turn>user\nSystem rules\n\nUser request<end_of_turn>'));
  assert.ok(formatted.includes('<start_of_turn>model\n'));
});

test('DigestEngine compresses unread engineering slack logs into actionable signals', async () => {
  const digestEngine = new DigestEngine();
  const sample = PRESETS.digest.engineeringSlack.rawText;
  const result = await digestEngine.digest(sample);

  assert.ok(result.truth.length > 0, 'Should extract the truth');
  assert.ok(result.waitingOnYou.length > 0, 'Should identify waiting action items');
  assert.ok(result.lazyReplies.length > 0, 'Should offer 1-click lazy replies');
  assert.ok(result.stats.minutesSaved >= 1, 'Should calculate minutes saved');
  assert.ok(result.stats.cognitiveEnergyConservedPct > 70, 'Should report high energy conservation');
});

test('ReplyEngine drafts polite async deferral for 45-min Zoom request', async () => {
  const replyEngine = new ReplyEngine();
  const incoming = PRESETS.reply.zoomMeeting.incoming;
  const result = await replyEngine.draft(incoming, { energyLevel: 'zen', intent: 'async' });

  assert.ok(result.draft.toLowerCase().includes('async') || result.draft.toLowerCase().includes('slack') || result.draft.toLowerCase().includes('questions'));
  assert.ok(result.effortConservedMinutes >= 30, 'Should calculate conserved minutes');
  assert.ok(result.slothTip.length > 0, 'Should include a sloth philosophy tip');
});

test('SortEngine organizes messy files into categorized taxonomy and generates scripts', async () => {
  const sortEngine = new SortEngine();
  const files = PRESETS.sort.messyDownloads.fileList;
  const result = await sortEngine.organize(files);

  assert.strictEqual(result.totalFiles, 14);
  assert.ok(result.taxonomy.some(cat => cat.categoryName === 'Finance & Receipts'));
  assert.ok(result.scripts.powershell.includes('Move-Item'));
  assert.ok(result.scripts.bash.includes('mv '));
  assert.ok(result.timeSavedMinutes > 10);
});

test('SanctuaryEngine generates low-cadence bedtime micro-fable for International Sloth Day', async () => {
  const sanctuary = new SanctuaryEngine();
  const result = await sanctuary.generateFable('canopyRain');

  assert.ok(result.title.length > 0);
  assert.ok(result.story.includes('Barnaby') || result.story.includes('canopy'));
  assert.ok(result.bpmTarget.includes('BPM'));
});
