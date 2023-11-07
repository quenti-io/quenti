import { Highlight } from "@quenti/lib/editor";

export const EditorGlobalStyles = () => {
  return (
    <style jsx global>{`
      mark {
        background-color: ${Highlight.Yellow};
        border-radius: 0.25em;
        box-decoration-break: clone;
        padding: 0.125rem 0;
        color: inherit;
      }
    `}</style>
  );
};
