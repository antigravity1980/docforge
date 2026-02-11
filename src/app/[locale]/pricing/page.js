import { getDictionary } from '@/lib/get-dictionary';
import PricingClient from '@/components/PricingClient';

export default async function PricingPage({ params }) {
    const { locale } = await params;
    const dict = await getDictionary(locale);

    return <PricingClient locale={locale} dict={dict} />;
}
