const fs = require('fs');
const path = require('path');

const generateMetadataSnippet = (routePath, isDynamic) => `
export async function generateMetadata({ params }) {
    const { locale } = await params;
    const { generateAlternates } = await import('@/lib/metadata');
    return {
        alternates: generateAlternates(locale, '${routePath}'),
    };
}
`;

function processFile(filePath, relativePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // We want to skip if it already correctly imports generateAlternates
    if (content.includes('generateAlternates')) {
        return;
    }

    // Determine the logical route path (e.g., /pricing, /fr/pricing -> pricing)
    // relativePath is something like src/app/[locale]/pricing/page.js
    let routePath = relativePath.replace('src/app/[locale]/', '').replace('/page.js', '').replace('page.js', '');
    
    // If it's dynamic like generate/[type] or blog/[slug], we need to skip the automatic injection 
    // and do it manually, or the script needs to be very smart.
    if (routePath.includes('[')) {
        console.log('Skipping dynamic route:', routePath);
        return;
    }

    // Inject import at the top
    if (!content.includes("@/lib/metadata")) {
        content = "import { generateAlternates } from '@/lib/metadata';\n" + content;
    }

    // Replace existing generateMetadata or append
    if (content.includes('export async function generateMetadata')) {
        // Regex to find generateMetadata
        const regex = /export async function generateMetadata\([^)]*\)\s*\{[^}]*return\s*\{([\s\S]*?)\};\s*\}/m;
        const match = content.match(regex);
        if (match) {
            const innerMetadata = match[1];
            if (!innerMetadata.includes('alternates:')) {
               content = content.replace(regex, (m, p1) => {
                   return m.replace(p1, p1 + `\n        alternates: generateAlternates(locale, '${routePath}'),\n`);
               });
            }
        }
    } else {
        // Append generateMetadata before the default export
        const exportIdx = content.indexOf('export default');
        if (exportIdx !== -1) {
            const snippet = `
export async function generateMetadata({ params }) {
    const { locale } = await params;
    return {
        alternates: generateAlternates(locale, '${routePath}'),
    };
}
`;
            content = content.slice(0, exportIdx) + snippet + '\n' + content.slice(exportIdx);
        }
    }

    fs.writeFileSync(filePath, content);
    console.log('Updated:', routePath);
}

// Find all page.js inside src/app/[locale]
const glob = require('child_process').execSync('find src/app/\\[locale\\] -name "page.js"').toString().trim().split('\n');

glob.forEach(file => {
    processFile(file, file);
});
