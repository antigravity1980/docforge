/**
 * Structured AI prompts for document generation
 * Supports 15+ document types and multiple jurisdictions
 */

const BASE_SYSTEM_PROMPT = `You are DocForge AI, a professional document generator. Follow these rules STRICTLY:

1. ACCURACY: Generate documents based on standard, widely-accepted templates and legal practices. 
2. JURISDICTION: Pay close attention to the jurisdiction. US (Federal/State), FR (CDI/CDD), DE (Arbeitsvertrag), ES (Contrato laboral), IT (Contratto di lavoro), PT (Contrato de trabalho) must follow local labor/legal standards.
3. NO FABRICATION: Do NOT invent laws, statutes, or legal citations.
4. STANDARD LANGUAGE: Use professional legal and business terminology.
5. MARK UNCERTAIN AREAS: Mark sections requiring specific legal advice with [REVIEW WITH ATTORNEY].
6. COMPLETENESS: Include all standard sections expected in this document type.
7. NO LEGAL ADVICE: The document is for informational purposes only.

IMPORTANT: Generate the document text only. Do not add commentary or explanations outside the document.`;

export const PROMPTS = {
    'employment-agreement': {
        system: BASE_SYSTEM_PROMPT + `\n\nGenerate an Employment Contract. 
        If jurisdiction is FR, use CDI/CDD standards. 
        If DE, use Arbeitsvertrag standards.
        If US, include at-will employment clauses unless specified otherwise.`,
        buildUserPrompt: (data) => `Generate an Employment Agreement:
- Employer: ${data.employerName}
- Employee: ${data.employeeName}
- Position: ${data.jobTitle}
- Salary: ${data.salary}
- Start Date: ${data.startDate}
- Jurisdiction: ${data.jurisdiction}`,
    },

    'nda': {
        system: BASE_SYSTEM_PROMPT + `\n\nGenerate a Non-Disclosure Agreement (NDA).`,
        buildUserPrompt: (data) => `Generate an NDA:
- Disclosing Party: ${data.disclosingParty}
- Receiving Party: ${data.receivingParty}
- Purpose: ${data.purpose}
- Duration: ${data.duration}
- Jurisdiction: ${data.jurisdiction}`,
    },

    'contractor-agreement': {
        system: BASE_SYSTEM_PROMPT + `\n\nGenerate an Independent Contractor Agreement (Freelance).`,
        buildUserPrompt: (data) => `Generate a Contractor Agreement:
- Client: ${data.clientName}
- Contractor: ${data.contractorName}
- Services: ${data.services}
- Payment: ${data.payment}
- Jurisdiction: ${data.jurisdiction}`,
    },

    'offer-letter': {
        system: BASE_SYSTEM_PROMPT + `\n\nGenerate a formal Job Offer Letter.`,
        buildUserPrompt: (data) => `Generate an Offer Letter:
- Company: ${data.companyName}
- Candidate: ${data.candidateName}
- Position: ${data.jobTitle}
- Salary: ${data.salary}`,
    },

    'service-agreement': {
        system: BASE_SYSTEM_PROMPT + `\n\nGenerate a Service Agreement.`,
        buildUserPrompt: (data) => `Generate a Service Agreement:
- Provider: ${data.providerName}
- Client: ${data.clientName}
- Services: ${data.services}
- Jurisdiction: ${data.jurisdiction}`,
    },

    'invoice': {
        system: BASE_SYSTEM_PROMPT + `\n\nGenerate a professional Invoice document.`,
        buildUserPrompt: (data) => `Generate an Invoice:
- From: ${data.fromName}
- To: ${data.toName}
- Invoice #: ${data.invoiceNumber}
- Items: ${data.items}`,
    },

    'non-compete': {
        system: BASE_SYSTEM_PROMPT + `\n\nGenerate a Non-Compete Agreement. Ensure it remains reasonable in scope and duration as per the jurisdiction.`,
        buildUserPrompt: (data) => `Generate a Non-Compete Agreement:
- Employer: ${data.employerName}
- Employee: ${data.employeeName}
- Duration: ${data.duration}
- Area: ${data.geographicArea}
- Jurisdiction: ${data.jurisdiction}`,
    },

    'tos': {
        system: BASE_SYSTEM_PROMPT + `\n\nGenerate Terms of Service (TOS) for a website or application.`,
        buildUserPrompt: (data) => `Generate Terms of Service:
- Company: ${data.companyName}
- Website: ${data.websiteUrl}
- Jurisdiction: ${data.jurisdiction}`,
    },

    'privacy-policy': {
        system: BASE_SYSTEM_PROMPT + `\n\nGenerate a Privacy Policy compliant with GDPR, CCPA, and relevant local laws.`,
        buildUserPrompt: (data) => `Generate a Privacy Policy:
- Company: ${data.companyName}
- Website: ${data.websiteUrl}
- Data Collected: ${data.dataCollected}`,
    },

    'partnership-agreement': {
        system: BASE_SYSTEM_PROMPT + `\n\nGenerate a Partnership Agreement.`,
        buildUserPrompt: (data) => `Generate a Partnership Agreement:
- Partner 1: ${data.partner1}
- Partner 2: ${data.partner2}
- Business: ${data.businessName}
- Jurisdiction: ${data.jurisdiction}`,
    },

    'termination-letter': {
        system: BASE_SYSTEM_PROMPT + `\n\nGenerate a formal Employment Termination Letter.`,
        buildUserPrompt: (data) => `Generate a Termination Letter:
- Employer: ${data.employerName}
- Employee: ${data.employeeName}
- Date: ${data.terminationDate}
- Reason: ${data.reason || 'Not specified'}`,
    },

    'msa': {
        system: BASE_SYSTEM_PROMPT + `\n\nGenerate a Master Service Agreement (MSA).`,
        buildUserPrompt: (data) => `Generate an MSA:
- Provider: ${data.providerName}
- Client: ${data.clientName}
- Jurisdiction: ${data.jurisdiction}`,
    },

    'sales-agreement': {
        system: BASE_SYSTEM_PROMPT + `\n\nGenerate a Sales of Goods/Property Agreement.`,
        buildUserPrompt: (data) => `Generate a Sales Agreement:
- Seller: ${data.sellerName}
- Buyer: ${data.buyerName}
- Item: ${data.itemDescription}
- Price: ${data.price}`,
    },

    'lease-agreement': {
        system: BASE_SYSTEM_PROMPT + `\n\nGenerate a Residential Lease Agreement (Rental Agreement).`,
        buildUserPrompt: (data) => `Generate a Lease Agreement:
- Landlord: ${data.landlordName}
- Tenant: ${data.tenantName}
- Property: ${data.propertyAddress}
- Rent: ${data.rentAmount}`,
    },

    'promissory-note': {
        system: BASE_SYSTEM_PROMPT + `\n\nGenerate a legal Promissory Note (Loan Repayment Promise).`,
        buildUserPrompt: (data) => `Generate a Promissory Note:
- Lender: ${data.lenderName}
- Borrower: ${data.borrowerName}
- Amount: ${data.loanAmount}
- Terms: ${data.repaymentTerms}`,
    },

    // Legacy/Marketing support
    'blog-outline': {
        system: `You are an SEO content strategist. Generate a detailed blog post outline.`,
        buildUserPrompt: (data) => `Generate a blog post outline for: ${data.topic || JSON.stringify(data)}`,
    },
    'meta-tags': {
        system: `You are an SEO expert. Generate optimized meta tags.`,
        buildUserPrompt: (data) => `Generate meta tags for: ${JSON.stringify(data)}`,
    }
};

export const DEFAULT_PROMPT = {
    system: BASE_SYSTEM_PROMPT,
    buildUserPrompt: (data) => `Generate a professional document based on: ${JSON.stringify(data)}`,
};
