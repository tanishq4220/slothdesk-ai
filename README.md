# 🦥 SlothDesk AI

> **The Anti-Burnout Desktop Assistant That Rewards Laziness.**  
> *Channel your inner sloth. Automate the dread, compress unread chat noise, draft diplomatic calendar boundaries, auto-tidy desktop clutter, and wind down with offline soundscapes & bedtime micro-fables.*  
> **100% Local-First • Zero Cloud Byte Leakage • $0.00 Runtime Overhead • Powered by Google Gemma 2 (Open Weights)**

---

Built with pride for the **[Hacktoberfest 2026: Open-Source AI Challenge — Week 3: Slow and Steady](https://dev.to/challenges/hacktoberfest-week3-2026-10-19)** in celebration of **International Sloth Day** and DEV's beloved mascot **Sloan the Sloth**.

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Model: Google Gemma 2](https://img.shields.io/badge/Open--Weight-Google%20Gemma%202%20(2B%20%7C%209B)-blue.svg)](https://ai.google.dev/gemma)
[![Node.js Tests](https://img.shields.io/badge/Tests-5%2F5%20Passing-brightgreen.svg)](test/slothdesk.test.js)
[![Offline Web Audio](https://img.shields.io/badge/Web%20Audio-100%25%20Offline%20Procedural-amber.svg)](public/app.js)

---

## 🦥 The Sloth Philosophy: Radical Energy Conservation

Tomorrow, October 20, is **International Sloth Day**. In human culture, sloths are often misunderstood as "lazy." In evolutionary biology, however, sloths (*Bradypus tridactylus*) represent nature’s ultimate endurance masters:
- They move at **0.15 miles per hour**.
- They conserve **over 90% of their metabolic energy** compared to typical mammals of their size.
- They cultivate micro-ecosystems of green algae in their fur that camouflage them from predators and synthesize nutrients without extra effort.
- They **never rush, never overthink, and outlast faster competitors**.

In the modern knowledge economy, workers, developers, and creators squander up to **70% of their daily cognitive energy** on low-value, high-anxiety digital friction:
1. Sifting through **200+ unread messages** across Slack, Discord, and family group chats just to answer: *"Is anyone actually waiting on me?"*
2. Agonizing over how to politely decline **unnecessary 45-minute Zoom syncs** and weekend "quick favors."
3. Staring hopelessly at a Downloads folder filled with **400 chaotic screenshots, invoices, and vague files**.
4. Lying awake at midnight with racing thoughts because the workday never formally decelerated.

**SlothDesk AI was built to automate the cognitive chores you dread, allowing you to move at your own pace and conserve your mental output.**

---

## 🏛️ System Architecture & Gemma 2 Harness

```
                           ┌──────────────────────────────────────────────┐
                           │               🦥 SlothDesk AI                │
                           │   Local-First Anti-Burnout Desktop System    │
                           └──────────────────────┬───────────────────────┘
                                                  │
          ┌───────────────────┬───────────────────┴───────────────────┬───────────────────┐
          ▼                   ▼                                       ▼                   ▼
  ┌───────────────┐   ┌───────────────┐                       ┌───────────────┐   ┌───────────────┐
  │  SlothDigest  │   │  SlothReply   │                       │   SlothSort   │   │SlothSanctuary │
  │ 60-Sec Brief &│   │  Low-Energy   │                       │  Auto-Folder  │   │Offline Audio  │
  │ 1-Click Reply │   │ Boundary Wall │                       │& Script Maker │   │& Bedtime Story│
  └───────┬───────┘   └───────┬───────┘                       └───────┬───────┘   └───────┬───────┘
          │                   │                                       │                   │
          └───────────────────┴───────────────────┬───────────────────┴───────────────────┘
                                                  │
                                                  ▼
                                      ┌───────────────────────┐
                                      │   Gemma Engine Core   │
                                      │  Turn Token Formatter │
                                      └───────────┬───────────┘
                                                  │
                         ┌────────────────────────┴────────────────────────┐
                         ▼                                                 ▼
            ┌───────────────────────────┐                     ┌───────────────────────────┐
            │    Local Ollama / vLLM    │                     │   Deterministic Heuristic │
            │  gemma2:2b / gemma2:9b    │                     │      Replica (0ms Fallback)│
            │   (Offline Local Model)   │                     │  (Zero-Dependency Guard)  │
            └───────────────────────────┘                     └───────────────────────────┘
```

### Official Gemma 2 Instruction Turn Tokens
SlothDesk formats all prompts adhering to Google's official Gemma 2 instruction token standard:

```text
<start_of_turn>user
[SYSTEM CONTEXT: You are SlothDesk's Chat Digest Agent, inspired by International Sloth Day.
Your goal is radical cognitive energy conservation. The user is a developer who hates reading through group chat noise.
Analyze the unread thread and output:
1. "The 60-Second Truth" (Maximum 3 blunt bullet points).
2. "Is Anyone Waiting On You?" (List people who mentioned the user or asked direct questions).
3. "One-Click Lazy Replies" (2 ready-to-copy, polite responses the user can send with zero typing effort).]

Here is the unread message thread:
${rawText}
<end_of_turn>
<start_of_turn>model
```

---

## ⚡ The Four Sloth Modules

### 1. `SlothDigest` — Overnight Chat & Thread Synthesizer
- **The Problem**: Opening Slack or WhatsApp in the morning to 45 unread messages produces an immediate cortisol spike.
- **The Sloth Solution**: Dump the raw chat log into SlothDesk. Gemma 2 immediately returns:
  - **The 60-Second Truth**: 2 to 3 blunt, high-signal bullet points explaining what actually happened.
  - **Is Anyone Waiting on You?**: Identifies specific stakeholders and direct questions, or explicitly confirms: *"No blockers — you are free to do nothing."*
  - **One-Click Lazy Replies**: Pre-formulated, polite responses you can copy with 1 click without typing a single word.

### 2. `SlothReply` — Diplomatic Low-Energy Boundary Drafter
- **The Problem**: Saying "no" to a 45-minute sync or a weekend "quick favor" creates immense social anxiety and awkwardness.
- **The Sloth Solution**: Input the dreaded incoming request and select your **Energy Conservation Level**:
  - *Minimalist* (ultra-terse, under 20 words)
  - *Courteous Zen* (diplomatic, warm, async-first)
  - *Ironclad Perimeter* (unbreachable calendar guard)
- Gemma 2 crafts the exact email subject, body, and **Sloth Principle** explanation, shifting synchronous meetings into lightweight async notes.

### 3. `SlothSort` — Zero-Effort File & Desktop Clutter Tamer
- **The Problem**: Desktop and Downloads folders accumulate hundreds of chaotic files (`Screenshot 2026-10-18 at 11.42.09.png`, `uber_receipt_oct.pdf`, `contract_v2_final_FINAL.docx`).
- **The Sloth Solution**: Paste your file list or directory dump. SlothSort:
  - Organizes files into clean taxonomies (`01-Finance`, `02-Legal`, `03-Design`, `04-Engineering`, `05-Notes`).
  - Proposes standardized, ISO-prefixed normalized filenames (`2026-10-25-receipt-uber-transport.pdf`).
  - Auto-generates **executable 1-click PowerShell & Bash scripts** so your terminal tidies everything in 1 second.

### 4. `SlothSanctuary` — Offline Wind-Down & Ambient Drift Engine
- **Procedural Web Audio API Synthesizer (Zero Network Payload)**:
  - Real-time mathematical synthesis of:
    - *Monteverde Rain* (pink noise buffer through low-pass frequency filtering)
    - *Canopy Breeze* (bandpass filter with slow 0.12 Hz LFO swell)
    - *Hearthside Crackle* (procedural stochastic impulse pops)
    - *432Hz Alpha Calm Drone* (pure sine foundation with 1.5Hz binaural alpha beat)
  - Completely offline; zero MP3 downloads or streaming bandwidth.
- **Bedtime Micro-Fables**:
  - Slow-cadence, low-stimulus bedtime stories generated by Gemma 2, calibrated specifically to reduce heart rate (42–48 BPM target) and release mental tension.

---

## 🌿 Why Open Innovation Matters

### 1. Confidential Data Stays on Your Machine
Group chats, unfiled Downloads folders, and invoices contain confidential client names, internal API credentials, and personal financial data. Pasting them into closed commercial cloud APIs breaches privacy standards and client NDAs. With Google Gemma 2 running locally, **zero bytes ever leave your laptop**.

### 2. $0.00 Marginal Cost Forever
Closed commercial APIs charge per thousand tokens. Digesting long chat logs (5,000+ tokens) and sorting directories daily would easily rack up $15–$30/month in subscription costs. Open weights give you permanent, unmetered intelligence with **zero recurring costs**.

### 3. True Offline Resilience
Sloths don't rely on cell towers, and neither should your workspace tools. SlothDesk runs seamlessly on flights, remote cabins, or subway commutes without requiring an active internet connection.

---

## 🚀 Quickstart

### Prerequisites
- Node.js v18+ (tested on Node v20 & v24)
- (Optional for local weights) [Ollama](https://ollama.com/) with `ollama run gemma2:2b`

### Installation
```bash
# Clone the repository
git clone https://github.com/tanishq4220/slothdesk-ai.git
cd slothdesk-ai

# Install dependencies (only Express and CORS)
npm install
```

### Running the Application
```bash
npm start
```
Open your browser at **`http://localhost:3000`** to experience the art-directed SlothDesk interface!

### Running the Test Suite
```bash
npm test
```
```text
✔ GemmaEngine formats official Gemma 2 instruction tokens (0.93ms)
✔ DigestEngine compresses unread engineering slack logs into actionable signals (41.29ms)
✔ ReplyEngine drafts polite async deferral for 45-min Zoom request (3.69ms)
✔ SortEngine organizes messy files into categorized taxonomy and generates scripts (3.91ms)
✔ SanctuaryEngine generates low-cadence bedtime micro-fable for International Sloth Day (4.03ms)
ℹ tests 5, pass 5, fail 0
```

---

## 🎨 Design System & Aesthetic Craftsmanship

SlothDesk was designed under strict art-direction principles to reject generic "AI SaaS" templates:
- **No purple-to-blue gradients**, floating glowing orbs, or generic card grids.
- **Warm Alabaster Canvas** (`#FAF8F5`) paired with **Carbon Ink** (`#1C1917`) and **Botanical Forest Moss** (`#2B4C38`).
- Editorial typography pairing **Fraunces** serif with **Plus Jakarta Sans** and **JetBrains Mono**.
- Asymmetric Swiss-inspired editorial grids with tactile tab indicators and subtle borders (`#E7E3D8`).

---

## 🏆 Hacktoberfest 2026 Prize Categories

- **Best Use of Gemma ($200 Featured Category)**: Core architecture built natively around Google Gemma 2 open weights (`gemma2:2b` / `9b`), instruction turn formatting, and offline local inference.
- **Overall Winner ($250)**: A deeply thoughtful, fully functional, beautifully art-directed open-source AI project that celebrates International Sloth Day and solves a universal modern pain point.

---

## 📄 License

Licensed under the permissive **[MIT License](LICENSE)**.  
Crafted with ❤️ by **[Tanishq Wankhede](https://github.com/tanishq4220)** for Hacktoberfest 2026.
