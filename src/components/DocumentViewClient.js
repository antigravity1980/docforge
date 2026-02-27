'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
// import ReactMarkdown from 'react-markdown'; // Removed
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import ReactDOMServer from 'react-dom/server';
import Logo from '@/components/Logo';
import Editor from '@/components/Editor'; // Added
import ReactMarkdown from 'react-markdown'; // Keep for fallback in PDF generation if needed

export default function DocumentViewClient({ doc, locale, dict }) {
    const router = useRouter();
    const g = dict.generate;
    const ui = g.ui || {};
    const [editorHtml, setEditorHtml] = useState(null); // Added state

    // Config based on doc type, similar to generator
    const docConfig = g.docs && g.docs[doc.type] ? g.docs[doc.type] : {
        name: doc.title,
        desc: doc.type,
        icon: '📄'
    };

    // ... imports

    const handlePrint = () => {
        const logoBase64 = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB3aWR0aD0iMTAwJSIKICAgaGVpZ2h0PSIxMDAlIgogICB2aWV3Qm94PSIwIDAgMTAwIDEwMCIKICAgdmVyc2lvbj0iMS4xIgogICBpZD0ic3ZnMSIKICAgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMS40LjIgKGViZjBlOTQwLCAyMDI1LTA1LTA4KSIKICAgc29kaXBvZGk6ZG9jbmFtZT0iRG9jRm9yZ2Uuc3ZnIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48c29kaXBvZGk6bmFtZWR2aWV3CiAgICAgaWQ9Im5hbWVkdmlldzEiCiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIgogICAgIGJvcmRlcmNvbG9yPSIjMDAwMDAwIgogICAgIGJvcmRlcm9wYWNpdHk9IjAuMjUiCiAgICAgaW5rc2NhcGU6c2hvd3BhZ2VzaGFkb3c9IjIiCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAuMCIKICAgICBpbmtzY2FwZTpwYWdlY2hlY2tlcmJvYXJkPSIwIgogICAgIGlua3NjYXBlOmRlc2tjb2xvcj0iI2QxZDFkMSIKICAgICBpbmtzY2FwZTpkb2N1bWVudC11bml0cz0ibW0iCiAgICAgaW5rc2NhcGU6em9vbT0iMC42NzI5NTQyIgogICAgIGlua3NjYXBlOmN4PSIxNTYuMDI4NDUiCiAgICAgaW5rc2NhcGU6Y3k9IjIyMy42NDA3OCIKICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjE0NDAiCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iODQyIgogICAgIGlua3NjYXBlOndpbmRvdy14PSIwIgogICAgIGlua3NjYXBlOndpbmRvdy15PSIzMCIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIwIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9ImxheWVyMiIgLz48ZGVmcwogICAgIGlkPSJkZWZzMSI+PGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQxNSIKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyI+PHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2UzYTY0MDtzdG9wLW9wYWNpdHk6MTsiCiAgICAgICAgIG9mZnNldD0iMC41Mzc3Nzc3OCIKICAgICAgICAgaWQ9InN0b3AxNSIgLz48c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojY2M3ZDJlO3N0b3Atb3BhY2l0eToxOyIKICAgICAgICAgb2Zmc2V0PSIwLjc3Nzc3Nzc5IgogICAgICAgICBpZD0ic3RvcDE2IiAvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQxNSIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDE2IgogICAgICAgeDE9Ijg4LjM0MzE5MyIKICAgICAgIHkxPSI0Ni41MjI0NjUiCiAgICAgICB4Mj0iMTEuNjMwNjE1IgogICAgICAgeTI9IjQ2LjUyMjQ2NSIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgtNS4zNWUtNSw1Ljk5ZS01KSIgLz48L2RlZnM+PGcKICAgICBpbmtzY2FwZTpncm91cG1vZGU9ImxheWVyIgogICAgIGlkPSJsYXllcjIiCiAgICAgaW5rc2NhcGU6bGFiZWw9ItCh0LvQvtC5IDIiCiAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMC43NjIwODAxMiwwLDAsMC43NjIwODAxMiw3LjQyNDUwMTUsNS40NjE0NjM1KSI+PHBhdGgKICAgICAgIGQ9Ik0gMzEuMjA1ODg5LDk1LjU3NTI3MiBWIDIyLjk1NTA1MyBIIDgwLjUwNTgxMiBWIDM3LjY4MzY2MSBIIDQ3Ljk4MDEzNyBWIDUzLjMzMjgwNyBIIDc0Ljc3ODAyIFYgNjYuOTM2MzEyIEggNDcuOTgwMTM3IHYgMjguNjM4OTYgeiIKICAgICAgIGlkPSJ0ZXh0MiIKICAgICAgIHN0eWxlPSJmb250LXdlaWdodDo4MDA7Zm9udC1zaXplOjEwMi4yODJweDtsaW5lLWhlaWdodDoxLjU7Zm9udC1mYW1pbHk6UmFsZXdheTstaW5rc2NhcGUtZm9udC1zcGVjaWZpY2F0aW9uOidSYWxld2F5IFVsdHJhLUJvbGQnO2xldHRlci1zcGFjaW5nOjBweDt3b3JkLXNwYWNpbmc6MHB4O2Rpc3BsYXk6bm9uZTtmaWxsOiM1NTAwMDA7c3Ryb2tlLXdpZHRoOjcuODM0MTQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3BhaW50LW9yZGVyOm1hcmtlcnMgZmlsbCBzdHJva2UiCiAgICAgICBhcmlhLWxhYmVsPSJGIgogICAgICAgc29kaXBvZGk6aW5zZW5zaXRpdmU9InRydWUiIC8+PHBhdGgKICAgICAgIGQ9Ik0gMzEuMjA1ODg5LDk1LjU3NTI3MiBWIDIyLjk1NTA1MyBIIDgwLjUwNTgxMiBWIDM3LjY4MzY2MSBIIDQ3Ljk4MDEzNyBWIDUzLjMzMjgwNyBIIDY1LjgyMDA3MyBWIDY2LjkzNjMxMiBIIDQ3Ljk4MDEzNyB2IDI4LjYzODk2IHoiCiAgICAgICBpZD0idGV4dDItOSIKICAgICAgIHN0eWxlPSJmb250LXdlaWdodDo4MDA7Zm9udC1zaXplOjEwMi4yODJweDtsaW5lLWhlaWdodDoxLjU7Zm9udC1mYW1pbHk6UmFsZXdheTstaW5rc2NhcGUtZm9udC1zcGVjaWZpY2F0aW9uOidSYWxld2F5IFVsdHJhLUJvbGQnO2xldHRlci1zcGFjaW5nOjBweDt3b3JkLXNwYWNpbmc6MHB4O2ZpbGw6I2U2ZTZlNjtmaWxsLW9wYWNpdHk6MTtzdHJva2Utd2lkdGg6Ny44MzQxNDtzdHJva2UtbGluZWpvaW46cm91bmQ7cGFpbnQtb3JkZXI6bWFya2VycyBmaWxsIHN0cm9rZSIKICAgICAgIGFyaWEtbGFiZWw9IkYiCiAgICAgICBzb2RpcG9kaTpub2RldHlwZXM9ImNjY2NjY2NjY2NjIiAvPjwvZz48ZwogICAgIGlua3NjYXBlOmxhYmVsPSLQodC70L7QuSAxIgogICAgIGlua3NjYXBlOmdyb3VwbW9kZT0ibGF5ZXIiCiAgICAgaWQ9ImxheWVyMSI+PHBhdGgKICAgICAgIGQ9Ik0gMTAuMzM4NTU2LDk1LjQ5MjEyNiBWIDQuNTA3NzU0MiBoIDMzLjk1ODk1NiBxIDExLjI3NjkzNiwwIDE5LjczNDYzOSwzLjU4ODExNjEgOC40NTc3MDIsMy41ODgxMTU3IDE0LjA5NjE3LDkuNzM5MTcyNyA1Ljc2NjYxNSw2LjE1MTA1NiA4LjU4NTg0OSwxNC40ODA2MTEgMi45NDczODEsOC4yMDE0MDggMi45NDczODEsMTcuNTU2MTM5IDAsMTAuMzc5OTA4IC0zLjIwMzY3NSwxOC44Mzc2MSAtMy4yMDM2NzUsOC4zMjk1NTUgLTkuMjI2NTg0LDE0LjM1MjQ2NCAtNS44OTQ3NjIsNS44OTQ3NjIgLTE0LjM1MjQ2NCw5LjIyNjU4NCAtOC4zMjk1NTYsMy4yMDM2NzUgLTE4LjU4MTMxNiwzLjIwMzY3NSB6IE0gNjguMjYxMDAyLDQ5Ljg3MTc5MyBxIDAsLTYuMDIyOTA5IC0xLjY2NTkxMSwtMTAuODkyNDk1IFEgNjUuMDU3MzI3LDMzLjk4MTU2NSA2MS45ODE3OTksMzAuMzkzNDQ5IDU4LjkwNjI3MSwyNi44MDUzMzMgNTQuNDIxMTI1LDI0Ljg4MzEyOCA0OS45MzU5OCwyMi45NjA5MjMgNDQuMjk3NTEyLDIyLjk2MDkyMyBIIDMxLjM1NDY2NSB2IDU0LjA3ODAzNSBoIDEyLjk0Mjg0NyBxIDUuNzY2NjE1LDAgMTAuMjUxNzYsLTIuMDUwMzUyIDQuNDg1MTQ2LC0yLjA1MDM1MiA3LjQzMjUyNywtNS42Mzg0NjggMy4wNzU1MjgsLTMuNzE2MjYzIDQuNjEzMjkyLC04LjU4NTg0OSAxLjY2NTkxMSwtNC45OTc3MzQgMS42NjU5MTEsLTEwLjg5MjQ5NiB6IgogICAgICAgaWQ9InRleHQxIgogICAgICAgc3R5bGU9ImZvbnQtd2VpZ2h0OjgwMDtmb250LXNpemU6MTI4LjE0N3B4O2xpbmUtaGVpZ2h0OjEuNTtmb250LWZhbWlseTpSYWxld2F5Oy1pbmtzY2FwZS1mb250LXNwZWNpZmljYXRpb246J1JhbGV3YXkgVWx0cmEtQm9sZCc7bGV0dGVyLXNwYWNpbmc6MHB4O3dvcmQtc3BhY2luZzowcHg7ZGlzcGxheTpub25lO2ZpbGw6I2EwNWEyYztzdHJva2Utd2lkdGg6OS44MTUxNztzdHJva2UtbGluZWpvaW46cm91bmQ7cGFpbnQtb3JkZXI6bWFya2VycyBmaWxsIHN0cm9rZSIKICAgICAgIGFyaWEtbGFiZWw9IkQiCiAgICAgICBzb2RpcG9kaTppbnNlbnNpdGl2ZT0idHJ1ZSIgLz48cGF0aAogICAgICAgZD0iTSAxMC4zMzg1MDIsOTUuNDkyMTg2IFYgNC41MDc4MTQxIGggMzMuOTU4OTU2IHEgMTEuMjc2OTM2LDAgMTkuNzM0NjM5LDMuNTg4MTE2MSA4LjQ1NzcwMiwzLjU4ODExNTggMTQuMDk2MTcsOS43MzkxNzI4IDUuNzY2NjE1LDYuMTUxMDU2IDguNTg1ODQ5LDE0LjQ4MDYxMSAyLjk0NzM4MSw4LjIwMTQwOCAyLjk0NzM4MSwxNy41NTYxMzkgMCwxMC4zNzk5MDggLTMuMjAzNjc1LDE4LjgzNzYxIC0zLjIwMzY3NSw4LjMyOTU1NSAtOS4yMjY1ODQsMTQuMzUyNDY0IC01Ljg5NDc2Miw1Ljg5NDc2MiAtMTQuMzUyNDY0LDkuMjI2NTg0IC04LjMyOTU1NSwzLjIwMzY3NSAtMTguNTgxMzE2LDMuMjAzNjc1IHogTSA2OC4yNjA5NDgsNDkuODcxODUzIHEgMCwtNi4wMjI5MDkgLTEuNjY1OTEsLTEwLjg5MjQ5NSAtMS41Mzc3NjUsLTQuOTk3NzMzIC00LjYxMzI5MiwtOC41ODU4NDkgLTMuMDc1NTI5LC0zLjU4ODExNiAtNy41NjA2NzQsLTUuNTEwMzIxIC00LjQ4NTE0NiwtMS45MjIyMDUgLTEwLjEyMzYxNCwtMS45MjIyMDUgSCAzMS4zNTQ2MTEgdiA1NC4wNzgwMzUgaCAxMi45NDI4NDcgcSA1Ljc2NjYxNSwwIDEwLjI1MTc2MSwtMi4wNTAzNTIgNC40ODUxNDYsLTIuMDUwMzUyIDcuNDMyNTI3LC01LjYzODQ2OCAzLjA3NTUyNywtMy43MTYyNjMgNC42MTMyOTEsLTguNTg1ODQ5IDEuNjY1OTExLC00Ljk5NzczNCAxLjY2NTkxMSwtMTAuODkyNDk2IHoiCiAgICAgICBpZD0idGV4dDEtNyIKICAgICAgIHN0eWxlPSJmb250LXdlaWdodDo4MDA7Zm9udC1zaXplOjEyOC4xNDdweDtsaW5lLWhlaWdodDoxLjU7Zm9udC1mYW1pbHk6UmFsZXdheTstaW5rc2NhcGUtZm9udC1zcGVjaWZpY2F0aW9uOidSYWxld2F5IFVsdHJhLUJvbGQnO2xldHRlci1zcGFjaW5nOjBweDt3b3JkLXNwYWNpbmc6MHB4O2ZpbGw6dXJsKCNsaW5lYXJHcmFkaWVudDE2KTtmaWxsLW9wYWNpdHk6MTtzdHJva2Utd2lkdGg6OS44MTUxNztzdHJva2UtbGluZWpvaW46cm91bmQ7cGFpbnQtb3JkZXI6bWFya2VycyBmaWxsIHN0cm9rZSIKICAgICAgIGFyaWEtbGFiZWw9IkQiIC8+PC9nPjxnCiAgICAgaW5rc2NhcGU6Z3JvdXBtb2RlPSJsYXllciIKICAgICBpZD0ibGF5ZXIzIgogICAgIGlua3NjYXBlOmxhYmVsPSLQodC70L7QuSAzIiAvPjwvc3ZnPgo=";
        const logoHtml = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <img src="${logoBase64}" alt="DocForge Logo" style="width: 40px; height: 40px;" />
                <span style="font-size: 24px; font-weight: 800; color: #111; letter-spacing: -0.5px; font-family: 'Inter', sans-serif;">
                    Doc<span style="color: #f59e0b;">Forge</span> AI
                </span>
            </div>
        `;

        // Use edited HTML if available, otherwise generate from initial markdown
        let contentHtml;
        if (editorHtml) {
            contentHtml = editorHtml;
        } else {
            contentHtml = ReactDOMServer.renderToStaticMarkup(
                <div className="markdown-content">
                    <ReactMarkdown>{doc.content}</ReactMarkdown>
                </div>
            );
        }

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
      <html>
        <head>
          <title>${doc.title}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
            
            @page {
                size: A4;
                margin: 0;
            }
            
            body {
                font-family: 'Inter', sans-serif;
                margin: 0;
                padding: 20mm;
                color: #111;
                -webkit-print-color-adjust: exact;
            }

            .print-container {
                width: 100%;
                margin: 0;
            }

            /* Logo Styling */
            .header-branding { margin-bottom: 40px; }
            
            /* Content Styling (Shared for Markdown & Editor HTML) */
            .content { font-size: 14px; line-height: 1.6; }
            .content h1 { font-size: 24px; font-weight: 800; margin-bottom: 12px; color: #000; }
            .content h2 { font-size: 18px; font-weight: 700; margin-top: 32px; margin-bottom: 16px; border-bottom: 1px solid #eee; padding-bottom: 8px; color: #333; }
            .content h3 { font-size: 16px; font-weight: 600; margin-top: 24px; margin-bottom: 12px; color: #444; }
            .content p { margin-bottom: 16px; text-align: justify; }
            .content ul, .content ol { margin-bottom: 16px; padding-left: 24px; }
            .content li { margin-bottom: 8px; }
            
            /* Bold/Italic Fixes */
            .content strong { font-weight: 800; color: #000; }
            .content em { font-style: italic; }
            
            /* Disclaimer */
            .disclaimer { 
                margin-top: 60px; 
                padding-top: 20px; 
                border-top: 1px solid #eee; 
                font-size: 10px; 
                color: #999; 
                text-align: center;
                font-style: italic;
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <div class="header-branding">
                ${logoHtml}
            </div>
            
            <div class="content">
                ${contentHtml}
            </div>

            <div class="disclaimer">
                ${g.disclaimer}
            </div>
          </div>
          <script>
            window.onload = () => {
                setTimeout(() => {
                    window.print();
                    window.close();
                }, 500);
            };
          </script>
        </body>
      </html>
    `);
        printWindow.document.close();
    };

    const handleDownload = async () => {
        const { jsPDF } = await import('jspdf');
        const docPDF = new jsPDF('p', 'pt', 'a4');

        const tempDiv = document.createElement('div');
        tempDiv.style.width = '595pt';
        tempDiv.style.padding = '40px';
        tempDiv.style.background = '#fff';
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-10000px';
        tempDiv.style.top = '0';

        const logoBase64 = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB3aWR0aD0iMTAwJSIKICAgaGVpZ2h0PSIxMDAlIgogICB2aWV3Qm94PSIwIDAgMTAwIDEwMCIKICAgdmVyc2lvbj0iMS4xIgogICBpZD0ic3ZnMSIKICAgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMS40LjIgKGViZjBlOTQwLCAyMDI1LTA1LTA4KSIKICAgc29kaXBvZGk6ZG9jbmFtZT0iRG9jRm9yZ2Uuc3ZnIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48c29kaXBvZGk6bmFtZWR2aWV3CiAgICAgaWQ9Im5hbWVkdmlldzEiCiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIgogICAgIGJvcmRlcmNvbG9yPSIjMDAwMDAwIgogICAgIGJvcmRlcm9wYWNpdHk9IjAuMjUiCiAgICAgaW5rc2NhcGU6c2hvd3BhZ2VzaGFkb3c9IjIiCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAuMCIKICAgICBpbmtzY2FwZTpwYWdlY2hlY2tlcmJvYXJkPSIwIgogICAgIGlua3NjYXBlOmRlc2tjb2xvcj0iI2QxZDFkMSIKICAgICBpbmtzY2FwZTpkb2N1bWVudC11bml0cz0ibW0iCiAgICAgaW5rc2NhcGU6em9vbT0iMC42NzI5NTQyIgogICAgIGlua3NjYXBlOmN4PSIxNTYuMDI4NDUiCiAgICAgaW5rc2NhcGU6Y3k9IjIyMy42NDA3OCIKICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjE0NDAiCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iODQyIgogICAgIGlua3NjYXBlOndpbmRvdy14PSIwIgogICAgIGlua3NjYXBlOndpbmRvdy15PSIzMCIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIwIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9ImxheWVyMiIgLz48ZGVmcwogICAgIGlkPSJkZWZzMSI+PGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQxNSIKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyI+PHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2UzYTY0MDtzdG9wLW9wYWNpdHk6MTsiCiAgICAgICAgIG9mZnNldD0iMC41Mzc3Nzc3OCIKICAgICAgICAgaWQ9InN0b3AxNSIgLz48c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojY2M3ZDJlO3N0b3Atb3BhY2l0eToxOyIKICAgICAgICAgb2Zmc2V0PSIwLjc3Nzc3Nzc5IgogICAgICAgICBpZD0ic3RvcDE2IiAvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQxNSIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDE2IgogICAgICAgeDE9Ijg4LjM0MzE5MyIKICAgICAgIHkxPSI0Ni41MjI0NjUiCiAgICAgICB4Mj0iMTEuNjMwNjE1IgogICAgICAgeTI9IjQ2LjUyMjQ2NSIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgtNS4zNWUtNSw1Ljk5ZS01KSIgLz48L2RlZnM+PGcKICAgICBpbmtzY2FwZTpncm91cG1vZGU9ImxheWVyIgogICAgIGlkPSJsYXllcjIiCiAgICAgaW5rc2NhcGU6bGFiZWw9ItCh0LvQvtC5IDIiCiAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMC43NjIwODAxMiwwLDAsMC43NjIwODAxMiw3LjQyNDUwMTUsNS40NjE0NjM1KSI+PHBhdGgKICAgICAgIGQ9Ik0gMzEuMjA1ODg5LDk1LjU3NTI3MiBWIDIyLjk1NTA1MyBIIDgwLjUwNTgxMiBWIDM3LjY4MzY2MSBIIDQ3Ljk4MDEzNyBWIDUzLjMzMjgwNyBIIDc0Ljc3ODAyIFYgNjYuOTM2MzEyIEggNDcuOTgwMTM3IHYgMjguNjM4OTYgeiIKICAgICAgIGlkPSJ0ZXh0MiIKICAgICAgIHN0eWxlPSJmb250LXdlaWdodDo4MDA7Zm9udC1zaXplOjEwMi4yODJweDtsaW5lLWhlaWdodDoxLjU7Zm9udC1mYW1pbHk6UmFsZXdheTstaW5rc2NhcGUtZm9udC1zcGVjaWZpY2F0aW9uOidSYWxld2F5IFVsdHJhLUJvbGQnO2xldHRlci1zcGFjaW5nOjBweDt3b3JkLXNwYWNpbmc6MHB4O2Rpc3BsYXk6bm9uZTtmaWxsOiM1NTAwMDA7c3Ryb2tlLXdpZHRoOjcuODM0MTQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3BhaW50LW9yZGVyOm1hcmtlcnMgZmlsbCBzdHJva2UiCiAgICAgICBhcmlhLWxhYmVsPSJGIgogICAgICAgc29kaXBvZGk6aW5zZW5zaXRpdmU9InRydWUiIC8+PHBhdGgKICAgICAgIGQ9Ik0gMzEuMjA1ODg5LDk1LjU3NTI3MiBWIDIyLjk1NTA1MyBIIDgwLjUwNTgxMiBWIDM3LjY4MzY2MSBIIDQ3Ljk4MDEzNyBWIDUzLjMzMjgwNyBIIDY1LjgyMDA3MyBWIDY2LjkzNjMxMiBIIDQ3Ljk4MDEzNyB2IDI4LjYzODk2IHoiCiAgICAgICBpZD0idGV4dDItOSIKICAgICAgIHN0eWxlPSJmb250LXdlaWdodDo4MDA7Zm9udC1zaXplOjEwMi4yODJweDtsaW5lLWhlaWdodDoxLjU7Zm9udC1mYW1pbHk6UmFsZXdheTstaW5rc2NhcGUtZm9udC1zcGVjaWZpY2F0aW9uOidSYWxld2F5IFVsdHJhLUJvbGQnO2xldHRlci1zcGFjaW5nOjBweDt3b3JkLXNwYWNpbmc6MHB4O2ZpbGw6I2U2ZTZlNjtmaWxsLW9wYWNpdHk6MTtzdHJva2Utd2lkdGg6Ny44MzQxNDtzdHJva2UtbGluZWpvaW46cm91bmQ7cGFpbnQtb3JkZXI6bWFya2VycyBmaWxsIHN0cm9rZSIKICAgICAgIGFyaWEtbGFiZWw9IkYiCiAgICAgICBzb2RpcG9kaTpub2RldHlwZXM9ImNjY2NjY2NjY2NjIiAvPjwvZz48ZwogICAgIGlua3NjYXBlOmxhYmVsPSLQodC70L7QuSAxIgogICAgIGlua3NjYXBlOmdyb3VwbW9kZT0ibGF5ZXIiCiAgICAgaWQ9ImxheWVyMSI+PHBhdGgKICAgICAgIGQ9Ik0gMTAuMzM4NTU2LDk1LjQ5MjEyNiBWIDQuNTA3NzU0MiBoIDMzLjk1ODk1NiBxIDExLjI3NjkzNiwwIDE5LjczNDYzOSwzLjU4ODExNjEgOC40NTc3MDIsMy41ODgxMTU3IDE0LjA5NjE3LDkuNzM5MTcyNyA1Ljc2NjYxNSw2LjE1MTA1NiA4LjU4NTg0OSwxNC40ODA2MTEgMi45NDczODEsOC4yMDE0MDggMi45NDczODEsMTcuNTU2MTM5IDAsMTAuMzc5OTA4IC0zLjIwMzY3NSwxOC44Mzc2MSAtMy4yMDM2NzUsOC4zMjk1NTUgLTkuMjI2NTg0LDE0LjM1MjQ2NCAtNS44OTQ3NjIsNS44OTQ3NjIgLTE0LjM1MjQ2NCw5LjIyNjU4NCAtOC4zMjk1NTYsMy4yMDM2NzUgLTE4LjU4MTMxNiwzLjIwMzY3NSB6IE0gNjguMjYxMDAyLDQ5Ljg3MTc5MyBxIDAsLTYuMDIyOTA5IC0xLjY2NTkxMSwtMTAuODkyNDk1IFEgNjUuMDU3MzI3LDMzLjk4MTU2NSA2MS45ODE3OTksMzAuMzkzNDQ5IDU4LjkwNjI3MSwyNi44MDUzMzMgNTQuNDIxMTI1LDI0Ljg4MzEyOCA0OS45MzU5OCwyMi45NjA5MjMgNDQuMjk3NTEyLDIyLjk2MDkyMyBIIDMxLjM1NDY2NSB2IDU0LjA3ODAzNSBoIDEyLjk0Mjg0NyBxIDUuNzY2NjE1LDAgMTAuMjUxNzYsLTIuMDUwMzUyIDQuNDg1MTQ2LC0yLjA1MDM1MiA3LjQzMjUyNywtNS42Mzg0NjggMy4wNzU1MjgsLTMuNzE2MjYzIDQuNjEzMjkyLC04LjU4NTg0OSAxLjY2NTkxMSwtNC45OTc3MzQgMS42NjU5MTEsLTEwLjg5MjQ5NiB6IgogICAgICAgaWQ9InRleHQxIgogICAgICAgc3R5bGU9ImZvbnQtd2VpZ2h0OjgwMDtmb250LXNpemU6MTI4LjE0N3B4O2xpbmUtaGVpZ2h0OjEuNTtmb250LWZhbWlseTpSYWxld2F5Oy1pbmtzY2FwZS1mb250LXNwZWNpZmljYXRpb246J1JhbGV3YXkgVWx0cmEtQm9sZCc7bGV0dGVyLXNwYWNpbmc6MHB4O3dvcmQtc3BhY2luZzowcHg7ZGlzcGxheTpub25lO2ZpbGw6I2EwNWEyYztzdHJva2Utd2lkdGg6OS44MTUxNztzdHJva2UtbGluZWpvaW46cm91bmQ7cGFpbnQtb3JkZXI6bWFya2VycyBmaWxsIHN0cm9rZSIKICAgICAgIGFyaWEtbGFiZWw9IkQiCiAgICAgICBzb2RpcG9kaTppbnNlbnNpdGl2ZT0idHJ1ZSIgLz48cGF0aAogICAgICAgZD0iTSAxMC4zMzg1MDIsOTUuNDkyMTg2IFYgNC41MDc4MTQxIGggMzMuOTU4OTU2IHEgMTEuMjc2OTM2LDAgMTkuNzM0NjM5LDMuNTg4MTE2MSA4LjQ1NzcwMiwzLjU4ODExNTggMTQuMDk2MTcsOS43MzkxNzI4IDUuNzY2NjE1LDYuMTUxMDU2IDguNTg1ODQ5LDE0LjQ4MDYxMSAyLjk0NzM4MSw4LjIwMTQwOCAyLjk0NzM4MSwxNy41NTYxMzkgMCwxMC4zNzk5MDggLTMuMjAzNjc1LDE4LjgzNzYxIC0zLjIwMzY3NSw4LjMyOTU1NSAtOS4yMjY1ODQsMTQuMzUyNDY0IC01Ljg5NDc2Miw1Ljg5NDc2MiAtMTQuMzUyNDY0LDkuMjI2NTg0IC04LjMyOTU1NSwzLjIwMzY3NSAtMTguNTgxMzE2LDMuMjAzNjc1IHogTSA2OC4yNjA5NDgsNDkuODcxODUzIHEgMCwtNi4wMjI5MDkgLTEuNjY1OTEsLTEwLjg5MjQ5NSAtMS41Mzc3NjUsLTQuOTk3NzMzIC00LjYxMzI5MiwtOC41ODU4NDkgLTMuMDc1NTI5LC0zLjU4ODExNiAtNy41NjA2NzQsLTUuNTEwMzIxIC00LjQ4NTE0NiwtMS45MjIyMDUgLTEwLjEyMzYxNCwtMS45MjIyMDUgSCAzMS4zNTQ2MTEgdiA1NC4wNzgwMzUgaCAxMi45NDI4NDcgcSA1Ljc2NjYxNSwwIDEwLjI1MTc2MSwtMi4wNTAzNTIgNC40ODUxNDYsLTIuMDUwMzUyIDcuNDMyNTI3LC01LjYzODQ2OCAzLjA3NTUyNywtMy43MTYyNjMgNC42MTMyOTEsLTguNTg1ODQ5IDEuNjY1OTExLC00Ljk5NzczNCAxLjY2NTkxMSwtMTAuODkyNDk2IHoiCiAgICAgICBpZD0idGV4dDEtNyIKICAgICAgIHN0eWxlPSJmb250LXdlaWdodDo4MDA7Zm9udC1zaXplOjEyOC4xNDdweDtsaW5lLWhlaWdodDoxLjU7Zm9udC1mYW1pbHk6UmFsZXdheTstaW5rc2NhcGUtZm9udC1zcGVjaWZpY2F0aW9uOidSYWxld2F5IFVsdHJhLUJvbGQnO2xldHRlci1zcGFjaW5nOjBweDt3b3JkLXNwYWNpbmc6MHB4O2ZpbGw6dXJsKCNsaW5lYXJHcmFkaWVudDE2KTtmaWxsLW9wYWNpdHk6MTtzdHJva2Utd2lkdGg6OS44MTUxNztzdHJva2UtbGluZWpvaW46cm91bmQ7cGFpbnQtb3JkZXI6bWFya2VycyBmaWxsIHN0cm9rZSIKICAgICAgIGFyaWEtbGFiZWw9IkQiIC8+PC9nPjxnCiAgICAgaW5rc2NhcGU6Z3JvdXBtb2RlPSJsYXllciIKICAgICBpZD0ibGF5ZXIzIgogICAgIGlua3NjYXBlOmxhYmVsPSLQodC70L7QuSAzIiAvPjwvc3ZnPgo=";
        const logoHtml = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <img src="${logoBase64}" alt="DocForge Logo" style="width: 40px; height: 40px;" />
                <span style="font-size: 24px; font-weight: 800; color: #111; letter-spacing: -0.5px; font-family: 'Inter', sans-serif;">
                    Doc<span style="color: #f59e0b;">Forge</span> AI
                </span>
            </div>
        `;

        let contentHtml;
        if (editorHtml) {
            contentHtml = editorHtml;
        } else {
            contentHtml = ReactDOMServer.renderToStaticMarkup(
                <div className="markdown-content">
                    <ReactMarkdown>{doc.content}</ReactMarkdown>
                </div>
            );
        }

        // Inject styles directly for html2canvas to capture
        tempDiv.innerHTML = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
                .pdf-container { font-family: 'Inter', sans-serif; color: #111; }
                .header-branding { margin-bottom: 30px; }
                .pdf-content { font-size: 11pt; line-height: 1.6; color: #000; }
                .pdf-content h1 { font-size: 24px; font-weight: 800; margin-bottom: 12px; color: #000; }
                .pdf-content h2 { font-size: 18px; font-weight: 700; margin-top: 24px; margin-bottom: 12px; border-bottom: 1px solid #eee; padding-bottom: 8px; color: #333; }
                .pdf-content h3 { font-size: 16px; font-weight: 600; margin-top: 18px; margin-bottom: 10px; color: #444; }
                .pdf-content p { margin-bottom: 12px; text-align: justify; }
                .pdf-content ul, .pdf-content ol { margin-bottom: 12px; padding-left: 20px; }
                .pdf-content li { margin-bottom: 6px; }
                .pdf-content strong { font-weight: 800; color: #000; }
                .disclaimer { margin-top: 50px; padding-top: 15px; border-top: 0.5pt solid #eee; font-size: 9pt; color: #666; text-align: center; font-style: italic; }
            </style>
            <div class="pdf-container">
                <div class="header-branding">${logoHtml}</div>
                <div class="pdf-content">
                    ${contentHtml}
                </div>
                <div class="disclaimer">
                    ${ui.disclaimer}
                </div>
            </div>
        `;

        document.body.appendChild(tempDiv);

        try {
            await docPDF.html(tempDiv, {
                callback: function (pdf) {
                    pdf.save(`${doc.title || 'document'}.pdf`);
                    document.body.removeChild(tempDiv);
                },
                x: 0,
                y: 0,
                width: 595,
                windowWidth: 800,
                margin: [20, 20, 20, 20],
                autoPaging: 'text',
                html2canvas: {
                    scale: 0.75,
                    useCORS: true,
                    logging: false
                }
            });
        } catch (e) {
            console.error(e);
            alert("Error generating PDF. Please try 'Print' instead.");
            if (document.body.contains(tempDiv)) {
                document.body.removeChild(tempDiv);
            }
        }
    };

    return (
        <section style={s.page}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <div style={s.header}>
                    <Link href={`/${locale}/documents`} style={s.backBtn}>← {dict.dashboard.viewAll}</Link>
                    <div style={s.headerIcon}>{docConfig.icon || '📄'}</div>
                    <h1 className="responsive-title">{doc.title}</h1>
                    <p style={s.subtitle}>{new Date(doc.created_at).toLocaleDateString(locale)} · {doc.type}</p>
                </div>

                <div style={s.resultSection}>
                    <div style={s.resultHeader}>
                        <h2 style={s.resultTitle}>{ui.docGenerated || "Document Content"}</h2>
                        <div style={s.resultActions}>
                            <button onClick={() => { navigator.clipboard.writeText(editorHtml || doc.content); }} className="btn btn-secondary btn-sm">
                                📋 {ui.copy || 'Copy'}
                            </button>
                            <button onClick={handleDownload} className="btn btn-primary btn-sm">
                                💾 {ui.downloadPdf || 'Download PDF'}
                            </button>
                            <button onClick={handlePrint} className="btn btn-secondary btn-sm">
                                🖨️ {ui.print || 'Print'}
                            </button>
                        </div>
                    </div>

                    <div style={s.resultContent}>
                        <Editor initialContent={doc.content} onChange={setEditorHtml} />
                    </div>

                    <div style={s.disclaimer}>
                        {ui.disclaimer}
                    </div>
                </div>
            </div>
        </section>
    );
}

const s = {
    page: {
        padding: '40px 0 80px',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0a0a0f 0%, #12121a 100%)',
    },
    header: {
        textAlign: 'center',
        marginBottom: '40px',
    },
    backBtn: {
        background: 'none',
        border: 'none',
        color: '#818cf8',
        fontSize: '14px',
        cursor: 'pointer',
        marginBottom: '24px',
        display: 'inline-block',
        textDecoration: 'none',
    },
    headerIcon: {
        fontSize: '48px',
        marginBottom: '12px',
    },
    title: {
        // Handled by .responsive-title
    },
    subtitle: {
        fontSize: '16px',
        color: '#6b6b80',
    },
    resultSection: {
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px',
        padding: '36px',
    },
    resultHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px',
    },
    resultTitle: {
        fontSize: '20px',
        fontWeight: 700,
    },
    resultActions: {
        display: 'flex',
        gap: '8px',
    },
    disclaimer: {
        padding: '12px 0',
        fontSize: '11px',
        color: '#4a4a5c',
        lineHeight: 1.4,
        textAlign: 'center',
        marginTop: '12px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
    },
    resultContent: {
        background: 'rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '12px',
        padding: '24px',
        maxHeight: '600px',
        overflowY: 'auto',
    },
};
