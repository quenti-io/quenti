import { Container } from "@chakra-ui/react";
import debounce from "lodash.debounce";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { HydrateEditSetData } from "../../modules/hydrate-edit-set-data";
import { SetEditor } from "../../modules/set-editor";
import {
  SetEditorContext,
  useSetEditorContext,
} from "../../stores/use-set-editor-store";
import { api } from "../../utils/api";

const Edit: NextPage = () => {
  return (
    <HydrateEditSetData>
      <Container maxW="7xl" marginTop="10" marginBottom="20">
        <EditorWrapper />
      </Container>
    </HydrateEditSetData>
  );
};

const EditorWrapper = () => {
  const router = useRouter();
  const id = router.query.id as string;

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

  const editSet = api.studySets.edit.useMutation();

  const propertiesSaveHandler = async () => {
    const state = store.getState();

    await editSet.mutateAsync({
      id,
      title: state.title,
      description: state.description,
    });
  };

  const propertiesSaveCallback = React.useCallback(
    debounce(propertiesSaveHandler, 1000),
    []
  );
  const wrappedCallback = () => {
    void (async () => {
      await propertiesSaveCallback();
    })();
  };

  store.subscribe((s) => [s.title, s.description], wrappedCallback);

  return (
    <SetEditor
      mode="edit"
      title={title}
      description={description}
      isSaving={editSet.isLoading}
      isLoading={false}
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
      onComplete={async () => {
        await router.push(`/${id}`);
      }}
    />
  );
};

export default Edit;

export { getServerSideProps } from "../../components/chakra";
