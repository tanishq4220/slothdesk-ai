/**
 * SlothDesk AI - Curated Presets for 1-Click Zero-Effort Demos
 */

export const PRESETS = {
  digest: {
    engineeringSlack: {
      title: "Late-Night Engineering Slack Storm (38 Messages)",
      rawText: `[23:14] Alex Chen: @channel Heads up, the Postgres migration on staging threw a deadlock on table user_sessions_v3.
[23:16] Sarah Jenkins: Wait what? Did the PR from Liam get merged before the index was created?
[23:17] Liam Miller: No, my PR was just adding the nullable metadata column. It shouldn't lock sessions unless active transactions were held.
[23:20] Alex Chen: Well staging is stuck. We have 40 queued jobs timing out.
[23:22] David K: Who has write access to the AWS RDS staging cluster? I'm on mobile right now.
[23:25] Sarah Jenkins: @tanishq can you check the migration lock script when you see this? You wrote the rollback procedure last sprint.
[23:29] Alex Chen: If Tanishq isn't online, we might need to kill connection 4912 manually.
[23:31] Liam Miller: Wait, killing 4912 could leave the schema in an inconsistent migration state.
[23:35] Sarah Jenkins: Agreed. Let's not touch it until Tanishq verifies or until 9am standup. Staging isn't customer-facing tonight anyway.
[23:38] Alex Chen: Fine. Staging is paused. @tanishq just drop a 1-line note in the morning confirming if we should run "npm run migrate:abort".
[23:42] Liam Miller: Going to bed. See everyone at 10am.`
    },
    familyWhatsApp: {
      title: "Family Vacation Planning Panic (45 Messages)",
      rawText: `[14:02] Mom: Everyone! What time is our flight to Denver on Friday??
[14:05] Dad: I thought Priya booked the 2:15 PM flight?
[14:08] Priya: No, I said the 2:15 was $180 more expensive so I booked the 5:40 PM evening flight!
[14:10] Uncle Joe: Wait, if you land at 7:30 PM we will miss the car rental counter in terminal B!
[14:14] Priya: The counter closes at 11 PM Uncle Joe, I called them yesterday.
[14:18] Mom: Are we staying in the cabin or the hotel near the lake?
[14:22] Dad: Tanishq has the Airbnb confirmation code. Tanishq where is the address?
[14:26] Priya: @tanishq please send the door code and grocery preferences before tonight so Dad can make the Costco run!
[14:31] Uncle Joe: Also do we need snow chains for the SUV? It might drop below 32 degrees in the pass.
[14:35] Mom: Someone please just confirm: what do I need to pack for Friday dinner?`
    },
    clientFeedback: {
      title: "Client Scope & Feedback Ambush (29 Messages)",
      rawText: `[10:15] Marcus (Client): Hey team, just reviewed the staging build. Love the direction!
[10:18] Marcus (Client): Quick question: could we also add real-time PDF invoice generation before Friday's launch?
[10:22] Marcus (Client): Also the founder showed it to his board, and they think the checkout button should be dark forest green instead of black.
[10:26] Marcus (Client): And can we integrate Apple Pay and Stripe subscriptions? We might want recurring billing on day 1.
[10:31] Marcus (Client): @tanishq let me know if you can hop on a quick 30-min Zoom call this afternoon to walk through the revised spec!`
    }
  },

  reply: {
    zoomMeeting: {
      title: "Dreaded 'Quick 45-Min Sync' Request",
      incoming: "Hey! Do you have 45 minutes this afternoon for a quick sync on the quarterly roadmap alignment and sprint velocity review?",
      sender: "Bradley (Project Manager)"
    },
    weekendFire: {
      title: "Non-Urgent Weekend 'Quick Favor'",
      incoming: "Hey, sorry to bother you on Sunday! A marketing partner wants to see mockups of the landing page by tomorrow 8 AM. Could you whip up 2 variants real quick tonight?",
      sender: "Chloe (Growth Lead)"
    },
    scopeCreep: {
      title: "Free Feature Addition Request",
      incoming: "While you're working on the user profile page, could you also build out the full team permissions hierarchy and audit logs? Shouldn't take long!",
      sender: "Client Stakeholder"
    }
  },

  sort: {
    messyDownloads: {
      title: "Chaotic Downloads & Desktop Dump (14 Files)",
      fileList: [
        "Screenshot 2026-10-18 at 11.42.09 PM.png",
        "invoice_uber_oct2026_ride.pdf",
        "temp_notes_client_sync_final_v2.txt",
        "gemma2-inference-test-run.log",
        "IMG_9821_whiteboard_architecture.jpg",
        "hacktoberfest-badge-winner.png",
        "w9_tax_form_signed_2026.pdf",
        "contract_client_acme_unsigned.docx",
        "zoom_recording_standup_oct19.mp4",
        "requirements_doc_draft_edit.docx",
        "coffee_shop_receipt_241026.pdf",
        "database_dump_staging_backup.sql",
        "avatar_profile_headshot_crop.png",
        "scopeshield_architecture_diagram.svg"
      ]
    }
  },

  sanctuary: {
    canopyRain: {
      title: "Monteverde Canopy Rain",
      location: "Cloud Forest Reserve, Costa Rica",
      bpm: "48 (Resting Heart Rate)"
    },
    slowRiver: {
      title: "Tortuguero Slow River Drift",
      location: "Limón Lowlands, Costa Rica",
      bpm: "42 (Deep Parasympathetic)"
    },
    highlandMoss: {
      title: "Cerro de la Muerte Highland Moss",
      location: "Talamanca Range, 3,400m",
      bpm: "50 (Resting Sloth Cadence)"
    }
  }
};
