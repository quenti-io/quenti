import { useRouter } from "next/router";
import React from "react";

import { richTextToHtml } from "@quenti/lib/editor";
import { type RouterOutputs, api } from "@quenti/trpc";

import { editorEventChannel } from "../../events/editor";
import {
  type ClientTerm,
  type SetEditorStore,
  SetEditorStoreContext,
  createSetEditorStore,
} from "../../stores/use-set-editor-store";

export const EditorContextLayer: React.FC<
  React.PropsWithChildren<{
    data:
      | RouterOutputs["studySets"]["byId"]
      | RouterOutputs["studySets"]["getAutosave"];
    mode: "create" | "edit";
  }>
> = ({ data, mode, children }) => {
  const router = useRouter();
  const storeRef = React.useRef<SetEditorStore>();

  const [savedLocally, setSavedLocally] = React.useState(false);

  const apiCreate = api.studySets.create.useMutation({
    onSuccess: async (data) => {
      await router.push(`/${data.id}`);
    },
    onError: (e) => {
      const state = storeRef.current!.getState();

      state.setIsLoading(false);
      state.setSaveError(
        e.message || "An unknown error occurred. Please try again.",
      );
    },
  });
  const apiEditSet = api.studySets.edit.useMutation({
    onSuccess: () => {
      storeRef.current!.getState().setSaveError(undefined);
    },
    onError: (e) => {
      const state = storeRef.current!.getState();

      state.setIsLoading(false);
      state.setSaveError(
        e.message || "An unknown error occurred. Please try again.",
      );
    },
  });
  const apiAddTerm = api.terms.add.useMutation({
    onSuccess: (data) => {
      const state = storeRef.current!.getState();

      state.setServerTermId(
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
  const apiSetImage = api.terms.setImage.useMutation();
  const apiRemoveImage = api.terms.removeImage.useMutation();
  const apiReorderTerm = api.terms.reorder.useMutation();

  const apiUploadImage = api.terms.uploadImage.useMutation({
    onSuccess: (jwt) => {
      editorEventChannel.emit("startUpload", jwt);
    },
  });
  const apiUploadImageComplete = api.terms.uploadImageComplete.useMutation({
    onSuccess: (data, { termId }) => {
      if (!data?.url) return;
      const state = storeRef.current!.getState();
      state.setImage(termId, data.url);
    },
  });

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

  React.useEffect(() => {
    const getTermId = (contextId?: string) => {
      if (!contextId || !contextId.startsWith("term:")) return null;
      const id = contextId.replace("term:", "");

      const term = storeRef
        .current!.getState()
        .terms.find((x) => x.id === id || x.clientKey === id)!;

      return term.id;
    };

    const requestUploadUrl = (contextId?: string) => {
      const termId = getTermId(contextId);
      if (!termId) return;

      const setId = storeRef.current!.getState().id;
      apiUploadImage.mutate({
        studySetId: setId,
        termId,
      });
    };

    const complete = (contextId?: string) => {
      const termId = getTermId(contextId);
      if (!termId) return;

      const setId = storeRef.current!.getState().id;
      apiUploadImageComplete.mutate({
        studySetId: setId,
        termId,
      });
    };

    const setImage = (args: {
      contextId?: string;
      optimisticUrl: string;
      query?: string;
      index?: number;
    }) => {
      const id = getTermId(args.contextId);
      if (!id) return;

      storeRef.current!.getState().setImage(id, args.optimisticUrl);

      if (args.query !== undefined && args.index !== undefined) {
        apiSetImage.mutate({
          studySetId: data.id,
          id,
          query: args.query,
          index: args.index,
        });
      }
    };

    editorEventChannel.on("imageSelected", setImage);
    editorEventChannel.on("requestUploadUrl", requestUploadUrl);
    editorEventChannel.on("uploadComplete", complete);
    return () => {
      editorEventChannel.off("imageSelected", setImage);
      editorEventChannel.off("requestUploadUrl", requestUploadUrl);
      editorEventChannel.off("uploadComplete", complete);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!storeRef.current) {
    storeRef.current = createSetEditorStore(
      {
        ...data,
        terms: data.terms.map((x) => ({
          ...x,
          clientKey: x.id,
        })) as ClientTerm[],
        mode,
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
        editTerm: (
          termId,
          word,
          definition,
          wordRichText_,
          definitionRichText_,
        ) => {
          const state = storeRef.current!.getState();

          const { wordRichText, definitionRichText } = {
            wordRichText: wordRichText_
              ? richTextToHtml(wordRichText_)
              : undefined,
            definitionRichText: definitionRichText_
              ? richTextToHtml(definitionRichText_)
              : undefined,
          };

          if (state.serverTerms.includes(termId)) {
            apiEditTerm.mutate({
              id: termId,
              studySetId: data.id,
              word,
              definition,
              wordRichText,
              definitionRichText,
            });
          } else {
            apiAddTerm.mutate({
              studySetId: data.id,
              term: {
                word,
                definition,
                wordRichText,
                definitionRichText,
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
        removeImage: (id) => {
          apiRemoveImage.mutate({
            studySetId: data.id,
            id,
          });
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
                wordRichText: x.wordRichText
                  ? richTextToHtml(x.wordRichText)
                  : undefined,
                definitionRichText: x.definitionRichText
                  ? richTextToHtml(x.definitionRichText)
                  : undefined,
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
          const push = () => void router.push(`/${data.id}`);

          if (mode == "edit") push();
          else {
            storeRef.current!.getState().setIsLoading(true);
            apiCreate.mutate({ id: data.id });
          }
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
