import { getDictionary } from '@/lib/get-dictionary';
import SignInClient from '@/components/SignInClient';

export default async function SignInPage({ params }) {
    const { locale } = await params;
    const dict = await getDictionary(locale);

    return <SignInClient locale={locale} dict={dict} />;
}
