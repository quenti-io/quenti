export const DescriptionEditorStyles = () => {
  return (
    <style jsx global>{`
      .tiptap > * + * {
        margin-top: 0.25em;
      }

      .tiptap p.is-editor-empty:first-child::before {
        color: #718096;
        content: attr(data-placeholder);
        float: left;
        height: 0;
        pointer-events: none;
      }

      .tiptap ul,
      ol {
        margin-left: 8px;
        list-style: inherit;
        padding: 0 1rem;
      }

      .tiptap li:not(:first-child),
      .tiptap li > p:not(:first-child) {
        margin-top: 0.25em;
      }

      .tiptap li > ul,
      li > ol {
        margin-top: 0.25em;
      }

      .tiptap ul,
      ol li > p {
        margin-left: 4px;
      }

      .tiptap ol {
        list-style-type: decimal;
      }

      .tiptap a {
        color: #7ea6ff;
        text-decoration: underline;
        cursor: pointer;
      }

      .tiptap blockquote {
        padding-left: 1rem;
        border-left: 2px solid rgba(#0d0d0d, 0.1);
      }

      .tiptap hr {
        border: none;
        border-top: 2px solid rgba(#0d0d0d, 0.1);
        margin: 2rem 0;
      }
    `}</style>
  );
};
