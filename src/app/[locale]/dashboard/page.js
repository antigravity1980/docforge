import { getDictionary } from '@/lib/get-dictionary';
import DashboardClient from '@/components/DashboardClient';

export default async function DashboardPage({ params }) {
    const { locale } = await params;
    const dict = await getDictionary(locale);

    return <DashboardClient locale={locale} dict={dict} />;
}
