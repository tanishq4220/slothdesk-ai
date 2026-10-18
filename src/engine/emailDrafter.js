/**
 * ScopeShield AI - Client Negotiation & Pushback Email Drafter
 * Generates assertive, diplomatic, professional client communications.
 */

export function draftNegotiationEmail({
  scenario = "unlimited_revisions",
  clientName = "Client",
  freelancerName = "Freelancer",
  projectName = "Client Project",
  hourlyRate = 110,
  featureDescription = "new feature addition",
  invoiceAmount = 2500,
  invoiceNumber = "INV-104",
  daysOverdue = 14
}) {
  const templates = {
    unlimited_revisions: {
      subject: `Re: Agreement Review & Scope Terms — ${projectName}`,
      body: `Hi ${clientName},

Thank you for sending over the agreement draft for ${projectName}! I am really excited about our collaboration and confident we will achieve an outstanding result.

While reviewing the terms, I noticed Clause 2 mentions unlimited revisions. To ensure we keep project momentum on schedule and maintain the highest standard of craftsmanship, my standard practice across all client engagements is to include two (2) comprehensive rounds of consolidated revisions per milestone.

Any additional changes or directional pivots beyond that can easily be accommodated via an itemized Change Order at my standard rate of $${hourlyRate}/hr.

This structure protects our launch timeline and guarantees clear alignment at every stage. I have prepared an updated clause reflecting this and would be happy to execute the agreement once adjusted.

Looking forward to kicking off!

Best regards,
${freelancerName}`
    },

    out_of_scope: {
      subject: `Update on ${projectName} — Scope & Estimate for ${featureDescription}`,
      body: `Hi ${clientName},

Thanks for passing along the idea regarding ${featureDescription}! It sounds like a fantastic enhancement for the product.

Because this feature is outside our original Statement of Work (SOW) deliverables, I want to make sure it gets the dedicated focus it deserves without disrupting our primary launch timeline.

I can easily accommodate this as a Change Order:
- Estimated Time to Implement: 6-10 hours
- Investment at Standard Rate ($${hourlyRate}/hr): $${6 * hourlyRate} - $${10 * hourlyRate}
- Impact on Timeline: +2 business days

Would you like me to fold this into our current sprint via a quick Change Order, or would you prefer we log it for Phase 2 right after our initial production release?

Best regards,
${freelancerName}`
    },

    deposit_requirement: {
      subject: `Project Kickoff & Deposit Schedule — ${projectName}`,
      body: `Hi ${clientName},

Thank you for your enthusiasm to get started on ${projectName}! I am eager to reserve the upcoming sprint calendar for your team.

Regarding the payment schedule: as a standard operational policy for all custom engagements, I require a 50% upfront deposit before officially scheduling the project and commencing engineering work. The remaining balance is split across milestone verification and final production handover.

This deposit secures dedicated time on my calendar and covers initial architecture setup.

I have attached the initial deposit invoice for your convenience. As soon as this clears, we will initiate Milestone 1 immediately!

Best regards,
${freelancerName}`
    },

    net90_pushback: {
      subject: `Payment Terms Alignment — ${projectName}`,
      body: `Hi ${clientName},

Thank you for sharing the contractor agreement for ${projectName}. I am very excited to partner with your team on this build.

I noticed the agreement specifies Net 90 payment terms. As an independent specialist, extended payment cycles place significant financial friction on ongoing operations. My standard terms across all clients are Net 14 days from invoice date, with milestone-based disbursement.

Could we adjust Section 3 to reflect Net 14 (or Net 15) payment terms? Once that amendment is made, I will promptly sign and return the countersigned agreement so we can begin.

Thank you for understanding, and I look forward to working together!

Best regards,
${freelancerName}`
    },

    ip_contingency: {
      subject: `IP Assignment & Final Payment Clarification — ${projectName}`,
      body: `Hi ${clientName},

I hope you are having a productive week! We are in the final stretch of ${projectName}, and the staging build is performing wonderfully.

Regarding the intellectual property assignment clause in our agreement: per industry best practices, full ownership and title to custom deliverables transfer to ${clientName} upon receipt of cleared final payment. 

Once the final milestone invoice is completed, I will immediately deliver the production credentials, transfer repository ownership, and issue the formal IP release certificate.

Please let me know if your finance team needs any additional details or vendor forms to expedite the transfer.

Best regards,
${freelancerName}`
    },

    overdue_invoice: {
      subject: `Friendly Follow-up: Invoice ${invoiceNumber} for ${projectName} (${daysOverdue} Days Past Due)`,
      body: `Hi ${clientName},

I hope you are having a wonderful week.

I am writing to check in on Invoice ${invoiceNumber} ($${Number(invoiceAmount).toLocaleString()} USD) for ${projectName}, which was due on ${daysOverdue} days ago.

Could you please confirm if this has been processed by your accounts payable team, or let me know if you need another copy of the invoice and banking details?

I appreciate your prompt attention to this and look forward to hearing from you.

Best regards,
${freelancerName}`
    }
  };

  const selected = templates[scenario] || templates.unlimited_revisions;
  return {
    scenario,
    subject: selected.subject,
    body: selected.body
  };
}
