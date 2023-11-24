import { EditorListener } from "./editor-listener";
import { HydrateCreateData } from "./hydrate-create-data";
import { SetEditorPure } from "./set-editor";

export const InternalCreate = () => {
  return (
    <HydrateCreateData>
      <EditorListener />
      <SetEditorPure />
    </HydrateCreateData>
  );
};
