import { generateAlternates } from '@/lib/metadata';
import { getDictionary } from '@/lib/get-dictionary';
import SignInClient from '@/components/SignInClient';


export async function generateMetadata({ params }) {
    const { locale } = await params;
    return {
        alternates: generateAlternates(locale, 'auth/signin'),
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default async function SignInPage({ params }) {
    const { locale } = await params;
    const dict = await getDictionary(locale);

    return <SignInClient locale={locale} dict={dict} />;
}
