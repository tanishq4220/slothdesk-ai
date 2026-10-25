/**
 * SlothDesk AI — Frontend Application Logic & Procedural Web Audio Engine
 */

let PRESETS = null;
let currentSortResult = null;
let activeScriptLang = 'ps';

// Procedural Web Audio Synthesizer State
let audioCtx = null;
let isAudioPlaying = false;
let rainNode = null;
let windNode = null;
let fireTimer = null;
let droneOsc = null;
let droneGain = null;
let masterGain = null;
let rainGain = null;
let windGain = null;
let fireGain = null;

document.addEventListener('DOMContentLoaded', async () => {
  initTabs();
  initCopyButtons();
  initDrawer();
  await loadStatusAndPresets();
  initDigestTab();
  initReplyTab();
  initSortTab();
  initSanctuaryTab();
});

// Toast notification helper
function showToast(msg = 'Copied to clipboard!') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

// 1. Navigation Tabs
function initTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const targetPane = document.getElementById(`pane-${tab.dataset.tab}`);
      if (targetPane) targetPane.classList.add('active');
    });
  });
}

// 2. Clipboard Helpers
function initCopyButtons() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-copy');
    if (btn) {
      const text = btn.dataset.copy || btn.getAttribute('data-text');
      if (text) {
        navigator.clipboard.writeText(text).then(() => showToast('Copied to clipboard!'));
      }
    }
  });
}

// 3. Engine Drawer
function initDrawer() {
  const btn = document.getElementById('btn-toggle-engine-drawer');
  const drawer = document.getElementById('engine-drawer');
  if (btn && drawer) {
    btn.addEventListener('click', () => {
      drawer.classList.toggle('open');
      btn.textContent = drawer.classList.contains('open') ? 'Hide Gemma 2 Harness' : 'Inspect Gemma 2 Harness';
    });
  }
}

// 4. Load Status & Curated Presets
async function loadStatusAndPresets() {
  try {
    const [statusRes, presetsRes] = await Promise.all([
      fetch('/api/status'),
      fetch('/api/presets')
    ]);

    if (statusRes.ok) {
      const s = await statusRes.json();
      const statusText = document.getElementById('system-status-text');
      if (statusText) {
        statusText.textContent = `Gemma 2 Engine: ${s.mode}`;
      }
      if (s.stats) {
        updateHUD(s.stats);
      }
    }

    if (presetsRes.ok) {
      PRESETS = await presetsRes.json();
    }
  } catch (err) {
    console.warn('Initial status fetch error:', err);
  }
}

function updateHUD(stats) {
  if (!stats) return;
  const m = document.getElementById('hud-minutes-saved');
  const r = document.getElementById('hud-replies-drafted');
  const f = document.getElementById('hud-files-tamed');
  const p = document.getElementById('hud-sloth-peace');
  if (m) m.textContent = stats.totalMinutesConserved || 420;
  if (r) r.textContent = stats.totalRepliesDrafted || 22;
  if (f) f.textContent = stats.totalFilesTamed || 84;
  if (p) p.textContent = `${stats.slothPeaceIndex || 98.4}%`;
}

