import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

import { type RouterOutputs, api } from "@quenti/trpc";

import { useLoading } from "../hooks/use-loading";
import {
  type SetEditorStore,
  SetEditorStoreContext,
  createSetEditorStore,
} from "../stores/use-set-editor-store";
import { EditorLoading } from "./editor/editor-loading";

export const HydrateEditSetData: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const router = useRouter();
  const session = useSession();
  const id = router.query.id as string;
  const { loading } = useLoading();

  const { data } = api.studySets.byId.useQuery(
    { studySetId: id },
    {
      enabled: !!id,
      staleTime: 0,
      cacheTime: 0,
      onError: (e) => {
        if (e.data?.httpStatus == 403) {
          void (async () => {
            await router.push("/[id]", `/${id}`);
          })();
        }
      },
      onSuccess: (data) => {
        if (data.userId !== session.data?.user?.id) {
          void (async () => {
            await router.push("/[id]", `/${id}`);
          })();
        }
      },
    },
  );

  if (loading || !data || data.userId !== session.data?.user?.id)
    return <EditorLoading mode="edit" />;

  return <ContextLayer data={data}>{children}</ContextLayer>;
};

const ContextLayer: React.FC<
  React.PropsWithChildren<{
    data: RouterOutputs["studySets"]["byId"];
  }>
> = ({ data, children }) => {
  const router = useRouter();
  const storeRef = React.useRef<SetEditorStore>();

  const [savedLocally, setSavedLocally] = React.useState(false);

  const apiEditSet = api.studySets.edit.useMutation();
  const apiAddTerm = api.terms.add.useMutation({
    onSuccess: (data) => {
      const state = storeRef.current!.getState();

      state.changeTermId(
        state.terms.find((x) => !state.serverTerms.includes(x.id))!.id,
        data.id,
      );
      state.addServerTerms([data.id]);
    },
  });
  const apiBulkAddTerms = api.terms.bulkAdd.useMutation({
    onSuccess: (data) => {
      const state = storeRef.current!.getState();
      state.addServerTerms(data.map((x) => x.id));
    },
  });
  const apiDeleteTerm = api.terms.delete.useMutation({
    onSuccess: (data) => {
      const state = storeRef.current!.getState();
      state.removeServerTerm(data.deleted);
    },
  });
  const apiEditTerm = api.terms.edit.useMutation();
  const apiBulkEdit = api.terms.bulkEdit.useMutation();
  const apiReorderTerm = api.terms.reorder.useMutation();

  const isSaving =
    apiEditSet.isLoading ||
    apiAddTerm.isLoading ||
    apiBulkAddTerms.isLoading ||
    apiDeleteTerm.isLoading ||
    apiEditTerm.isLoading ||
    apiBulkEdit.isLoading ||
    apiReorderTerm.isLoading;

  React.useEffect(() => {
    const state = storeRef.current!.getState();
    state.setIsSaving(isSaving);
    if (isSaving) setSavedLocally(true);

    if (!isSaving && savedLocally) {
      state.setSavedAt(new Date());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSaving]);

  if (!storeRef.current) {
    storeRef.current = createSetEditorStore(
      {
        ...data,
        mode: "edit",
        serverTerms: data.terms.map((x) => x.id),
      },
      {
        bulkAddTerms: (terms) => {
          void (async () => {
            await apiBulkAddTerms.mutateAsync({
              studySetId: data.id,
              terms,
            });
          })();
        },
        deleteTerm: (termId) => {
          const state = storeRef.current!.getState();

          if (state.serverTerms.includes(termId))
            apiDeleteTerm.mutate({ termId, studySetId: data.id });
        },
        editTerm: (termId, word, definition) => {
          const state = storeRef.current!.getState();

          if (state.serverTerms.includes(termId)) {
            apiEditTerm.mutate({
              id: termId,
              studySetId: data.id,
              word,
              definition,
            });
          } else {
            apiAddTerm.mutate({
              studySetId: data.id,
              term: {
                word,
                definition,
                rank: state.terms
                  .filter(
                    (x) => state.serverTerms.includes(x.id) || x.id === termId,
                  )
                  .sort((a, b) => a.rank - b.rank)
                  .findIndex((x) => x.id === termId),
              },
            });
          }
        },
        reorderTerm: (termId, rank) => {
          void (async () => {
            const state = storeRef.current!.getState();

            if (state.serverTerms.includes(termId)) {
              await apiReorderTerm.mutateAsync({
                studySetId: data.id,
                term: {
                  id: termId,
                  rank,
                },
              });
            } else {
              const term = state.terms.find((x) => x.id === termId)!;

              await apiAddTerm.mutateAsync({
                studySetId: data.id,
                term: {
                  word: term.word,
                  definition: term.definition,
                  rank,
                },
              });
            }
          })();
        },
        flipTerms: () => {
          void (async () => {
            const state = storeRef.current!.getState();

            await apiBulkEdit.mutateAsync({
              studySetId: data.id,
              terms: state.terms.map((x) => ({
                id: x.id,
                word: x.word,
                definition: x.definition,
              })),
            });
          })();
        },
        onSubscribeDelegate: () => {
          void (async () => {
            const state = storeRef.current!.getState();

            await apiEditSet.mutateAsync({
              id: data.id,
              title: state.title,
              description: state.description,
              tags: state.tags,
              wordLanguage: state.wordLanguage,
              definitionLanguage: state.definitionLanguage,
              visibility: state.visibility,
            });
          })();
        },
        onComplete: () => {
          void (async () => {
            await router.push(`/${data.id}`);
          })();
        },
      },
    );
  }

  return (
    <SetEditorStoreContext.Provider value={storeRef.current}>
      {children}
    </SetEditorStoreContext.Provider>
  );
};
