import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { generateWithAI } from '@/lib/ai';
import { PROMPTS, DEFAULT_PROMPT } from '@/lib/prompts';
import { ADMIN_EMAILS } from '@/lib/config';

export async function POST(request) {
    try {
        const supabase = await createClient();

        // 1. Check Auth
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { type, data, locale = 'en' } = body;

        if (!type || !data) {
            return NextResponse.json(
                { error: 'Missing document type or data' },
                { status: 400 }
            );
        }

        // 2. Check Usage Limits
        const { data: profile } = await supabase
            .from('profiles')
            .select('plan, docs_generated_this_month')
            .eq('id', session.user.id)
            .single();

        const limits = {
            'Free': 3,
            'Starter': 30,
            'Professional': 1000
        };

        const currentPlan = profile?.plan || 'Free';
        const userLimit = limits[currentPlan] || 3;
        const currentUsage = profile?.docs_generated_this_month || 0;

        // Bypass limits for admin email
        const isAdmin = ADMIN_EMAILS.includes(session.user.email);

        if (currentUsage >= userLimit && !isAdmin) {
            return NextResponse.json({
                error: 'Usage limit reached for your plan. Please upgrade to continue.',
                limitReached: true
            }, { status: 403 });
        }

        // 3. Get prompts and generate
        const promptConfig = PROMPTS[type] || DEFAULT_PROMPT;

        // Dynamic language instruction
        const languageMap = {
            'en': 'English',
            'fr': 'French',
            'de': 'German',
            'es': 'Spanish',
            'it': 'Italian',
            'pt': 'Portuguese'
        };
        const targetLanguage = languageMap[locale] || 'English';

        const systemPrompt = `${promptConfig.system}\n\nCRITICAL: The entire document MUST be generated in ${targetLanguage}. Do not use any other languages. Ensure natural phrasing and correct legal/business terminology in ${targetLanguage}.`;
        const userPrompt = promptConfig.buildUserPrompt(data);

        const documentContent = await generateWithAI(systemPrompt, userPrompt);

        // 4. Save to Database
        console.log(`💾 Saving generated ${type} document for user ${session.user.id}`);
        const { data: doc, error: dbError } = await supabase
            .from('documents')
            .insert({
                user_id: session.user.id,
                title: data.title || data.companyName || data.freelancerName || data.yourCompany || `${type.charAt(0).toUpperCase() + type.slice(1)} Document`,
                type: type,
                content: documentContent,
                meta_data: data
            })
            .select()
            .single();

        if (dbError) {
            console.error('❌ Database insert error:', dbError);
            throw new Error(`Database error: ${dbError.message}`);
        }

        console.log(`✅ Document saved successfully with ID: ${doc?.id}`);

        // 5. Increment Usage Counter
        await supabase
            .from('profiles')
            .update({ docs_generated_this_month: (profile?.docs_generated_this_month || 0) + 1 })
            .eq('id', session.user.id);

        return NextResponse.json({
            success: true,
            document: documentContent,
            documentId: doc.id,
            type,
            generatedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Document generation error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to generate document' },
            { status: 500 }
        );
    }
}