// ==========================================
// TAB 1: SLOTH DIGEST
// ==========================================
function initDigestTab() {
  const input = document.getElementById('digest-input');
  const btnSlack = document.getElementById('btn-preset-slack');
  const btnFamily = document.getElementById('btn-preset-family');
  const btnClient = document.getElementById('btn-preset-client');
  const btnRun = document.getElementById('btn-run-digest');

  // Set initial text from Slack preset
  if (PRESETS && PRESETS.digest && PRESETS.digest.engineeringSlack) {
    input.value = PRESETS.digest.engineeringSlack.rawText;
  }

  function setActivePreset(activeBtn, text) {
    [btnSlack, btnFamily, btnClient].forEach(b => b.classList.remove('active'));
    activeBtn.classList.add('active');
    input.value = text;
  }

  btnSlack.addEventListener('click', () => {
    if (PRESETS?.digest?.engineeringSlack) setActivePreset(btnSlack, PRESETS.digest.engineeringSlack.rawText);
  });
  btnFamily.addEventListener('click', () => {
    if (PRESETS?.digest?.familyWhatsApp) setActivePreset(btnFamily, PRESETS.digest.familyWhatsApp.rawText);
  });
  btnClient.addEventListener('click', () => {
    if (PRESETS?.digest?.clientFeedback) setActivePreset(btnClient, PRESETS.digest.clientFeedback.rawText);
  });

  btnRun.addEventListener('click', async () => {
    const rawText = input.value.trim();
    if (!rawText) return;

    btnRun.disabled = true;
    btnRun.innerHTML = '<span>🦥</span><span>Compressing with Gemma 2...</span>';

    try {
      const res = await fetch('/api/digest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText })
      });

      if (res.ok) {
        const data = await res.json();
        renderDigestOutput(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      btnRun.disabled = false;
      btnRun.innerHTML = '<span>🦥</span><span>Distill With Gemma 2</span>';
    }
  });
}

function renderDigestOutput(data) {
  // 1. Badge & hint
  const badge = document.getElementById('digest-saved-badge');
  if (badge && data.stats) {
    badge.textContent = `${data.stats.minutesSaved} mins reading saved (${data.stats.cognitiveEnergyConservedPct}% noise cut)`;
  }

  const hint = document.getElementById('digest-engine-hint');
  if (hint && data.meta) {
    hint.textContent = `Inferred in ${data.meta.latencyMs}ms via ${data.meta.model}`;
  }

  // 2. Truth list
  const truthList = document.getElementById('digest-truth-list');
  if (truthList && data.truth) {
    truthList.innerHTML = data.truth.map(item => `<li>${escapeHtml(item)}</li>`).join('');
  }

  // 3. Waiting / Blockers
  const waitingBox = document.getElementById('digest-waiting-container');
  if (waitingBox && data.waitingOnYou) {
    waitingBox.innerHTML = data.waitingOnYou.map(w => `
      <div class="waiting-card">
        <div class="waiting-person">${escapeHtml(w.person)}</div>
        <div class="waiting-task">${escapeHtml(w.question)}</div>
        <div class="waiting-meta">
          <span class="urgency-pill medium">${escapeHtml(w.urgency)}</span>
          <span class="wait-note">${w.blocked ? 'Pending your word' : 'Clear to ignore'}</span>
        </div>
      </div>
    `).join('');
  }

  // 4. Lazy Replies
  const repliesList = document.getElementById('digest-replies-list');
  if (repliesList && data.lazyReplies) {
    repliesList.innerHTML = data.lazyReplies.map(r => `
      <div class="lazy-reply-card">
        <div class="reply-header">
          <span class="reply-label">${escapeHtml(r.label)}</span>
          <button class="btn-copy" data-copy="${escapeQuotes(r.text)}">Copy to Clipboard</button>
        </div>
        <p class="reply-text">"${escapeHtml(r.text)}"</p>
      </div>
    `).join('');
  }

  showToast('Brief successfully distilled!');
}

// ==========================================
// TAB 2: SLOTH REPLY
// ==========================================
function initReplyTab() {
  const input = document.getElementById('reply-input');
  const btnZoom = document.getElementById('btn-preset-reply-zoom');
  const btnWeekend = document.getElementById('btn-preset-reply-weekend');
  const btnScope = document.getElementById('btn-preset-reply-scope');
  const btnRun = document.getElementById('btn-run-reply');
  const btnCopy = document.getElementById('btn-copy-reply');

  function setActivePreset(btn, text) {
    [btnZoom, btnWeekend, btnScope].forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    input.value = text;
  }

  btnZoom.addEventListener('click', () => {
    if (PRESETS?.reply?.zoomMeeting) setActivePreset(btnZoom, PRESETS.reply.zoomMeeting.incoming);
  });
  btnWeekend.addEventListener('click', () => {
    if (PRESETS?.reply?.weekendFire) setActivePreset(btnWeekend, PRESETS.reply.weekendFire.incoming);
  });
  btnScope.addEventListener('click', () => {
    if (PRESETS?.reply?.scopeCreep) setActivePreset(btnScope, PRESETS.reply.scopeCreep.incoming);
  });

  btnRun.addEventListener('click', async () => {
    const incomingRequest = input.value.trim();
    if (!incomingRequest) return;

    const energyLevel = document.querySelector('input[name="energy-level"]:checked')?.value || 'zen';

    btnRun.disabled = true;
    btnRun.innerHTML = '<span>🛡️</span><span>Drafting Defense...</span>';

    try {
      const res = await fetch('/api/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incomingRequest, energyLevel, intent: 'async' })
      });

      if (res.ok) {
        const data = await res.json();
        renderReplyOutput(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      btnRun.disabled = false;
      btnRun.innerHTML = '<span>🛡️</span><span>Generate Diplomatic Pushback</span>';
    }
  });

  btnCopy.addEventListener('click', () => {
    const text = document.getElementById('reply-body')?.textContent;
    if (text) {
      navigator.clipboard.writeText(text).then(() => showToast('Email draft copied!'));
    }
  });
}

function renderReplyOutput(data) {
  const badge = document.getElementById('reply-saved-badge');
  if (badge) badge.textContent = `${data.effortConservedMinutes || 45} mins preserved`;

  const subject = document.getElementById('reply-subject');
  if (subject) subject.textContent = data.subject || 'Re: Update';

  const body = document.getElementById('reply-body');
  if (body) body.textContent = data.draft;

  const insight = document.getElementById('reply-insight-text');
  if (insight) insight.textContent = data.slothTip || 'Protects your calendar and peace of mind.';

  showToast('Pushback drafted!');
}

// ==========================================
// TAB 3: SLOTH SORT
// ==========================================
function initSortTab() {
  const input = document.getElementById('sort-input');
  const btnPreset = document.getElementById('btn-preset-sort-downloads');
  const btnRun = document.getElementById('btn-run-sort');
  const btnCopyScript = document.getElementById('btn-copy-script');
  const scriptTabs = document.querySelectorAll('.script-tab');

  if (PRESETS?.sort?.messyDownloads) {
    input.value = PRESETS.sort.messyDownloads.fileList.join('\n');
    // Pre-run organize on load so the tab is never empty
    triggerSort();
  }

  btnPreset.addEventListener('click', () => {
    if (PRESETS?.sort?.messyDownloads) {
      input.value = PRESETS.sort.messyDownloads.fileList.join('\n');
      triggerSort();
    }
  });

  btnRun.addEventListener('click', triggerSort);

  async function triggerSort() {
    const text = input.value.trim();
    if (!text) return;
    const fileList = text.split('\n').map(s => s.trim()).filter(Boolean);

    btnRun.disabled = true;
    btnRun.innerHTML = '<span>📁</span><span>Tidying Clutter...</span>';

    try {
      const res = await fetch('/api/sort', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileList })
      });

      if (res.ok) {
        currentSortResult = await res.json();
        renderSortOutput(currentSortResult);
      }
    } catch (err) {
      console.error(err);
    } finally {
      btnRun.disabled = false;
      btnRun.innerHTML = '<span>📁</span><span>Tidy Clutter & Generate Scripts</span>';
    }
  }

  scriptTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      scriptTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeScriptLang = tab.dataset.lang;
      renderScriptCode();
    });
  });

  btnCopyScript.addEventListener('click', () => {
    if (!currentSortResult || !currentSortResult.scripts) return;
    const code = activeScriptLang === 'ps' ? currentSortResult.scripts.powershell : currentSortResult.scripts.bash;
    navigator.clipboard.writeText(code).then(() => showToast(`1-Click ${activeScriptLang === 'ps' ? 'PowerShell' : 'Bash'} cleanup script copied!`));
  });
}

