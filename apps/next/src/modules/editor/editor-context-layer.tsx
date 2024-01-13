import { useRouter } from "next/router";
import React from "react";

import { richTextToHtml } from "@quenti/lib/editor";
import { type RouterOutputs, api } from "@quenti/trpc";

import { type Context, editorEventChannel } from "../../events/editor";
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

  const apiSetClassesWithAccess = api.studySets.setAllowedClasses.useMutation();

  const apiAddTerm = api.terms.add.useMutation({
    onSuccess: (data, { term: termInput }) => {
      const state = storeRef.current!.getState();

      state.setServerTermId(
        state.terms.find((x) => x.rank === termInput.rank)!.clientKey,
        data.created.id,
      );
      state.addServerTerms(
        [data.created.id].concat(data.merges.map((x) => x.id)),
      );

      if (data.merges.length) {
        storeRef.current!.setState((state) => {
          const terms = state.terms;

          for (const merge of data.merges) {
            const term = terms.find((x) => x.rank === merge.rank);
            if (term) {
              term.id = merge.id;
            }
          }

          return { terms };
        });
      }
    },
  });
  const apiBulkAddTerms = api.terms.bulkAdd.useMutation({
    onSuccess: (data) => {
      const state = storeRef.current!.getState();
      state.addServerTerms(data.map((x) => x.id));
    },
  });
  const apiBulkDeleteTerms = api.terms.bulkDelete.useMutation({
    onSuccess: (_, { terms }) => {
      const state = storeRef.current!.getState();
      state.removeServerTerms(terms);
    },
  });
  const apiDeleteTerm = api.terms.delete.useMutation({
    onSuccess: (data) => {
      const state = storeRef.current!.getState();
      state.removeServerTerms([data.deleted]);
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
    apiSetClassesWithAccess.isLoading ||
    apiAddTerm.isLoading ||
    apiBulkAddTerms.isLoading ||
    apiBulkDeleteTerms.isLoading ||
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
      state.setSaveError(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSaving]);

  React.useEffect(() => {
    // Needed because IDs may be innacurate at the time the modal is opened
    const transform = (c: Context) => {
      const term = storeRef
        .current!.getState()
        .terms.find((x) => x.id === c.termId || x.clientKey === c.termId)!;

      return { termId: term.id, studySetId: c.studySetId };
    };

    const requestUploadUrl = (context: Context) =>
      apiUploadImage.mutate(transform(context));

    const complete = (context: Context) =>
      apiUploadImageComplete.mutate(transform(context));

    const setImage = (args: {
      context: Context;
      optimisticUrl: string;
      query?: string;
      index?: number;
    }) => {
      const context = transform(args.context);

      storeRef.current!.getState().setImage(context.termId, args.optimisticUrl);

      if (args.query !== undefined && args.index !== undefined) {
        apiSetImage.mutate({
          studySetId: context.studySetId,
          id: context.termId,
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
        collab: undefined,
      },
      {
        setClassesWithAccess: (classes) => {
          apiSetClassesWithAccess.mutate({
            studySetId: data.id,
            classIds: classes,
          });
        },
        bulkAddTerms: (terms, deleted) => {
          void (async () => {
            if (!!deleted?.length) {
              await apiBulkDeleteTerms.mutateAsync({
                studySetId: data.id,
                terms: deleted,
              });
            }

            apiBulkAddTerms.mutate({
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
                rank: state.terms.find((x) => x.id == termId)!.rank,
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
        reorderTerm: (id, rank) => {
          void (async () => {
            const state = storeRef.current!.getState();

            const term = state.terms.find((x) => x.id === id)!;

            if (state.serverTerms.includes(term.id)) {
              await apiReorderTerm.mutateAsync({
                studySetId: data.id,
                term: {
                  id,
                  rank,
                },
              });
            } else {
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
