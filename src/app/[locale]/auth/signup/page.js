import { generateAlternates } from '@/lib/metadata';
import { getDictionary } from '@/lib/get-dictionary';
import SignUpClient from '@/components/SignUpClient';


export async function generateMetadata({ params }) {
    const { locale } = await params;
    return {
        alternates: generateAlternates(locale, 'auth/signup'),
    };
}

export default async function SignUpPage({ params }) {
    const { locale } = await params;
    const dict = await getDictionary(locale);

    return <SignUpClient locale={locale} dict={dict} />;
}