function renderSortOutput(data) {
  const badge = document.getElementById('sort-saved-badge');
  if (badge) badge.textContent = `${data.timeSavedMinutes || 35} mins saved`;

  const container = document.getElementById('taxonomy-container');
  if (container && data.taxonomy) {
    container.innerHTML = data.taxonomy.filter(c => c.count > 0).map(cat => `
      <div class="cat-box">
        <div class="cat-header">
          <span>${escapeHtml(cat.categoryName)}</span>
          <span class="cat-folder">/${cat.folderPath}/ (${cat.count} files)</span>
        </div>
        <ul class="cat-items">
          ${cat.items.map(i => `
            <li class="cat-item">
              <span>${escapeHtml(i.original)}</span>
              <span class="cat-arrow">→</span>
              <strong>${escapeHtml(i.cleaned)}</strong>
            </li>
          `).join('')}
        </ul>
      </div>
    `).join('');
  }

  renderScriptCode();
}

function renderScriptCode() {
  const codeEl = document.getElementById('script-code-display');
  if (!codeEl || !currentSortResult || !currentSortResult.scripts) return;
  codeEl.textContent = activeScriptLang === 'ps' ? currentSortResult.scripts.powershell : currentSortResult.scripts.bash;
}

// ==========================================
// TAB 4: SLOTH SANCTUARY & PROCEDURAL AUDIO
// ==========================================
function initSanctuaryTab() {
  const btnToggle = document.getElementById('btn-toggle-audio');
  const btnLabel = document.getElementById('audio-btn-label');
  const btnNewFable = document.getElementById('btn-new-fable');
  const btnCopyFable = document.getElementById('btn-copy-fable');
  const themeChips = document.querySelectorAll('.theme-chip');

  // Sliders with immediate Web Audio gain response
  const slRain = document.getElementById('vol-rain');
  const slWind = document.getElementById('vol-wind');
  const slFire = document.getElementById('vol-fire');
  const slDrone = document.getElementById('vol-drone');

  slRain.addEventListener('input', e => {
    const pct = parseInt(e.target.value, 10);
    document.getElementById('val-rain').textContent = `${pct}%`;
    const val = (pct / 100) * 0.8;
    if (rainGain && audioCtx) {
      rainGain.gain.setValueAtTime(val, audioCtx.currentTime);
      rainGain.gain.value = val;
    }
  });
  slWind.addEventListener('input', e => {
    const pct = parseInt(e.target.value, 10);
    document.getElementById('val-wind').textContent = `${pct}%`;
    const val = (pct / 100) * 0.85;
    if (windGain && audioCtx) {
      windGain.gain.setValueAtTime(val, audioCtx.currentTime);
      windGain.gain.value = val;
    }
  });
  slFire.addEventListener('input', e => {
    const pct = parseInt(e.target.value, 10);
    document.getElementById('val-fire').textContent = `${pct}%`;
    const val = (pct / 100) * 0.9;
    if (fireGain && audioCtx) {
      fireGain.gain.setValueAtTime(val, audioCtx.currentTime);
      fireGain.gain.value = val;
    }
  });
  slDrone.addEventListener('input', e => {
    const pct = parseInt(e.target.value, 10);
    document.getElementById('val-drone').textContent = `${pct}%`;
    const val = (pct / 100) * 0.6;
    if (droneGain && audioCtx) {
      droneGain.gain.setValueAtTime(val, audioCtx.currentTime);
      droneGain.gain.value = val;
    }
  });

  // Toggle procedural audio
  btnToggle.addEventListener('click', () => {
    if (!isAudioPlaying) {
      isAudioPlaying = true;
      startProceduralAudio();
      btnToggle.classList.add('playing');
      btnLabel.textContent = 'Pause Ambient Sanctuary';
    } else {
      isAudioPlaying = false;
      pauseProceduralAudio();
      btnToggle.classList.remove('playing');
      btnLabel.textContent = 'Start Ambient Sanctuary';
    }
  });

  // Fable generation
  let activeFableTheme = 'canopyRain';
  themeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      themeChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeFableTheme = chip.dataset.fable;
      fetchFable(activeFableTheme);
    });
  });

  btnNewFable.addEventListener('click', () => fetchFable(activeFableTheme));

  btnCopyFable.addEventListener('click', () => {
    const title = document.getElementById('fable-title')?.textContent;
    const body = document.getElementById('fable-body')?.innerText;
    if (title && body) {
      navigator.clipboard.writeText(`${title}\n\n${body}`).then(() => showToast('Bedtime fable copied!'));
    }
  });
}

