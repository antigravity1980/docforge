import { getDictionary } from '@/lib/get-dictionary';
import PricingClient from '@/components/PricingClient';
import { supabaseAdmin } from '@/lib/supabase-admin';

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
        pro: settings.pricePro || '79'
    };

    return <PricingClient locale={locale} dict={dict} prices={prices} />;
}
