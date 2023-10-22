import debounce from "lodash.debounce";
import React from "react";
import { shallow } from "zustand/shallow";

import { HeadSeo } from "@quenti/components";
import { api } from "@quenti/trpc";

import { Container } from "@chakra-ui/react";

import { LazyWrapper } from "../common/lazy-wrapper";
import { PageWrapper } from "../common/page-wrapper";
import { AuthedPage } from "../components/authed-page";
import { WithFooter } from "../components/with-footer";
import { getLayout } from "../layouts/main-layout";
import { HydrateAutoSaveData } from "../modules/hydrate-auto-save-data";
import { SetEditor } from "../modules/set-editor";
import {
  SetEditorStoreContext,
  useSetEditorContext,
} from "../stores/use-set-editor-store";

const Create = () => {
  return (
    <AuthedPage>
      <HeadSeo title="Create a new set" />
      <LazyWrapper>
        <WithFooter>
          <Container maxW="7xl">
            <HydrateAutoSaveData>
              <EditorWrapper />
            </HydrateAutoSaveData>
          </Container>
        </WithFooter>
      </LazyWrapper>
    </AuthedPage>
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

Create.PageWrapper = PageWrapper;
Create.getLayout = getLayout;

export default Create;