// Procedural Web Audio API Synthesis Engine (100% Offline, Zero Network Audio Files)
let audioNodesInitialized = false;

async function startProceduralAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    try {
      await audioCtx.resume();
    } catch (e) {
      console.warn('AudioContext resume:', e);
    }
  }

  if (audioNodesInitialized) {
    if (!fireTimer && isAudioPlaying) {
      scheduleCrackle();
    }
    return;
  }
  audioNodesInitialized = true;

  // Create clean master gain
  masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0.85, audioCtx.currentTime);
  masterGain.connect(audioCtx.destination);

  const bufferSize = audioCtx.sampleRate * 2;

  // -------------------------------------------------------------
  // 1. Rain Synthesizer (Filtered Pink Noise)
  // -------------------------------------------------------------
  const rainBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const rainData = rainBuffer.getChannelData(0);
  let rb0 = 0, rb1 = 0, rb2 = 0, rb3 = 0, rb4 = 0, rb5 = 0, rb6 = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    rb0 = 0.99886 * rb0 + white * 0.0555179;
    rb1 = 0.99332 * rb1 + white * 0.0750759;
    rb2 = 0.96900 * rb2 + white * 0.1538520;
    rb3 = 0.86650 * rb3 + white * 0.3104856;
    rb4 = 0.55000 * rb4 + white * 0.5329522;
    rb5 = -0.7616 * rb5 - white * 0.0168980;
    rainData[i] = (rb0 + rb1 + rb2 + rb3 + rb4 + rb5 + rb6 + white * 0.5362) * 0.06;
    rb6 = white * 0.115926;
  }

  rainNode = audioCtx.createBufferSource();
  rainNode.buffer = rainBuffer;
  rainNode.loop = true;

  const rainFilter = audioCtx.createBiquadFilter();
  rainFilter.type = 'lowpass';
  rainFilter.frequency.setValueAtTime(950, audioCtx.currentTime);

  rainGain = audioCtx.createGain();
  const rainVol = (parseInt(document.getElementById('vol-rain')?.value || 45, 10) / 100) * 0.7;
  rainGain.gain.setValueAtTime(rainVol, audioCtx.currentTime);

  rainNode.connect(rainFilter);
  rainFilter.connect(rainGain);
  rainGain.connect(masterGain);
  rainNode.start();

  // -------------------------------------------------------------
  // 2. Canopy Breeze (Lush Brown Noise + Dynamic Sweeping Bandpass)
  // -------------------------------------------------------------
  const windBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const windData = windBuffer.getChannelData(0);
  let lastBrown = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    lastBrown = (lastBrown + (0.025 * white)) / 1.025;
    windData[i] = lastBrown * 2.8; // Rich, resonant brownian noise floor
  }

  windNode = audioCtx.createBufferSource();
  windNode.buffer = windBuffer;
  windNode.loop = true;

  const windFilter = audioCtx.createBiquadFilter();
  windFilter.type = 'bandpass';
  windFilter.frequency.setValueAtTime(420, audioCtx.currentTime);
  windFilter.Q.setValueAtTime(1.8, audioCtx.currentTime);

  // Slow LFO for natural canopy swell (0.1Hz = 10 second wave)
  const windLfo = audioCtx.createOscillator();
  windLfo.frequency.setValueAtTime(0.1, audioCtx.currentTime);
  const windLfoGain = audioCtx.createGain();
  windLfoGain.gain.setValueAtTime(260, audioCtx.currentTime);
  windLfo.connect(windLfoGain);
  windLfoGain.connect(windFilter.frequency);
  windLfo.start();

  windGain = audioCtx.createGain();
  const windVol = (parseInt(document.getElementById('vol-wind')?.value || 30, 10) / 100) * 0.85;
  windGain.gain.setValueAtTime(windVol, audioCtx.currentTime);

  windNode.connect(windFilter);
  windFilter.connect(windGain);
  windGain.connect(masterGain);
  windNode.start();

  // -------------------------------------------------------------
  // 3. Hearthside Fire Crackle (Ember Bed + Dynamic Wood Snaps & Pops)
  // -------------------------------------------------------------
  fireGain = audioCtx.createGain();
  const fireVol = (parseInt(document.getElementById('vol-fire')?.value || 25, 10) / 100) * 0.9;
  fireGain.gain.setValueAtTime(fireVol, audioCtx.currentTime);
  fireGain.connect(masterGain);

  // 3a. Continuous gentle ember bed (low rumble/hiss)
  const emberBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const emberData = emberBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    emberData[i] = (Math.random() * 2 - 1) * 0.04;
  }
  const emberNode = audioCtx.createBufferSource();
  emberNode.buffer = emberBuffer;
  emberNode.loop = true;
  const emberFilter = audioCtx.createBiquadFilter();
  emberFilter.type = 'lowpass';
  emberFilter.frequency.setValueAtTime(450, audioCtx.currentTime);
  emberNode.connect(emberFilter);
  emberFilter.connect(fireGain);
  emberNode.start();

  // Start the continuous crackle scheduler
  if (!fireTimer) {
    scheduleCrackle();
  }

  // -------------------------------------------------------------
  // 4. 432Hz Calm Alpha Drone (Pure Meditative Foundation)
  // -------------------------------------------------------------
  droneOsc = audioCtx.createOscillator();
  droneOsc.type = 'sine';
  droneOsc.frequency.setValueAtTime(108, audioCtx.currentTime); // Sub-bass octave of 432Hz

  const droneOsc2 = audioCtx.createOscillator();
  droneOsc2.type = 'sine';
  droneOsc2.frequency.setValueAtTime(109.5, audioCtx.currentTime); // 1.5Hz binaural alpha pulsation

  droneGain = audioCtx.createGain();
  const droneVol = (parseInt(document.getElementById('vol-drone')?.value || 25, 10) / 100) * 0.5;
  droneGain.gain.setValueAtTime(droneVol, audioCtx.currentTime);

  droneOsc.connect(droneGain);
  droneOsc2.connect(droneGain);
  droneGain.connect(masterGain);

  droneOsc.start();
  droneOsc2.start();
}

