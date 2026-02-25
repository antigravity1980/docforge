import { generateAlternates } from '@/lib/metadata';
import { getDictionary } from '@/lib/get-dictionary';
import PricingClient from '@/components/PricingClient';
import { supabaseAdmin } from '@/lib/supabase-admin';


export async function generateMetadata({ params }) {
    const { locale } = await params;
    return {
        alternates: generateAlternates(locale, 'pricing'),
    };
}

export default async function PricingPage({ params }) {
    const { locale } = await params;
    const dict = await getDictionary(locale);

    // Fetch prices from DB
    const { data: settingsData } = await supabaseAdmin
        .from('settings')
        .select('key, value');

    const settings = settingsData?.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {}) || {};

    const prices = {
        starter: settings.priceStarter || '29',
        pro: settings.pricePro || '79',
        starterYearly: settings.priceStarterYearly || '290',
        proYearly: settings.priceProYearly || '790'
    };

    return <PricingClient locale={locale} dict={dict} prices={prices} />;
}
