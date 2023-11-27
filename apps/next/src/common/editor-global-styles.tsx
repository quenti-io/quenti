import { Highlight } from "@quenti/lib/editor";

export const EditorGlobalStyles: React.FC<{ small?: boolean }> = ({
  small = false,
}) => {
  return (
    <style jsx global>{`
      mark {
        background-color: ${Highlight.Yellow};
        border-radius: 0.25em;
        box-decoration-break: clone;
        padding: ${small ? 0 : 0.125}rem 0;
        color: inherit;
      }
    `}</style>
  );
};
