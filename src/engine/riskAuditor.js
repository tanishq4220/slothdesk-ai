/**
 * ScopeShield AI - Contract Risk & Scope Creep Auditor
 * Evaluates contract text across 6 critical freelance risk vectors.
 * Can run standalone or synthesize results from local Gemma 2 inferences.
 */

export function auditContractText(text) {
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    throw new Error("Contract text cannot be empty.");
  }

  const raw = text.toLowerCase();
  const findings = [];

  let pillarScores = {
    scopeClarity: 15,
    revisionPolicy: 10,
    paymentTerms: 15,
    ipOwnership: 15,
    terminationKillFee: 15,
    liabilityExposure: 10
  };

  // 1. REVISION POLICY CHECKS
  if (/unlimited\s+revision/i.test(text)) {
    pillarScores.revisionPolicy += 75;
    findings.push({
      category: "Revision Policy",
      severity: "critical",
      title: "Predatory Unlimited Revisions Clause",
      quote: extractMatchingSentence(text, /unlimited\s+revision/i),
      explanation: "Unlimited revisions create unbounded work hours without additional compensation. It guarantees negative effective hourly rates.",
      shieldClause: "Each milestone includes up to two (2) rounds of consolidated written revisions. Additional revisions or out-of-scope adjustments shall be billed under a separate Change Order at Contractor's standard rate of $110/hour."
    });
  } else if (/sole\s+subjective\s+satisfaction|complete\s+aesthetic.*approval/i.test(text)) {
    pillarScores.revisionPolicy += 50;
    findings.push({
      category: "Revision Policy",
      severity: "critical",
      title: "Subjective Acceptance Standard",
      quote: extractMatchingSentence(text, /sole\s+subjective\s+satisfaction|complete\s+aesthetic.*approval/i),
      explanation: "Subjective approval clauses mean the client can claim 'it doesn't feel right' indefinitely and withhold sign-off.",
      shieldClause: "Deliverables shall be deemed accepted once they satisfy the objective technical criteria specified in Exhibit A. Approval shall not be unreasonably withheld or delayed."
    });
  } else if (!/revision\s+round|two\s*\(\s*2\s*\)\s*rounds?|change\s+order/i.test(text)) {
    pillarScores.revisionPolicy += 35;
    findings.push({
      category: "Revision Policy",
      severity: "warning",
      title: "Missing Explicit Revision Cap",
      quote: "No mention of revision round limits or change orders found.",
      explanation: "Without an explicit cap, clients assume revision requests are free and ongoing throughout the project.",
      shieldClause: "Project fee includes a maximum of two (2) rounds of revisions per milestone. All change requests exceeding this limit require written approval and will be billed at $110/hr."
    });
  }

  // 2. PAYMENT TERMS & DEPOSIT CHECKS
  if (/net\s*90/i.test(text)) {
    pillarScores.paymentTerms += 65;
    findings.push({
      category: "Payment Terms",
      severity: "critical",
      title: "Severe Net-90 Payment Delay",
      quote: extractMatchingSentence(text, /net\s*90/i),
      explanation: "Waiting 90 days after delivery for payment forces you to finance the client's operations interest-free. Severe cashflow hazard.",
      shieldClause: "All invoices are payable within fourteen (14) calendar days of issuance (Net 14). Late balances shall accrue interest at 1.5% per month or the statutory maximum."
    });
  } else if (/net\s*60/i.test(text)) {
    pillarScores.paymentTerms += 45;
    findings.push({
      category: "Payment Terms",
      severity: "warning",
      title: "Protracted Net-60 Payment Terms",
      quote: extractMatchingSentence(text, /net\s*60/i),
      explanation: "60-day payment lag is inappropriate for solo freelancers and small agencies.",
      shieldClause: "Invoices shall be payable Net 15 days from delivery."
    });
  }

  if (/withhold.*(?:percent|%|warranty)/i.test(text)) {
    pillarScores.paymentTerms += 50;
    findings.push({
      category: "Payment Terms",
      severity: "critical",
      title: "Unfair Retainage / Performance Holdback",
      quote: extractMatchingSentence(text, /withhold.*(?:percent|%|warranty)/i),
      explanation: "Holdback clauses let clients lock up 10-20% of your earnings indefinitely on the pretext of post-launch warranties.",
      shieldClause: "Full payment of the final milestone is required upon delivery to production. Any post-launch maintenance shall be governed by a separate Service Level Agreement (SLA)."
    });
  }

  if (!/deposit|upfront|prior\s+to\s+commencement|milestone\s*1.*50%/i.test(text)) {
    pillarScores.paymentTerms += 40;
    findings.push({
      category: "Payment Terms",
      severity: "warning",
      title: "Zero Upfront Deposit Required",
      quote: "No upfront deposit requirement found in the agreement.",
      explanation: "Starting work with 0% upfront leaves you 100% exposed if the client ghosts, pivots, or cancels the project.",
      shieldClause: "Contractor requires an upfront, non-refundable deposit of 40% to 50% prior to calendar booking and work commencement."
    });
  }

  // 3. INTELLECTUAL PROPERTY CHECKS
  if (/regardless\s+of\s+whether\s+final\s+compensation|from\s+the\s+moment\s+of\s+conception/i.test(text)) {
    pillarScores.ipOwnership += 75;
    findings.push({
      category: "IP Rights",
      severity: "critical",
      title: "Pre-Payment Intellectual Property Transfer",
      quote: extractMatchingSentence(text, /regardless\s+of\s+whether\s+final\s+compensation|from\s+the\s+moment\s+of\s+conception/i),
      explanation: "Transferring IP before full payment deprives you of all leverage. The client legally owns your code even if they never pay the invoice.",
      shieldClause: "Ownership of custom deliverables shall transfer to Client strictly upon Contractor's receipt of full, final, cleared payment of all project fees."
    });
  } else if (!/contingent\s+upon|strictly\s+upon.*payment|receipt\s+of\s+full.*payment/i.test(text)) {
    pillarScores.ipOwnership += 40;
    findings.push({
      category: "IP Rights",
      severity: "warning",
      title: "Unconditional IP Assignment",
      quote: "No clause conditioning IP transfer on receipt of payment was detected.",
      explanation: "Standard work-for-hire clauses automatically transfer IP upon creation unless explicitly conditioned on payment.",
      shieldClause: "All rights, title, and interest in and to the custom deliverables shall remain Contractor's property until payment in full is received."
    });
  }

  if (/waives\s+all\s+moral\s+rights|pre-existing\s+code/i.test(text)) {
    pillarScores.ipOwnership += 35;
    findings.push({
      category: "IP Rights",
      severity: "warning",
      title: "Forfeiture of Pre-existing Tools & Libraries",
      quote: extractMatchingSentence(text, /waives\s+all\s+moral\s+rights|pre-existing\s+code/i),
      explanation: "Assigning pre-existing starter kits or personal libraries prevents you from reusing your own code on future freelance projects.",
      shieldClause: "Contractor retains full ownership of all pre-existing tools, libraries, starter kits, and know-how utilized during the project, granting Client a non-exclusive license for use in the deliverables."
    });
  }

  // 4. TERMINATION & KILL FEE CHECKS
  if (/no\s+compensation\s+for\s+hours|return\s+all\s+fees\s+previously\s+disbursed/i.test(text)) {
    pillarScores.terminationKillFee += 75;
    findings.push({
      category: "Termination & Kill Fee",
      severity: "critical",
      title: "Zero Kill Fee & Disgorgement Trap",
      quote: extractMatchingSentence(text, /no\s+compensation\s+for\s+hours|return\s+all\s+fees\s+previously\s+disbursed/i),
      explanation: "Allows the client to cancel the project at any stage, keep your work, and demand refunds of legitimate work completed.",
      shieldClause: "In the event of cancellation by Client, Contractor shall retain all upfront deposits and receive prorated payment for all work completed up to the date of termination (Kill Fee)."
    });
  } else if (!/kill\s+fee|work\s+completed\s+up\s+to|non-refundable/i.test(text)) {
    pillarScores.terminationKillFee += 35;
    findings.push({
      category: "Termination & Kill Fee",
      severity: "caution",
      title: "Missing Kill Fee Protection",
      quote: "No explicit kill fee or compensation for partial work in cancellation.",
      explanation: "If the client changes strategic direction midway, you risk losing pay for unbilled milestone progress.",
      shieldClause: "Either party may terminate with 7 days written notice. Client agrees to pay for all hours and milestones completed up to the termination date."
    });
  }

  // 5. LIABILITY & NON-COMPETE CHECKS
  if (/indemnif.*without\s+limitation|all\s+claims.*without\s+limitation/i.test(text)) {
    pillarScores.liabilityExposure += 70;
    findings.push({
      category: "Liability & Indemnity",
      severity: "critical",
      title: "Unlimited Indemnification Exposure",
      quote: extractMatchingSentence(text, /indemnif.*without\s+limitation|all\s+claims.*without\s+limitation/i),
      explanation: "Unlimited indemnification can make a solo freelancer liable for enterprise lawsuits, loss of client revenue, or third-party claims.",
      shieldClause: "Contractor's aggregate liability under this Agreement shall be strictly limited to the total fees actually paid to Contractor by Client hereunder."
    });
  }

  if (/non-compete|shall\s+not.*provide.*services\s+to\s+any\s+entity/i.test(text)) {
    pillarScores.liabilityExposure += 60;
    findings.push({
      category: "Liability & Indemnity",
      severity: "critical",
      title: "Aggressive Non-Compete Restriction",
      quote: extractMatchingSentence(text, /non-compete|shall\s+not.*provide.*services\s+to\s+any\s+entity/i),
      explanation: "A non-compete clause prevents you from taking clients in your own domain or field. Non-competes should almost never be signed by freelancers.",
      shieldClause: "Strike this section entirely. Replace with a mutual non-disclosure agreement (NDA) protecting proprietary business information."
    });
  }

  if (/100%\s+bug-free|twelve\s*\(\s*12\s*\)\s*months\s+warranty/i.test(text)) {
    pillarScores.liabilityExposure += 45;
    findings.push({
      category: "Liability & Indemnity",
      severity: "warning",
      title: "Unrealistic 100% Bug-Free Software Warranty",
      quote: extractMatchingSentence(text, /100%\s+bug-free|twelve\s*\(\s*12\s*\)\s*months\s+warranty/i),
      explanation: "No software is 100% bug-free. A 12-month free bug warranty obligates you to provide free tech support indefinitely.",
      shieldClause: "Contractor provides a thirty (30) day warranty post-launch to remediate critical bugs in original scoped code. Third-party API changes and browser updates are excluded."
    });
  }

  // 6. SCOPE CLARITY CHECKS
  if (/whatever.*graphics|as\s+needed|some\s+pitch\s+deck|lots\s+of\s+team\s+ideas|iterate.*on\s+slack/i.test(text)) {
    pillarScores.scopeClarity += 60;
    findings.push({
      category: "Scope Clarity",
      severity: "warning",
      title: "Open-Ended Deliverables ('As Needed')",
      quote: extractMatchingSentence(text, /whatever.*graphics|as\s+needed|some\s+pitch\s+deck|lots\s+of\s+team\s+ideas|iterate.*on\s+slack/i),
      explanation: "Vague phrasing like 'whatever graphics we need' or informal Slack iteration allows the client to continually expand deliverables without paying more.",
      shieldClause: "All deliverables must be specifically itemized in an attached Scope Appendix with measurable acceptance checklists. Out-of-scope items require a written Change Order."
    });
  }

  // Normalize scores between 0 and 100
  for (const key of Object.keys(pillarScores)) {
    pillarScores[key] = Math.min(100, Math.max(0, pillarScores[key]));
  }

  // Weighted overall calculation
  const weightedScore = Math.round(
    pillarScores.revisionPolicy * 0.25 +
    pillarScores.paymentTerms * 0.25 +
    pillarScores.ipOwnership * 0.20 +
    pillarScores.liabilityExposure * 0.15 +
    pillarScores.terminationKillFee * 0.10 +
    pillarScores.scopeClarity * 0.05
  );

  const score = Math.min(100, Math.max(5, weightedScore));

  let grade = "A";
  let riskLevel = "Low / Shielded";
  let badgeColor = "green";

  if (score > 75) {
    grade = "F";
    riskLevel = "Critical / Predatory";
    badgeColor = "red";
  } else if (score > 55) {
    grade = "D";
    riskLevel = "High Risk";
    badgeColor = "orange";
  } else if (score > 35) {
    grade = "C";
    riskLevel = "Moderate Risk";
    badgeColor = "yellow";
  } else if (score > 20) {
    grade = "B";
    riskLevel = "Acceptable / Minor Gaps";
    badgeColor = "blue";
  }

  const estimatedLoss = score > 60 
    ? "$2,500 - $8,000+ in unpaid revisions and delayed cashflow" 
    : score > 35 
    ? "$800 - $2,200 in scope creep and boundary friction" 
    : "$0 - minimal financial leakage";

  return {
    score,
    grade,
    riskLevel,
    badgeColor,
    pillarScores,
    findingsCount: findings.length,
    criticalCount: findings.filter(f => f.severity === "critical").length,
    warningCount: findings.filter(f => f.severity === "warning").length,
    cautionCount: findings.filter(f => f.severity === "caution").length,
    estimatedLoss,
    findings,
    summary: generateAuditSummary(score, grade, riskLevel, findings)
  };
}

function extractMatchingSentence(text, regex) {
  const match = text.match(regex);
  if (!match) return "";
  const index = match.index;
  const start = Math.max(0, text.lastIndexOf(".", index) + 1);
  let end = text.indexOf(".", index + match[0].length);
  if (end === -1) end = text.length;
  return text.substring(start, end).trim();
}

function generateAuditSummary(score, grade, riskLevel, findings) {
  const critical = findings.filter(f => f.severity === "critical").length;
  if (score >= 70) {
    return `HIGH-ALERT WARNING (Grade ${grade}): This contract contains ${critical} critical predatory clauses. Signing this in its current form exposes the freelancer to severe financial leakage, unbounded unpaid revisions, and potential liability. Recommend sending the proposed ScopeShield counter-clauses immediately.`;
  } else if (score >= 40) {
    return `CAUTION (Grade ${grade}): Contract contains ambiguous scope and payment gaps. While not intentionally predatory, missing revision limits and loose acceptance criteria will likely cause scope creep and project delays.`;
  } else {
    return `SAFE / WELL-SHIELDED (Grade ${grade}): The contract or scope is well-balanced with healthy boundaries, clear milestones, and protective payment terms.`;
  }
}