// Stochastic wood pops and snaps
function scheduleCrackle() {
  if (!isAudioPlaying || !audioCtx || audioCtx.state !== 'running') return;
  const now = audioCtx.currentTime;

  // Generate either a sharp high snap or a warm wooden thump
  const isSnap = Math.random() > 0.35;
  const osc = audioCtx.createOscillator();
  const snapGain = audioCtx.createGain();

  if (isSnap) {
    // High timber snap / spark (1200Hz - 3400Hz)
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200 + Math.random() * 2200, now);
    snapGain.gain.setValueAtTime(0.4 + Math.random() * 0.35, now);
    snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
  } else {
    // Deep wood log settling thump (180Hz - 480Hz)
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180 + Math.random() * 300, now);
    snapGain.gain.setValueAtTime(0.45 + Math.random() * 0.3, now);
    snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
  }

  osc.connect(snapGain);
  snapGain.connect(fireGain);

  osc.start(now);
  osc.stop(now + 0.06);

  // Schedule next crackle between 60ms and 220ms
  const nextInterval = 60 + Math.random() * 160;
  fireTimer = setTimeout(scheduleCrackle, nextInterval);
}

function pauseProceduralAudio() {
  if (fireTimer) {
    clearTimeout(fireTimer);
    fireTimer = null;
  }
  if (audioCtx && audioCtx.state === 'running') {
    audioCtx.suspend();
  }
}

async function fetchFable(theme) {
  const btn = document.getElementById('btn-new-fable');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span>🦥</span><span>Dreaming with Gemma 2...</span>';
  }

  try {
    const res = await fetch('/api/fable', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme })
    });

    if (res.ok) {
      const data = await res.json();
      document.getElementById('fable-title').textContent = data.title;
      document.getElementById('fable-setting').textContent = data.setting;
      document.getElementById('fable-bpm-badge').textContent = data.bpmTarget || '46 BPM (Deep Rest)';
      document.getElementById('fable-body').innerHTML = data.story
        .split('\n\n')
        .map(p => `<p>${escapeHtml(p)}</p>`)
        .join('');
      showToast('New bedtime fable ready');
    }
  } catch (err) {
    console.error(err);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<span>🦥</span><span>Generate Another Fable</span>';
    }
  }
}

// Helpers
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeQuotes(str) {
  if (!str) return '';
  return String(str).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
