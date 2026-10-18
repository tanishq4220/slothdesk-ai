/**
 * ScopeShield AI - SOW (Statement of Work) & Proposal Generator
 * Converts unstructured client requirements into a bulletproof SOW.
 */

export function generateSOW({
  projectName = "Custom Client Project",
  clientName = "Client Organization",
  freelancerName = "Independent Specialist",
  totalFee = 4500,
  hourlyRate = 110,
  timelineWeeks = 4,
  scopeNotes = "",
  outOfScopeNotes = ""
}) {
  const depositPercent = 50;
  const depositAmount = Math.round((totalFee * depositPercent) / 100);
  const milestone2Amount = Math.round((totalFee * 25) / 100);
  const milestone3Amount = totalFee - depositAmount - milestone2Amount;

  const rawNotes = scopeNotes.trim() || "Full-stack application development, UI/UX implementation, API integration, and deployment verification.";
  const scopeItems = rawNotes
    .split(/\n|,|;/)
    .map(s => s.trim().replace(/^[-*•]\s*/, ""))
    .filter(s => s.length > 3);

  const defaultOutScope = [
    "Ongoing content writing and copy generation",
    "Third-party subscription fees (SaaS, hosting, domain, SMS gateways)",
    "Search Engine Optimization (SEO) campaigns and backlink acquisition",
    "Native mobile app stores submission and maintenance (unless specified)",
    "Unscheduled feature requests or architectural pivots outside Exhibit A"
  ];

  const customOutScope = outOfScopeNotes
    ? outOfScopeNotes.split(/\n|,|;/).map(s => s.trim().replace(/^[-*•]\s*/, "")).filter(s => s.length > 3)
    : [];

  const combinedOutOfScope = [...defaultOutScope, ...customOutScope];

  const sowMarkdown = `# STATEMENT OF WORK (SOW) & MASTER ENGAGEMENT SCHEDULE

**Project Name:** ${projectName}  
**Client:** ${clientName}  
**Contractor / Specialist:** ${freelancerName}  
**Date of Issuance:** ${new Date().toISOString().split("T")[0]}  
**Target Completion:** ${timelineWeeks} Weeks from Kickoff  
**Total Fixed Engagement Fee:** $${Number(totalFee).toLocaleString()} USD  

---

## 1. PROJECT OBJECTIVE & SCOPE OVERVIEW
Contractor will deliver the technical milestones detailed herein to achieve the business objectives of Client. All work is governed strictly by this Statement of Work.

### In-Scope Deliverables (Exhibit A)
${scopeItems.map((item, i) => `${i + 1}. **Deliverable ${i + 1}:** ${item}`).join("\n")}

### Explicit Out-of-Scope Exclusions (Exhibit B)
The following items are expressly excluded from this engagement fee and require a separate Change Order:
${combinedOutOfScope.map(item => `- ❌ ${item}`).join("\n")}

---

## 2. MILESTONE DELIVERABLES & PAYMENT SCHEDULE
Work commences only upon receipt of cleared Milestone 1 deposit funds.

| Milestone | Deliverable Scope | Timeline | Payment Due | Amount |
| :--- | :--- | :--- | :--- | :--- |
| **Milestone 1: Kickoff & Architecture** | Project setup, design tokens, architecture baseline | Week 1 | Prior to Commencement (50% Deposit) | **$${depositAmount.toLocaleString()}** |
| **Milestone 2: Functional Core Demo** | Core features implementation, staging environment | Week ${Math.max(2, Math.round(timelineWeeks / 2))} | Delivery of Staging Build (25%) | **$${milestone2Amount.toLocaleString()}** |
| **Milestone 3: Final Review & Production** | QA remediation, documentation, production deployment | Week ${timelineWeeks} | Final Sign-off & Production Handoff (25%) | **$${milestone3Amount.toLocaleString()}** |

---

## 3. STRICT REVISION POLICY & CHANGE ORDERS
1. **Included Revision Allowance:** Each milestone phase includes a maximum of **two (2) rounds** of consolidated, written revision requests.
2. **Consolidated Submissions:** Revisions must be gathered and submitted by Client's designated single point of contact in a single consolidated document or tracker.
3. **Change Order Rate:** Any modifications exceeding two rounds, or requests that modify previously approved milestones, will be billed at Contractor's standard Change Order rate of **$${hourlyRate}/hour**, with an itemized estimate submitted before work begins.

---

## 4. ACCEPTANCE WINDOW & DEEMED APPROVAL
Client shall have **five (5) business days** following notice of milestone delivery to review the work and provide feedback. If no written punch-list or rejection notice is provided within five (5) business days, the milestone and associated deliverable shall be **deemed fully accepted and approved**, and the respective invoice will become due.

---

## 5. INTELLECTUAL PROPERTY & TRANSFER OF RIGHTS
1. **Payment Contingency:** All rights, title, and intellectual property ownership in and to custom deliverables shall transfer to Client **strictly upon Contractor's receipt of full, cleared payment** of all outstanding balances.
2. **Pre-Existing Utilities:** Contractor retains all rights to pre-existing libraries, algorithms, starter boilerplates, and developer tools. Client is granted a perpetual, royalty-free license to use such utilities as embedded in the deliverable.

---

## 6. PAYMENT TERMS & KILL FEE
- Invoices are payable **Net 14 days** from issuance.
- Overdue balances will accrue interest at the rate of 1.5% per month (18% per annum) or the maximum permitted by applicable law.
- **Kill Fee / Cancellation:** If Client terminates the project for convenience, Contractor retains the initial deposit and shall be compensated for all hours and milestones completed up to the date of written notice.

---

### SIGNATURES & ACCEPTANCE

**CLIENT:** ___________________________________  
**Date:** ________________________  

**CONTRACTOR:** ________________________________  
**Date:** ________________________  
`;

  return {
    projectName,
    clientName,
    freelancerName,
    totalFee,
    depositAmount,
    hourlyRate,
    timelineWeeks,
    scopeItems,
    outOfScopeItems: combinedOutOfScope,
    markdown: sowMarkdown
  };
}
