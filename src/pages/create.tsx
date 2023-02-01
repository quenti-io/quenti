import { Container } from "@chakra-ui/react";
import debounce from "lodash.debounce";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { HydrateAutoSaveData } from "../modules/hydrate-auto-save-data";
import { SetEditor } from "../modules/set-editor";
import {
  SetEditorContext,
  useSetEditorContext,
} from "../stores/use-set-editor-store";
import { api } from "../utils/api";

const Create: NextPage = () => {
  return (
    <HydrateAutoSaveData>
      <Container maxW="7xl" marginTop="10" marginBottom="20">
        <EditorWrapper />
      </Container>
    </HydrateAutoSaveData>
  );
};

const EditorWrapper = () => {
  const router = useRouter();
  const { data } = api.autoSave.get.useQuery();

  const store = React.useContext(SetEditorContext)!;
  const title = useSetEditorContext((s) => s.title);
  const description = useSetEditorContext((s) => s.description);
  const terms = useSetEditorContext((s) => s.terms);
  const setTitle = useSetEditorContext((s) => s.setTitle);
  const setDescription = useSetEditorContext((s) => s.setDescription);
  const addTerm = useSetEditorContext((s) => s.addTerm);
  const bulkAddTerms = useSetEditorContext((s) => s.bulkAddTerms);
  const deleteTerm = useSetEditorContext((s) => s.deleteTerm);
  const editTerm = useSetEditorContext((s) => s.editTerm);
  const reorderTerm = useSetEditorContext((s) => s.reorderTerm);
  const flipTerms = useSetEditorContext((s) => s.flipTerms);

  const [lastSavedAt, setLastSavedAt] = React.useState(data?.savedAt);

  const autoSave = api.autoSave.save.useMutation({
    onSuccess(data) {
      setLastSavedAt(data.savedAt);
    },
  });

  const create = api.studySets.createFromAutosave.useMutation({
    onSuccess: async (data) => {
      await router.push(`/${data.id}`);
    },
  });

  const autoSaveHandler = async () => {
    const state = store.getState();

    await autoSave.mutateAsync({
      title: state.title,
      description: state.description,
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
    debounce(autoSaveHandler, 1000),
    []
  );
  const wrappedCallback = () => {
    void (async () => {
      await autoSaveCallback();
    })();
  };

  store.subscribe((s) => [s.title, s.description, s.terms], wrappedCallback);

  return (
    <SetEditor
      mode="create"
      title={title}
      description={description}
      isSaving={autoSave.isLoading}
      isLoading={create.isLoading}
      numTerms={terms.length}
      terms={terms}
      setTitle={setTitle}
      setDescription={setDescription}
      onBulkImportTerms={bulkAddTerms}
      addTerm={addTerm}
      deleteTerm={deleteTerm}
      editTerm={editTerm}
      reorderTerm={reorderTerm}
      onFlipTerms={flipTerms}
      onComplete={create.mutateAsync}
    />
  );
};

export { getServerSideProps } from "../components/chakra";

export default Create;
