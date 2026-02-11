import { getDictionary } from '@/lib/get-dictionary';
import GenerateDocumentClient from '@/components/GenerateDocumentClient';

export default async function GenerateDocumentPage({ params }) {
    const { locale } = await params;
    const dict = await getDictionary(locale);

    return <GenerateDocumentClient locale={locale} dict={dict} />;
}
