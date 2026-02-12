'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import { Markdown } from 'tiptap-markdown';
import { useEffect } from 'react';

const MenuBar = ({ editor }) => {
    if (!editor) {
        return null;
    }

    return (
        <div style={styles.menuBar}>
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                style={{ ...styles.button, ...(editor.isActive('bold') ? styles.activeButton : {}) }}
            >
                Bold
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                style={{ ...styles.button, ...(editor.isActive('italic') ? styles.activeButton : {}) }}
            >
                Italic
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                style={{ ...styles.button, ...(editor.isActive('heading', { level: 1 }) ? styles.activeButton : {}) }}
            >
                H1
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                style={{ ...styles.button, ...(editor.isActive('heading', { level: 2 }) ? styles.activeButton : {}) }}
            >
                H2
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                style={{ ...styles.button, ...(editor.isActive('bulletList') ? styles.activeButton : {}) }}
            >
                List
            </button>
            <div style={styles.divider} />
            <button
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                style={styles.button}
            >
                Undo
            </button>
            <button
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                style={styles.button}
            >
                Redo
            </button>
        </div>
    );
};

export default function Editor({ initialContent, onChange }) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Highlight,
            Typography,
            Markdown,
        ],
        content: initialContent,
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none',
                style: 'min-height: 500px; padding: 24px; color: #e2e8f0;'
            },
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange(html);
        },
    });

    // Update content if initialContent changes (e.g. re-generation)
    // But be careful not to overwrite user edits if they are typing.
    // This is a simple implementation; ideally we'd track a "dirty" state.
    useEffect(() => {
        if (editor && initialContent && editor.isEmpty) {
            editor.commands.setContent(initialContent);
        }
    }, [initialContent, editor]);


    return (
        <div style={styles.editorContainer}>
            <MenuBar editor={editor} />
            <div style={styles.contentContainer}>
                <EditorContent editor={editor} />
            </div>

            <style jsx global>{`
                .ProseMirror {
                     outline: none;
                }
                .ProseMirror p {
                    margin-bottom: 1em;
                    line-height: 1.6;
                }
                .ProseMirror h1 {
                    font-size: 2em;
                    font-weight: bold;
                    margin-top: 1em;
                    margin-bottom: 0.5em;
                }
                .ProseMirror h2 {
                    font-size: 1.5em;
                    font-weight: bold;
                    margin-top: 1em;
                    margin-bottom: 0.5em;
                }
                .ProseMirror ul {
                    list-style-type: disc;
                    padding-left: 1.5em;
                    margin-bottom: 1em;
                }
                .ProseMirror ol {
                    list-style-type: decimal;
                    padding-left: 1.5em;
                    margin-bottom: 1em;
                }
            `}</style>
        </div>
    );
}

const styles = {
    editorContainer: {
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
    },
    menuBar: {
        background: 'rgba(0, 0, 0, 0.2)',
        padding: '12px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    button: {
        background: 'transparent',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#a0a0b8',
        padding: '6px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: 500,
        transition: 'all 0.2s',
    },
    activeButton: {
        background: 'rgba(99, 102, 241, 0.2)',
        color: '#ffffff',
        borderColor: 'rgba(99, 102, 241, 0.5)',
    },
    divider: {
        width: '1px',
        height: '24px',
        background: 'rgba(255, 255, 255, 0.1)',
        margin: '0 8px',
    },
    contentContainer: {
        background: 'transparent', // Let parent bg show through or handle via CSS
        minHeight: '500px',
    },
};
