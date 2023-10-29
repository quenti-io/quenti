import debounce from "lodash.debounce";
import React from "react";
import { shallow } from "zustand/shallow";

import { richTextToHtml } from "@quenti/lib/editor";
import { api } from "@quenti/trpc";

import {
  SetEditorStoreContext,
  useSetEditorContext,
} from "../stores/use-set-editor-store";
import { HydrateAutoSaveData } from "./hydrate-auto-save-data";
import { SetEditorPure } from "./set-editor";

export const InternalCreate = () => {
  return (
    <HydrateAutoSaveData>
      <EditorWrapper />
    </HydrateAutoSaveData>
  );
};

const EditorWrapper = () => {
  return (
    <>
      <PropertiesListener />
      <SetEditorPure />
    </>
  );
};

const PropertiesListener = () => {
  const store = React.useContext(SetEditorStoreContext)!;
  const setIsSaving = useSetEditorContext((s) => s.setIsSaving);
  const setSavedAt = useSetEditorContext((s) => s.setSavedAt);

  const autoSave = api.autoSave.save.useMutation({
    onSuccess(data) {
      setSavedAt(data.savedAt);
    },
  });

  const autoSaveHandler = async () => {
    const state = store.getState();

    await autoSave.mutateAsync({
      title: state.title,
      description: state.description,
      tags: state.tags,
      wordLanguage: state.wordLanguage,
      definitionLanguage: state.definitionLanguage,
      visibility: state.visibility,
      terms: state.terms
        .sort((a, b) => a.rank - b.rank)
        .map((x) => ({
          word: x.word,
          definition: x.definition,
          wordRichText: x.wordRichText
            ? richTextToHtml(x.wordRichText)
            : undefined,
          definitionRichText: x.definitionRichText
            ? richTextToHtml(x.definitionRichText)
            : undefined,
        })),
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const autoSaveCallback = React.useCallback(
    debounce(autoSaveHandler, 100),
    [],
  );
  const wrappedCallback = () => {
    void (async () => {
      await autoSaveCallback();
    })();
  };

  React.useEffect(() => {
    store.subscribe(
      (s) => [
        s.title,
        s.description,
        s.tags,
        s.wordLanguage,
        s.definitionLanguage,
        s.visibility,
        s.terms,
      ],
      wrappedCallback,
      {
        equalityFn: shallow,
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    setIsSaving(autoSave.isLoading);
  }, [setIsSaving, autoSave.isLoading]);

  return <></>;
};
