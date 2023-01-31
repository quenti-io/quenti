import { Container } from "@chakra-ui/react";
import debounce from "lodash.debounce";
import type { NextPage } from "next";
import React from "react";
import shallow from "zustand/shallow";
import { HydrateAutoSaveData } from "../modules/hydrate-auto-save-data";
import { SetEditor } from "../modules/set-editor";
import {
  CreateSetContext,
  useCreateSetContext,
} from "../stores/use-create-set-store";
import { api } from "../utils/api";

const Create: NextPage = () => {
  return (
    <HydrateAutoSaveData>
      <Container maxW="7xl" marginTop="10">
        <EditorWrapper />
      </Container>
    </HydrateAutoSaveData>
  );
};

const EditorWrapper = () => {
  const { data } = api.autoSave.get.useQuery();

  const store = React.useContext(CreateSetContext)!;
  const title = useCreateSetContext((s) => s.title);
  const description = useCreateSetContext((s) => s.description);
  const terms = useCreateSetContext((s) => s.autoSaveTerms);
  const setTitle = useCreateSetContext((s) => s.setTitle);
  const setDescription = useCreateSetContext((s) => s.setDescription);
  const addTerm = useCreateSetContext((s) => s.addTerm);
  const bulkAddTerms = useCreateSetContext((s) => s.bulkAddTerms);
  const deleteTerm = useCreateSetContext((s) => s.deleteTerm);
  const editTerm = useCreateSetContext((s) => s.editTerm);
  const reorderTerm = useCreateSetContext((s) => s.reorderTerm);
  const flipTerms = useCreateSetContext((s) => s.flipTerms);

  const [lastSavedAt, setLastSavedAt] = React.useState(data?.savedAt);

  const autoSave = api.autoSave.save.useMutation({
    onSuccess(data) {
      setLastSavedAt(data.savedAt);
    },
  });

  const autoSaveHandler = async () => {
    const state = store.getState();

    await autoSave.mutateAsync({
      title: state.title,
      description: state.description,
      terms: state.autoSaveTerms
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

  store.subscribe(
    (s) => [s.title, s.description, s.autoSaveTerms],
    wrappedCallback,
    { equalityFn: shallow }
  );

  return (
    <SetEditor
      title={title}
      description={description}
      isSaving={autoSave.isLoading}
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
    />
  );
};

export { getServerSideProps } from "../components/chakra";

export default Create;
