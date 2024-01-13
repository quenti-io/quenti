/**
 * Modified from:
 * https://github.com/ueberdosis/tiptap/blob/731109b5667afdc6142de20a37c6f0b19ca6212f/packages/react/src/useEditor.ts
 */
import type { EditorOptions } from "@tiptap/core";
import { Editor } from "@tiptap/react";
import { type DependencyList, useEffect, useState } from "react";

function useForceUpdate() {
  const [, setValue] = useState(0);

  return () => setValue((value) => value + 1);
}

export const useReadonlyEditor = (
  options: Partial<EditorOptions> = {},
  deps: DependencyList = [],
) => {
  const [editor, setEditor] = useState<Editor>(() => new Editor(options));
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    let isMounted = true;
    const instance = new Editor(options);

    setEditor(instance);

    instance.on("transaction", () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (isMounted) {
            forceUpdate();
          }
        });
      });
    });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return editor;
};
