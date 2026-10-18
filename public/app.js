/**
 * ScopeShield AI - Frontend Application
 */

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initPresets();
  initAuditor();
  initSOW();
  initEmailDrafter();
  initCalculator();
  initModelDiagnostics();
});

// -------------------------------------------------------------
// 1. TABS NAVIGATION
// -------------------------------------------------------------
function initTabs() {
  const buttons = document.querySelectorAll(".tab-btn");
  const contents = document.querySelectorAll(".tab-content");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const tabName = btn.getAttribute("data-tab");

      buttons.forEach(b => {
        b.classList.remove("active", "bg-indigo-600", "text-white", "shadow-sm", "shadow-indigo-500/30");
        b.classList.add("text-slate-300", "hover:text-white", "hover:bg-slate-800");
      });
      btn.classList.add("active", "bg-indigo-600", "text-white", "shadow-sm", "shadow-indigo-500/30");
      btn.classList.remove("text-slate-300", "hover:text-white", "hover:bg-slate-800");

      contents.forEach(content => {
        if (content.id === `tab-${tabName}`) {
          content.classList.remove("hidden");
          content.classList.add("block");
        } else {
          content.classList.add("hidden");
          content.classList.remove("block");
        }
      });
    });
  });
}

// -------------------------------------------------------------
// 2. PRESETS LOADER
// -------------------------------------------------------------
let cachedPresets = [];

async function initPresets() {
  const contractInput = document.getElementById("contract-input");
  const clearBtn = document.getElementById("clear-input");

  clearBtn.addEventListener("click", () => {
    contractInput.value = "";
    document.getElementById("audit-placeholder").classList.remove("hidden");
    document.getElementById("audit-results").classList.add("hidden");
  });

  try {
    const res = await fetch("/api/presets");
    if (res.ok) {
      const data = await res.json();
      cachedPresets = data.presets || [];
    }
  } catch (e) {
    console.error("Failed to load presets:", e);
  }

  const loadPreset = (presetId) => {
    const p = cachedPresets.find(item => item.id === presetId);
    if (p) {
      contractInput.value = p.text;
      runAudit();
    }
  };

  document.getElementById("preset-predatory")?.addEventListener("click", () => loadPreset("predatory-msa"));
  document.getElementById("preset-vague")?.addEventListener("click", () => loadPreset("vague-creative-brief"));
  document.getElementById("preset-safe")?.addEventListener("click", () => loadPreset("balanced-sow"));

  // Auto-load predatory preset on first view to give instant wow factor
  if (cachedPresets.length > 0) {
    loadPreset("predatory-msa");
  } else {
    // If presets fetch hasn't completed yet, retry in 200ms
    setTimeout(() => {
      if (cachedPresets.length > 0) loadPreset("predatory-msa");
    }, 250);
  }
}

// -------------------------------------------------------------
// 3. CONTRACT AUDITOR
// -------------------------------------------------------------
let currentFindings = [];

function initAuditor() {
  const auditBtn = document.getElementById("btn-run-audit");
  auditBtn.addEventListener("click", runAudit);

  document.getElementById("btn-copy-all-shields")?.addEventListener("click", () => {
    if (!currentFindings || currentFindings.length === 0) return;
    const allShields = currentFindings
      .map((f, i) => `### Counter-Clause ${i + 1}: ${f.title}\n${f.shieldClause}`)
      .join("\n\n");
    navigator.clipboard.writeText(allShields);
    alert("All recommended counter-clauses copied to clipboard!");
  });
}

