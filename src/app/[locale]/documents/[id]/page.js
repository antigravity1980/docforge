import { createClient } from '@/utils/supabase/server';
import { getDictionary } from '@/lib/get-dictionary';
import DocumentViewClient from '@/components/DocumentViewClient';
import { notFound, redirect } from 'next/navigation';

export default async function DocumentPage({ params }) {
    const { locale, id } = await params;
    const dict = await getDictionary(locale);
    const supabase = await createClient();

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        redirect(`/${locale}/auth/signin`);
    }

    const { data: doc, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .eq('user_id', session.user.id)
        .single();

    if (error || !doc) {
        return notFound();
    }

    return (
        <DocumentViewClient doc={doc} locale={locale} dict={dict} />
    );
}
