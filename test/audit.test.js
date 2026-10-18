import test from "node:test";
import assert from "node:assert/strict";
import { auditContractText } from "../src/engine/riskAuditor.js";
import { generateSOW } from "../src/engine/sowGenerator.js";
import { draftNegotiationEmail } from "../src/engine/emailDrafter.js";
import { PRESETS } from "../src/engine/presets.js";

test("Contract Auditor detects predatory clauses in MSA preset", () => {
  const predatory = PRESETS.find(p => p.id === "predatory-msa");
  assert.ok(predatory, "Predatory preset must exist");

  const result = auditContractText(predatory.text);
  assert.equal(result.grade, "F");
  assert.equal(result.riskLevel, "Critical / Predatory");
  assert.ok(result.score >= 75, `Expected score >= 75, got ${result.score}`);
  assert.ok(result.criticalCount >= 3, `Expected at least 3 critical findings, got ${result.criticalCount}`);

  // Check specific detected issues
  const titles = result.findings.map(f => f.title);
  assert.ok(titles.includes("Predatory Unlimited Revisions Clause"));
  assert.ok(titles.includes("Severe Net-90 Payment Delay"));
  assert.ok(titles.includes("Pre-Payment Intellectual Property Transfer"));
  assert.ok(titles.includes("Unlimited Indemnification Exposure"));
});

test("Contract Auditor scores balanced protected SOW as safe", () => {
  const safe = PRESETS.find(p => p.id === "balanced-sow");
  assert.ok(safe, "Balanced SOW preset must exist");

  const result = auditContractText(safe.text);
  assert.ok(result.score < 30, `Expected low score, got ${result.score}`);
  assert.equal(result.criticalCount, 0, "Balanced SOW should have 0 critical findings");
});

test("SOW Generator creates structured milestones and deposit schedule", () => {
  const sow = generateSOW({
    projectName: "Web Application",
    clientName: "Beta Corp",
    freelancerName: "Alex Developer",
    totalFee: 6000,
    hourlyRate: 120,
    timelineWeeks: 6,
    scopeNotes: "Authentication\nDatabase schema\nREST API\nFrontend dashboard"
  });

  assert.equal(sow.totalFee, 6000);
  assert.equal(sow.depositAmount, 3000); // 50% deposit
  assert.equal(sow.scopeItems.length, 4);
  assert.ok(sow.markdown.includes("STATEMENT OF WORK"));
  assert.ok(sow.markdown.includes("50% Deposit"));
  assert.ok(sow.markdown.includes("two (2) rounds"));
  assert.ok(sow.markdown.includes("five (5) business days"));
  assert.ok(sow.markdown.includes("receipt of full, cleared payment"));
});

test("Negotiation Email Drafter formats polite and firm pushback", () => {
  const email = draftNegotiationEmail({
    scenario: "unlimited_revisions",
    clientName: "David",
    freelancerName: "Tanishq",
    projectName: "Mobile App",
    hourlyRate: 110
  });

  assert.ok(email.subject.includes("Agreement Review & Scope Terms"));
  assert.ok(email.body.includes("two (2) comprehensive rounds of consolidated revisions"));
  assert.ok(email.body.includes("$110/hr"));
});