async function runAudit() {
  const text = document.getElementById("contract-input").value.trim();
  const spinner = document.getElementById("audit-spinner");
  const placeholder = document.getElementById("audit-placeholder");
  const results = document.getElementById("audit-results");

  if (!text) {
    alert("Please enter contract or scope text to audit.");
    return;
  }

  spinner.classList.remove("hidden");

  try {
    const res = await fetch("/api/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, useLiveGemma: false })
    });

    if (!res.ok) {
      throw new Error("Audit request failed.");
    }

    const json = await res.json();
    const data = json.data;
    currentFindings = data.findings || [];

    placeholder.classList.add("hidden");
    results.classList.remove("hidden");

    // Update Score Circle & Grade
    const scoreCircle = document.getElementById("score-circle");
    const scoreGrade = document.getElementById("score-grade");
    const scoreNumber = document.getElementById("score-number");
    const riskBadge = document.getElementById("risk-level-badge");
    const findingsPill = document.getElementById("findings-pill");
    const summaryText = document.getElementById("risk-summary-text");
    const exposureAmount = document.getElementById("exposure-amount");

    scoreGrade.textContent = data.grade;
    scoreNumber.textContent = `${data.score}/100`;
    riskBadge.textContent = data.riskLevel;
    findingsPill.textContent = `${data.findingsCount} Issues Flagged`;
    summaryText.textContent = data.summary;
    exposureAmount.textContent = data.estimatedLoss;

    // Badge & Grade Color Styling
    scoreCircle.className = "w-16 h-16 rounded-2xl flex flex-col items-center justify-center shadow-lg border-2";
    if (data.score > 75) {
      scoreCircle.classList.add("bg-red-950", "border-red-600");
      scoreGrade.className = "text-2xl font-black text-red-400 leading-none";
      scoreNumber.className = "text-[10px] font-bold text-red-300";
      riskBadge.className = "text-sm font-bold uppercase tracking-wider text-red-400";
      findingsPill.className = "text-xs px-2 py-0.5 rounded-full bg-red-900/50 text-red-200 border border-red-700/50 font-semibold";
    } else if (data.score > 50) {
      scoreCircle.classList.add("bg-orange-950", "border-orange-600");
      scoreGrade.className = "text-2xl font-black text-orange-400 leading-none";
      scoreNumber.className = "text-[10px] font-bold text-orange-300";
      riskBadge.className = "text-sm font-bold uppercase tracking-wider text-orange-400";
      findingsPill.className = "text-xs px-2 py-0.5 rounded-full bg-orange-900/50 text-orange-200 border border-orange-700/50 font-semibold";
    } else if (data.score > 30) {
      scoreCircle.classList.add("bg-amber-950", "border-amber-600");
      scoreGrade.className = "text-2xl font-black text-amber-400 leading-none";
      scoreNumber.className = "text-[10px] font-bold text-amber-300";
      riskBadge.className = "text-sm font-bold uppercase tracking-wider text-amber-400";
      findingsPill.className = "text-xs px-2 py-0.5 rounded-full bg-amber-900/50 text-amber-200 border border-amber-700/50 font-semibold";
    } else {
      scoreCircle.classList.add("bg-emerald-950", "border-emerald-600");
      scoreGrade.className = "text-2xl font-black text-emerald-400 leading-none";
      scoreNumber.className = "text-[10px] font-bold text-emerald-300";
      riskBadge.className = "text-sm font-bold uppercase tracking-wider text-emerald-400";
      findingsPill.className = "text-xs px-2 py-0.5 rounded-full bg-emerald-900/50 text-emerald-200 border border-emerald-700/50 font-semibold";
    }

    // Update 6 Pillar Bars
    updatePillar("scope", data.pillarScores.scopeClarity);
    updatePillar("revisions", data.pillarScores.revisionPolicy);
    updatePillar("payment", data.pillarScores.paymentTerms);
    updatePillar("ip", data.pillarScores.ipOwnership);
    updatePillar("killfee", data.pillarScores.terminationKillFee);
    updatePillar("liability", data.pillarScores.liabilityExposure);

    // Populate Findings Cards
    const container = document.getElementById("findings-container");
    container.innerHTML = "";

    if (data.findings.length === 0) {
      container.innerHTML = `
        <div class="p-6 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-center">
          <p class="text-sm font-semibold text-emerald-300">🛡️ No critical predatory clauses detected!</p>
          <p class="text-xs text-slate-400 mt-1">This agreement reflects balanced freelance boundaries.</p>
        </div>
      `;
    } else {
      data.findings.forEach((finding, idx) => {
        const card = document.createElement("div");
        card.className = "finding-card bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3";

        const sevBadge = finding.severity === "critical"
          ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-300 border border-red-800/60 uppercase">Critical Trap</span>`
          : finding.severity === "warning"
          ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800/60 uppercase">Warning</span>`
          : `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800/60 uppercase">Caution</span>`;

        card.innerHTML = `
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              ${sevBadge}
              <h5 class="text-xs font-bold text-white">${finding.title}</h5>
            </div>
            <span class="text-[10px] text-slate-500 uppercase tracking-wider">${finding.category}</span>
          </div>

          ${finding.quote ? `
            <div class="bg-slate-950/80 p-2.5 rounded-lg border-l-2 border-red-500 font-mono text-[11px] text-red-200/90 italic">
              "${escapeHtml(finding.quote)}"
            </div>
          ` : ""}

          <p class="text-xs text-slate-300 leading-relaxed">${finding.explanation}</p>

          <div class="bg-indigo-950/40 border border-indigo-900/50 rounded-lg p-3 space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">🛡️ ScopeShield Recommended Counter-Clause</span>
              <button class="btn-copy-clause px-2 py-0.5 rounded text-[10px] bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors" data-clause="${encodeURIComponent(finding.shieldClause)}">
                Copy Clause
              </button>
            </div>
            <p class="text-xs font-mono text-indigo-100/90 leading-relaxed">${escapeHtml(finding.shieldClause)}</p>
          </div>
        `;

        container.appendChild(card);
      });

      // Bind copy buttons
      document.querySelectorAll(".btn-copy-clause").forEach(b => {
        b.addEventListener("click", (e) => {
          const clause = decodeURIComponent(e.target.getAttribute("data-clause"));
          navigator.clipboard.writeText(clause);
          const origText = e.target.textContent;
          e.target.textContent = "Copied!";
          setTimeout(() => e.target.textContent = origText, 1500);
        });
      });
    }

  } catch (err) {
    alert("Error running contract audit: " + err.message);
  } finally {
    spinner.classList.add("hidden");
  }
}

