import { generateAlternates } from '@/lib/metadata';
import { getDictionary } from '@/lib/get-dictionary';
import DashboardClient from '@/components/DashboardClient';


export async function generateMetadata({ params }) {
    const { locale } = await params;
    return {
        alternates: generateAlternates(locale, 'dashboard'),
    };
}

export default async function DashboardPage({ params }) {
    const { locale } = await params;
    const dict = await getDictionary(locale);

    return <DashboardClient locale={locale} dict={dict} />;
}
