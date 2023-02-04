import { Container } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { shallow } from "zustand/shallow";
import { HydrateEditSetData } from "../../../modules/hydrate-edit-set-data";
import { SetEditor } from "../../../modules/set-editor";
import {
  SetEditorContext,
  useSetEditorContext,
} from "../../../stores/use-set-editor-store";
import { api } from "../../../utils/api";

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
  const tags = useSetEditorContext((s) => s.tags);
  const visibility = useSetEditorContext((s) => s.visibility);
  const terms = useSetEditorContext((s) => s.terms);
  const setTitle = useSetEditorContext((s) => s.setTitle);
  const setDescription = useSetEditorContext((s) => s.setDescription);
  const setTags = useSetEditorContext((s) => s.setTags);
  const setVisibility = useSetEditorContext((s) => s.setVisibility);
  const addTerm = useSetEditorContext((s) => s.addTerm);
  const bulkAddTerms = useSetEditorContext((s) => s.bulkAddTerms);
  const deleteTerm = useSetEditorContext((s) => s.deleteTerm);
  const editTerm = useSetEditorContext((s) => s.editTerm);
  const changeTermId = useSetEditorContext((s) => s.changeTermId);
  const reorderTerm = useSetEditorContext((s) => s.reorderTerm);
  const flipTerms = useSetEditorContext((s) => s.flipTerms);

  const [serverTerms, setServerTerms] = React.useState(terms.map((x) => x.id));

  const apiEditSet = api.studySets.edit.useMutation();
  const apiAddTerm = api.terms.add.useMutation({
    onSuccess: (data) => {
      setServerTerms((serverTerms) => {
        changeTermId(
          terms.filter((x) => !serverTerms.includes(x.id))[0]!.id,
          data.id
        );
        return [...serverTerms, data.id];
      });
    },
  });
  const apiBulkAddTerms = api.terms.bulkAdd.useMutation({
    onSuccess: (data) => {
      bulkAddTerms(data);
      setServerTerms((s) => [...s, ...data.map((x) => x.id)]);
    },
  });
  const apiDeleteTerm = api.terms.delete.useMutation({
    onSuccess: (data) => {
      setServerTerms((serverTerms) =>
        serverTerms.filter((x) => x !== data.deleted)
      );
    },
  });
  const apiEditTerm = api.terms.edit.useMutation();
  const apiBulkEdit = api.terms.bulkEdit.useMutation();
  const apiReorderTerm = api.terms.reorder.useMutation();

  const propertiesSaveHandler = () => {
    void (async () => {
      const state = store.getState();

      await apiEditSet.mutateAsync({
        id,
        title: state.title,
        description: state.description,
        tags: state.tags,
        visibility: state.visibility,
      });
    })();
  };

  store.subscribe(
    (s) => [s.title, s.description, s.tags, s.visibility],
    propertiesSaveHandler,
    {
      equalityFn: shallow,
    }
  );

  const anySaving =
    apiEditSet.isLoading ||
    apiAddTerm.isLoading ||
    apiBulkAddTerms.isLoading ||
    apiEditTerm.isLoading ||
    apiBulkEdit.isLoading ||
    apiDeleteTerm.isLoading ||
    apiReorderTerm.isLoading;

  return (
    <SetEditor
      mode="edit"
      title={title}
      description={description}
      tags={tags}
      visibility={visibility}
      isSaving={anySaving}
      isLoading={false}
      numTerms={serverTerms.length}
      terms={terms.sort((a, b) => a.rank - b.rank)}
      setTitle={setTitle}
      setDescription={setDescription}
      setTags={setTags}
      setVisibility={setVisibility}
      onBulkImportTerms={(terms) => {
        void (async () => {
          await apiBulkAddTerms.mutateAsync({
            studySetId: id,
            terms,
          });
        })();
      }}
      addTerm={() => {
        addTerm();
      }}
      deleteTerm={(termId) => {
        deleteTerm(termId);
        if (serverTerms.includes(termId))
          apiDeleteTerm.mutate({ termId, studySetId: id });
      }}
      editTerm={(termId, word, definition) => {
        editTerm(termId, word, definition);

        if (serverTerms.includes(termId)) {
          apiEditTerm.mutate({
            id: termId,
            studySetId: id,
            word,
            definition,
          });
        } else {
          apiAddTerm.mutate({
            studySetId: id,
            term: {
              word,
              definition,
              rank: terms.find((x) => x.id === termId)!.rank,
            },
          });
        }
      }}
      reorderTerm={(termId, rank) => {
        reorderTerm(termId, rank);

        void (async () =>
          apiReorderTerm.mutateAsync({
            studySetId: id,
            term: {
              id: termId,
              rank,
            },
          }))();
      }}
      onFlipTerms={() => {
        flipTerms();

        void (async () => {
          const state = store.getState();

          await apiBulkEdit.mutateAsync({
            studySetId: id,
            terms: state.terms.map((x) => ({
              id: x.id,
              word: x.word,
              definition: x.definition,
            })),
          });
        })();
      }}
      onComplete={async () => {
        await router.push(`/${id}`);
      }}
    />
  );
};

export default Edit;

export { getServerSideProps } from "../../../components/chakra";
