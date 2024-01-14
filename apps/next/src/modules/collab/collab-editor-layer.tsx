import React from "react";

import type { Language } from "@quenti/core";
import { richTextToHtml } from "@quenti/lib/editor";
import { type RouterOutputs, api } from "@quenti/trpc";

import { type Context, editorEventChannel } from "../../events/editor";
import {
  type ClientTerm,
  type SetEditorStore,
  SetEditorStoreContext,
  createSetEditorStore,
} from "../../stores/use-set-editor-store";

export const CollabEditorLayer: React.FC<
  React.PropsWithChildren<{
    data: RouterOutputs["collab"]["get"];
  }>
> = ({ data, children }) => {
  const storeRef = React.useRef<SetEditorStore>();

  const submission = data.submission;

  const [savedLocally, setSavedLocally] = React.useState(false);

  const apiAddTerm = api.collab.addTerm.useMutation({
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
  const apiDeleteTerm = api.collab.deleteTerm.useMutation({
    onSuccess: (data) => {
      const state = storeRef.current!.getState();
      state.removeServerTerms([data.deleted]);
    },
  });
  const apiEditTerm = api.collab.editTerm.useMutation();
  const apiSetImage = api.collab.setTermImage.useMutation();
  const apiRemoveImage = api.collab.removeTermImage.useMutation();
  const apiReorderTerm = api.collab.reorderTerm.useMutation();

  const apiUploadImage = api.collab.uploadTermImage.useMutation({
    onSuccess: (jwt) => {
      editorEventChannel.emit("startUpload", jwt);
    },
  });
  const apiUploadImageComplete = api.collab.uploadTermImageComplete.useMutation(
    {
      onSuccess: (data, { termId }) => {
        if (!data?.url) return;
        const state = storeRef.current!.getState();
        state.setImage(termId, data.url);
      },
    },
  );

  const isSaving =
    apiAddTerm.isLoading ||
    apiDeleteTerm.isLoading ||
    apiEditTerm.isLoading ||
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
      return { termId: term.id, submissionId: submission.id };
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
          submissionId: submission.id,
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

  const isLocked = !!(
    data.assignment?.lockedAt && data.assignment.lockedAt <= new Date()
  );

  if (!storeRef.current) {
    storeRef.current = createSetEditorStore(
      {
        ...submission,
        id: data.id,
        title: data.title,
        wordLanguage: data.wordLanguage as Language,
        definitionLanguage: data.definitionLanguage as Language,
        description: data.description,
        readonly: !!submission.submittedAt || isLocked,
        terms: submission.terms.map((x) => ({
          ...x,
          clientKey: x.id,
        })) as ClientTerm[],
        mode: "edit",
        serverTerms: submission.terms.map((x) => x.id),
        collab: {
          minTerms: data.collab!.minTermsPerUser || 4,
          maxTerms: data.collab!.maxTermsPerUser || 7,
        },
      },
      {
        deleteTerm: (termId) => {
          const state = storeRef.current!.getState();

          if (state.serverTerms.includes(termId))
            apiDeleteTerm.mutate({
              termId,
              submissionId: submission.id,
            });
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
              submissionId: submission.id,
              word,
              definition,
              wordRichText,
              definitionRichText,
            });
          } else {
            apiAddTerm.mutate({
              submissionId: submission.id,
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
            submissionId: submission.id,
            id,
          });
        },
        reorderTerm: (id, rank) => {
          void (async () => {
            const state = storeRef.current!.getState();
            const term = state.terms.find((x) => x.id === id)!;
            if (state.serverTerms.includes(term.id)) {
              await apiReorderTerm.mutateAsync({
                submissionId: submission.id,
                term: {
                  id,
                  rank,
                },
              });
            } else {
              await apiAddTerm.mutateAsync({
                submissionId: submission.id,
                term: {
                  word: term.word,
                  definition: term.definition,
                  rank,
                },
              });
            }
          })();
        },
      },
    );
  }

  React.useEffect(() => {
    if (!data.collab || !storeRef.current) return;

    storeRef.current.setState((s) => ({
      ...s,
      collab: {
        minTerms: data.collab!.minTermsPerUser || 4,
        maxTerms: data.collab!.maxTermsPerUser || 7,
      },
    }));
  }, [data.collab]);

  return (
    <SetEditorStoreContext.Provider value={storeRef.current}>
      {children}
    </SetEditorStoreContext.Provider>
  );
};
