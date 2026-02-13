/**
 * Structured AI prompts for document generation
 * Supports 15+ document types with jurisdiction-specific compliance
 */

const BASE_SYSTEM_PROMPT = `You are DocForge AI, a rigid and precise legal document generator. 
Follow these rules STRICTLY:

1. JURISDICTION IS PARAMOUNT: You must adapt the document structure, terminology, and mandatory clauses to the specific jurisdiction provided.
   - For **Germany (DE)**: Use "Arbeitsvertrag", "GmbH", "Geschäftsführer", "Gerichtsstand". Follow *Nachweisgesetz*.
   - For **France (FR)**: Use "Contrat de Travail", "CDI/CDD", "Tribunal compétent". Follow *Code du Travail*.
   - For **US**: Use "At-Will" (unless Montana), "State of [X]".
2. NO HALLUCINATIONS: Do not invent case law.
3. PROFESSIONAL FORMATTING: Use markdown with clear headers (#), bolding (**), and lists.
4. PLACEHOLDERS: If a specific detail is missing (e.g., address), use a clear bracketed placeholder like [INSERT ADDRESS].
5. LANGUAGE: Output the document in the OFFICIAL LANGUAGE of the jurisdiction unless explicitly asked for English. 
   - DE -> German
   - FR -> French
   - ES -> Spanish
   - IT -> Italian
   - PT -> Portuguese
   - US/UK -> English

IMPORTANT: Generate ONLY the legal document text. No conversational filler.`;