function updatePillar(id, val) {
  const textEl = document.getElementById(`pillar-${id}`);
  const barEl = document.getElementById(`bar-${id}`);
  if (!textEl || !barEl) return;

  textEl.textContent = `${val}%`;
  barEl.style.width = `${val}%`;

  barEl.className = "h-1.5 rounded-full transition-all duration-500";
  textEl.className = "font-bold text-[11px]";

  if (val > 65) {
    barEl.classList.add("bg-red-500");
    textEl.classList.add("text-red-400");
  } else if (val > 35) {
    barEl.classList.add("bg-amber-500");
    textEl.classList.add("text-amber-400");
  } else {
    barEl.classList.add("bg-emerald-500");
    textEl.classList.add("text-emerald-400");
  }
}

// -------------------------------------------------------------
// 4. SOW GENERATOR
// -------------------------------------------------------------
function initSOW() {
  const btn = document.getElementById("btn-generate-sow");
  const copyBtn = document.getElementById("btn-copy-sow");
  const preview = document.getElementById("sow-preview");

  const generate = async () => {
    const payload = {
      projectName: document.getElementById("sow-project-name").value,
      clientName: document.getElementById("sow-client-name").value,
      freelancerName: document.getElementById("sow-freelancer-name").value,
      totalFee: Number(document.getElementById("sow-fee").value),
      hourlyRate: Number(document.getElementById("sow-rate").value),
      timelineWeeks: Number(document.getElementById("sow-weeks").value),
      scopeNotes: document.getElementById("sow-scope").value,
      outOfScopeNotes: document.getElementById("sow-out-of-scope").value
    };

    try {
      const res = await fetch("/api/generate-sow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const json = await res.json();
        preview.textContent = json.data.markdown;
      }
    } catch (e) {
      console.error("Failed to generate SOW:", e);
    }
  };

  btn.addEventListener("click", generate);
  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(preview.textContent);
    copyBtn.textContent = "Copied SOW!";
    setTimeout(() => copyBtn.textContent = "Copy Markdown", 1500);
  });

  generate(); // Initial generation
}

