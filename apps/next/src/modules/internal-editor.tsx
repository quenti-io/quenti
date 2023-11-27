import { HeadSeo } from "@quenti/components/head-seo";

import { useSetEditorContext } from "../stores/use-set-editor-store";
import { EditorListener } from "./editor-listener";
import { HydrateEditSetData } from "./hydrate-edit-set-data";
import { SetEditorPure } from "./set-editor";

export const InternalEditor = () => {
  return (
    <HydrateEditSetData>
      <EditorWrapper />
    </HydrateEditSetData>
  );
};

const EditorWrapper = () => {
  const title = useSetEditorContext((s) => s.title);

  return (
    <>
      <HeadSeo
        title={`Edit ${title}`}
        nextSeoProps={{
          noindex: true,
          nofollow: true,
        }}
      />
      <EditorListener />
      <SetEditorPure />
    </>
  );
};
