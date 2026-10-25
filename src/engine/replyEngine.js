/**
 * SlothDesk AI - Low-Energy Diplomatic Reply & Boundary Drafter
 * Generates low-effort, guilt-free responses that protect your calendar, focus, and peace.
 */

import { GemmaEngine } from './gemma.js';

export class ReplyEngine {
  constructor(gemma = new GemmaEngine()) {
    this.gemma = gemma;
  }

  async draft(incomingRequest, options = {}) {
    const energyLevel = options.energyLevel || 'zen'; // 'minimalist', 'zen', 'ironclad'
    const intent = options.intent || 'async'; // 'async', 'delay', 'decline', 'approve'

    const systemContext = `[SYSTEM CONTEXT: You are SlothDesk's Boundary Agent.
Your mandate is radical preservation of the user's peace and calendar.
The user is faced with an incoming request or meeting invitation they dread.
Energy Level: ${energyLevel}.
Intent: ${intent}.
Generate a polite, highly effective response that achieves the intent while consuming minimal social energy.]`;

    const userPrompt = `Incoming Request: "${incomingRequest}"`;

    const fallbackFn = () => this.generateHeuristicReply(incomingRequest, energyLevel, intent);

    const result = await this.gemma.generate(systemContext, userPrompt, fallbackFn);

    return {
      incoming: incomingRequest,
      energyLevel,
      intent,
      ...result.output,
      meta: {
        engine: result.source,
        model: result.model,
        latencyMs: result.latencyMs
      }
    };
  }

  generateHeuristicReply(incoming, energyLevel, intent) {
    const lower = incoming.toLowerCase();

    if (lower.includes('sync') || lower.includes('zoom') || lower.includes('meeting') || lower.includes('call') || intent === 'async') {
      if (energyLevel === 'minimalist') {
        return {
          subject: "Re: Quick sync",
          draft: "Hey Bradley, let's keep this async to protect sprint focus. Drop the 3 core questions here and I'll send bullet updates by 3 PM.",
          slothTip: "Saves a 45-minute calendar block + 15 minutes of context-switching overhead.",
          effortConservedMinutes: 60
        };
      } else if (energyLevel === 'ironclad') {
        return {
          subject: "Re: Sync request — Calendar heads-down",
          draft: "Hi Bradley. I'm currently heads-down on shipping our core deliverables and not taking ad-hoc meetings this week. Please feel free to share the agenda points or ticket IDs asynchronously and I will review them during my end-of-day triage.",
          slothTip: "Establishes a firm calendar perimeter with zero awkwardness.",
          effortConservedMinutes: 75
        };
      } else {
        // zen (default)
        return {
          subject: "Re: Quick sync / alignment",
          draft: "Hey Bradley! My afternoon is fully booked with focused engineering blocks. To keep momentum moving without blocking you, feel free to send over the top 2 questions in Slack/email and I will send back concise answers before end of day.",
          slothTip: "Friendly, collaborative tone that gracefully shifts synchronous demands to lightweight async text.",
          effortConservedMinutes: 50
        };
      }
    }

    if (lower.includes('weekend') || lower.includes('sunday') || lower.includes('quick favor') || lower.includes('tonight')) {
      if (energyLevel === 'minimalist') {
        return {
          subject: "Re: Weekend favor",
          draft: "Offline for the weekend. I'll queue this first thing Monday at 9:30 AM.",
          slothTip: "Sloth rule #1: Resting metabolisms should never be interrupted on Sundays.",
          effortConservedMinutes: 120
        };
      } else if (energyLevel === 'ironclad') {
        return {
          subject: "Re: Out of office until Monday",
          draft: "Hi Chloe. I keep strict off-screen hours on weekends to recharge for sprint delivery. I'll take a look at the landing page variants when I log in Monday morning and share options before noon.",
          slothTip: "Protects weekend recovery without apologizing for having boundaries.",
          effortConservedMinutes: 140
        };
      } else {
        return {
          subject: "Re: Quick favor",
          draft: "Hey Chloe! Stepped away from the laptop for family time today. I've noted this down and will prepare the two mockup variants as my first task Monday morning so you have them for the partner sync.",
          slothTip: "Warmly sets a Monday timeline while keeping your Sunday peaceful.",
          effortConservedMinutes: 100
        };
      }
    }

    // Free feature / scope creep
    if (lower.includes('while you') || lower.includes('permission') || lower.includes('audit log') || lower.includes('could you also')) {
      return {
        subject: "Re: Feature request scope",
        draft: "Thanks for highlighting team permissions and audit logging! Because those require separate database schemas and security review, adding them now would delay the user profile launch. Let's get the profile live on schedule and spec permissions for our subsequent sprint.",
        slothTip: "Prevents unpaid scope inflation by anchoring firmly to the original timeline.",
        effortConservedMinutes: 180
      };
    }

    // Default general reply
    return {
      subject: "Re: Update",
      draft: "Thanks for checking in! Received your note. I'm prioritizing current sprint commitments today and will circle back with a detailed update by tomorrow morning.",
      slothTip: "Acknowledges receipt immediately so they stop pinging, buying you uninterrupted focus time.",
      effortConservedMinutes: 30
    };
  }
}