// -------------------------------------------------------------
// 5. PUSHBACK EMAIL DRAFTER
// -------------------------------------------------------------
function initEmailDrafter() {
  const scenarioSelect = document.getElementById("email-scenario");
  const draftBtn = document.getElementById("btn-draft-email");
  const copyBtn = document.getElementById("btn-copy-email");

  const updateFieldsVisibility = () => {
    const scenario = scenarioSelect.value;
    const featWrap = document.getElementById("wrapper-feature");
    const invWrap = document.getElementById("wrapper-invoice");

    if (scenario === "out_of_scope") {
      featWrap.classList.remove("hidden");
      invWrap.classList.add("hidden");
    } else if (scenario === "overdue_invoice") {
      featWrap.classList.add("hidden");
      invWrap.classList.remove("hidden");
    } else {
      featWrap.classList.add("hidden");
      invWrap.classList.add("hidden");
    }
  };

  scenarioSelect.addEventListener("change", updateFieldsVisibility);

  const generateEmail = async () => {
    const payload = {
      scenario: scenarioSelect.value,
      clientName: document.getElementById("email-client-name").value,
      freelancerName: document.getElementById("email-freelancer-name").value,
      projectName: document.getElementById("email-project-name").value,
      hourlyRate: Number(document.getElementById("email-rate").value),
      featureDescription: document.getElementById("email-feature").value,
      invoiceNumber: document.getElementById("email-inv-num").value,
      daysOverdue: Number(document.getElementById("email-days-overdue").value)
    };

    try {
      const res = await fetch("/api/draft-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const json = await res.json();
        document.getElementById("email-subject").textContent = json.data.subject;
        document.getElementById("email-body").textContent = json.data.body;
      }
    } catch (e) {
      console.error("Failed to draft email:", e);
    }
  };

  draftBtn.addEventListener("click", generateEmail);
  copyBtn.addEventListener("click", () => {
    const subj = document.getElementById("email-subject").textContent;
    const body = document.getElementById("email-body").textContent;
    navigator.clipboard.writeText(`Subject: ${subj}\n\n${body}`);
    copyBtn.textContent = "Copied Email!";
    setTimeout(() => copyBtn.textContent = "Copy Email", 1500);
  });

  updateFieldsVisibility();
  generateEmail();
}

// -------------------------------------------------------------
// 6. SCOPE CREEP ROI CALCULATOR
// -------------------------------------------------------------
function initCalculator() {
  const hoursInput = document.getElementById("calc-hours");
  const rateInput = document.getElementById("calc-rate");
  const weeksInput = document.getElementById("calc-weeks");

  const valHours = document.getElementById("val-hours");
  const valRate = document.getElementById("val-rate");
  const valWeeks = document.getElementById("val-weeks");

  const statLoss = document.getElementById("stat-annual-loss");
  const statHours = document.getElementById("stat-annual-hours");
  const statRoi = document.getElementById("stat-roi");

  const calculate = () => {
    const hours = Number(hoursInput.value);
    const rate = Number(rateInput.value);
    const weeks = Number(weeksInput.value);

    valHours.textContent = `${hours} hours/week`;
    valRate.textContent = `$${rate} / hr`;
    valWeeks.textContent = `${weeks} weeks`;

    const totalHours = hours * weeks;
    const totalLoss = totalHours * rate;
    const subscriptionCost = 348; // $29 * 12
    const roi = Math.round(((totalLoss - subscriptionCost) / subscriptionCost) * 100);

    statLoss.textContent = `$${totalLoss.toLocaleString()} / yr`;
    statHours.textContent = `${totalHours.toLocaleString()} Hours`;
    statRoi.textContent = `${Math.max(0, roi).toLocaleString()}%`;
  };

  hoursInput.addEventListener("input", calculate);
  rateInput.addEventListener("input", calculate);
  weeksInput.addEventListener("input", calculate);

  calculate();
}

// -------------------------------------------------------------
// 7. MODEL DIAGNOSTICS
// -------------------------------------------------------------
function initModelDiagnostics() {
  const testBtn = document.getElementById("btn-test-connection");
  const diagMode = document.getElementById("diag-mode");
  const diagOllama = document.getElementById("diag-ollama");

  const checkStatus = async () => {
    try {
      diagOllama.textContent = "Testing connection...";
      const res = await fetch("/api/model-status");
      if (res.ok) {
        const data = await res.json();
        if (data.connected) {
          diagMode.textContent = `Live Open-Weights (${data.activeModel})`;
          diagMode.className = "text-indigo-400 font-bold";
          diagOllama.textContent = `Connected at ${data.endpoint} (${data.availableModels.length} models)`;
          diagOllama.className = "text-emerald-400 font-mono";
        } else {
          diagMode.textContent = "Deterministic Gemma 2 Rule Engine (Ready & Shielded)";
          diagMode.className = "text-emerald-300 font-medium";
          diagOllama.textContent = "Offline (Standalone local heuristics active with 0ms latency)";
          diagOllama.className = "text-slate-400";
        }
      }
    } catch (e) {
      diagOllama.textContent = "Local Server Pinged (Running Fallback)";
    }
  };

  testBtn.addEventListener("click", checkStatus);
  checkStatus();
}

function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