export const PROMPTS = {
    'employment-agreement': {
        system: BASE_SYSTEM_PROMPT,
        buildUserPrompt: (data) => {
            let instructions = `Generate a rigorous Employment Contract for jurisdiction: ${data.jurisdiction}.`;

            // Jurisdiction-specific injections
            if (data.jurisdiction.includes('DE') || data.jurisdiction.includes('Germany')) {
                instructions += `
                MANDATORY GERMAN LAW (Nachweisgesetz) REQUIREMENTS:
                1. Title: "Arbeitsvertrag". Language: German.
                2. Include explicit "Beginn des Arbeitsverhältnisses" (Start Date: ${data.startDate}).
                3. Probation Period: Include "Probezeit" of ${data.probationPeriod || '6 months'}.
                4. Notice Period: Include "Kündigungsfristen" compliant with BGB/Tariff (User input: ${data.noticePeriod || 'statutory'}).
                5. Working Hours: Define "Arbeitszeit" (${data.workingHours || '40 hours/week'}).
                6. Validation: Add a note at the end that termination requires written form ("Schriftform") pursuant to § 623 BGB (no email).
                7. Reference Collective Agreements (Tarifverträge) if mentioned: ${data.cba || 'N/A'}.`;
            } else if (data.jurisdiction.includes('FR') || data.jurisdiction.includes('France')) {
                instructions += `
                MANDATORY FRENCH LAW (Code du Travail) REQUIREMENTS:
                1. Title: "Contrat de Travail à Durée Indéterminée (CDI)". Language: French.
                2. Probation: Include "Période d'essai" (${data.probationPeriod || 'standard conventionnelle'}).
                3. Notice: Include "Préavis de rupture" (${data.noticePeriod || 'selon convention'}).
                4. Social Bodies: Mention affiliation to "Caisse de retraite" and "Prévoyance".
                5. Working Time: Reference "Durée du travail" (${data.workingHours || '35 heures'}).`;
            } else if (data.jurisdiction.includes('US')) {
                instructions += `
                MANDATORY US LAW REQUIREMENTS:
                1. Title: "Employment Agreement". Language: English.
                2. AT-WILL STATUS: Explicitly state that employment is "At-Will" and may be terminated by either party at any time (unless Jurisdiction is Montana).
                3. Entire Agreement: Include "Merger Clause" (this contract supersedes all prior agreements/handbooks).`;
            }

            return `${instructions}
            
            DETAILS:
            - Employer: ${data.employerName}
            - Employee: ${data.employeeName}
            - Position: ${data.jobTitle}
            - Compensation: ${data.salary}
            - Start Date: ${data.startDate}
            - Vacation: ${data.vacationDays || 'Standard'}
            `;
        }
    },

    'nda': {
        system: BASE_SYSTEM_PROMPT,
        buildUserPrompt: (data) => {
            let instructions = `Generate a Non-Disclosure Agreement (NDA) for jurisdiction: ${data.jurisdiction}.`;

            if (data.jurisdiction.includes('DE') || data.jurisdiction.includes('Germany')) {
                instructions += `
                MANDATORY (DE):
                1. Include "Vertragsstrafe" (Contractual Penalty) clause for breach, as proving actual damages is difficult under German law.
                2. Define "Geschäftsgeheimnisse" per GeschGehG.
                3. Language: German.`;
            } else if (data.jurisdiction.includes('FR') || data.jurisdiction.includes('France')) {
                instructions += `
                MANDATORY (FR):
                1. Include "Clause Pénale" (Penalty Clause).
                2. Explicitly define "Domaine de Confidentialité".
                3. Language: French.`;
            } else if (data.jurisdiction.includes('California') || data.jurisdiction.includes('CA')) {
                instructions += `
                MANDATORY (California):
                1. EXCEPTION: Explicitly state that nothing prohibits reporting violations of law to government agencies (Defend Trade Secrets Act compliance).
                2. EXCLUDE: Information that is general knowledge or independently developed.`;
            }

            return `${instructions}
            
            DETAILS:
            - Disclosing Party: ${data.disclosingParty}
            - Receiving Party: ${data.receivingParty}
            - Purpose: ${data.purpose}
            - Term: ${data.duration}`;
        }
    },

    'privacy-policy': {
        system: BASE_SYSTEM_PROMPT,
        buildUserPrompt: (data) => {
            const isGDPR = data.legislation?.includes('GDPR') || data.jurisdiction?.includes('EU');
            const isCCPA = data.legislation?.includes('CCPA') || data.jurisdiction?.includes('California');

            let instructions = `Generate a Privacy Policy compliant with ${data.legislation || 'General Standards'}.`;

            if (isGDPR) {
                instructions += `
                GDPR STRICT COMPLIANCE:
                1. Define "Data Controller": ${data.dataController || '[Insert Controller Name]'}.
                2. List "Legal Basis" for processing (Consent, Contract, Legitimate Interest).
                3. Explicitly list User Rights: Access, Rectification, Erasure, Portability.
                4. DPO Contact: ${data.dpoContact || '[Insert DPO Email]'}.`;
            } else if (isCCPA) {
                instructions += `
                CCPA/CPRA STRICT COMPLIANCE:
                1. Include specific section: "Do Not Sell or Share My Personal Information".
                2. List categories of data collected in last 12 months.
                3. List consumer rights under CCPA (Right to Know, Delete, Opt-Out).`;
            }

            return `${instructions}
            
            DETAILS:
            - Website/Company: ${data.companyName} (${data.websiteUrl})
            - Data Collected: ${data.dataCollected}`;
        }
    },

    // Keep standard prompts for less complex docs, but ensure they use formatted string
    'contractor-agreement': {
        system: BASE_SYSTEM_PROMPT,
        buildUserPrompt: (data) => `Generate an Independent Contractor Agreement for ${data.jurisdiction}.
        - Client: ${data.clientName}
        - Contractor: ${data.contractorName}
        - Services: ${data.services}
        - Payment: ${data.payment}`
    },

    'offer-letter': {
        system: BASE_SYSTEM_PROMPT,
        buildUserPrompt: (data) => `Generate a Job Offer Letter.
        - Company: ${data.companyName}
        - Candidate: ${data.candidateName}
        - Position: ${data.jobTitle}
        - Salary: ${data.salary}`
    },

    'service-agreement': {
        system: BASE_SYSTEM_PROMPT,
        buildUserPrompt: (data) => `Generate a Service Agreement for ${data.jurisdiction}.
        - Provider: ${data.providerName}
        - Client: ${data.clientName}
        - Services: ${data.services}`
    },

    'invoice': {
        system: BASE_SYSTEM_PROMPT,
        buildUserPrompt: (data) => `Generate an Invoice.
        - From: ${data.fromName}
        - To: ${data.toName}
        - Invoice #: ${data.invoiceNumber}
        - Items: ${data.items}`
    },

    'non-compete': {
        system: BASE_SYSTEM_PROMPT,
        buildUserPrompt: (data) => `Generate a Non-Compete Agreement for ${data.jurisdiction}.
        CRITICAL: Ensure scope and duration are reasonable for this jurisdiction.
        - Employer: ${data.employerName}
        - Employee: ${data.employeeName}
        - Duration: ${data.duration}
        - Area: ${data.geographicArea}`
    },

    'tos': {
        system: BASE_SYSTEM_PROMPT,
        buildUserPrompt: (data) => `Generate Terms of Service for ${data.jurisdiction}.
        - Company: ${data.companyName}
        - Website: ${data.websiteUrl}`
    },

    'partnership-agreement': {
        system: BASE_SYSTEM_PROMPT,
        buildUserPrompt: (data) => `Generate a Partnership Agreement for ${data.jurisdiction}.
        - Partners: ${data.partner1} and ${data.partner2}
        - Business: ${data.businessName}`
    },

    'termination-letter': {
        system: BASE_SYSTEM_PROMPT,
        buildUserPrompt: (data) => `Generate a Termination Letter.
        - Employer: ${data.employerName}
        - Employee: ${data.employeeName}
        - Date: ${data.terminationDate}
        - Reason: ${data.reason}`
    },

    'msa': {
        system: BASE_SYSTEM_PROMPT,
        buildUserPrompt: (data) => `Generate a Master Service Agreement (MSA) for ${data.jurisdiction}.
        - Provider: ${data.providerName}
        - Client: ${data.clientName}`
    },

    'sales-agreement': {
        system: BASE_SYSTEM_PROMPT,
        buildUserPrompt: (data) => `Generate a Sales Agreement.
        - Seller: ${data.sellerName}
        - Buyer: ${data.buyerName}
        - Item: ${data.itemDescription}
        - Price: ${data.price}`
    },

    'lease-agreement': {
        system: BASE_SYSTEM_PROMPT,
        buildUserPrompt: (data) => `Generate a Residential Lease Agreement.
        - Landlord: ${data.landlordName}
        - Tenant: ${data.tenantName}
        - Property: ${data.propertyAddress}
        - Rent: ${data.rentAmount}`
    },

    'promissory-note': {
        system: BASE_SYSTEM_PROMPT,
        buildUserPrompt: (data) => `Generate a Promissory Note.
        - Lender: ${data.lenderName}
        - Borrower: ${data.borrowerName}
        - Amount: ${data.loanAmount}
        - Terms: ${data.repaymentTerms}`
    },

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
