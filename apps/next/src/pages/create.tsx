import { Container } from "@chakra-ui/react";
import { api } from "@quenti/trpc";
import debounce from "lodash.debounce";
import React from "react";
import { shallow } from "zustand/shallow";
import type { ComponentWithAuth } from "../components/auth-component";
import { WithFooter } from "../components/with-footer";
import { HydrateAutoSaveData } from "../modules/hydrate-auto-save-data";
import { SetEditor } from "../modules/set-editor";
import {
  SetEditorStoreContext,
  useSetEditorContext,
} from "../stores/use-set-editor-store";

const Create: ComponentWithAuth = () => {
  return (
    <HydrateAutoSaveData>
      <WithFooter>
        <Container maxW="7xl">
          <EditorWrapper />
        </Container>
      </WithFooter>
    </HydrateAutoSaveData>
  );
};

const EditorWrapper = () => {
  return (
    <>
      <PropertiesListener />
      <SetEditor />
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
        })),
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const autoSaveCallback = React.useCallback(
    debounce(autoSaveHandler, 100),
    []
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
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    setIsSaving(autoSave.isLoading);
  }, [setIsSaving, autoSave.isLoading]);

  return <></>;
};

Create.title = "Create a new set";
Create.authenticationEnabled = true;

export default Create;
