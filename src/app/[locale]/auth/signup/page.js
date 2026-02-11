import { getDictionary } from '@/lib/get-dictionary';
import SignUpClient from '@/components/SignUpClient';

export default async function SignUpPage({ params }) {
    const { locale } = await params;
    const dict = await getDictionary(locale);

    return <SignUpClient locale={locale} dict={dict} />;
}
