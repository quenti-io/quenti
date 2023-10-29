import React from "react";
import { shallow } from "zustand/shallow";

import { HeadSeo } from "@quenti/components";

import {
  SetEditorStoreContext,
  useSetEditorContext,
} from "../stores/use-set-editor-store";
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
      <PropertiesListener />
      <SetEditorPure />
    </>
  );
};

const PropertiesListener = () => {
  const store = React.useContext(SetEditorStoreContext)!;

  const propertiesSaveHandler = React.useCallback(() => {
    store.getState().onSubscribeDelegate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    store.subscribe(
      (s) => [
        s.title,
        s.description,
        s.tags,
        s.wordLanguage,
        s.definitionLanguage,
        s.visibility,
      ],
      propertiesSaveHandler,
      {
        equalityFn: shallow,
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
};
