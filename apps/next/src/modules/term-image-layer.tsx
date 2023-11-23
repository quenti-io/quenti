import dynamic from "next/dynamic";
import React from "react";

import { api } from "@quenti/trpc";

import { editorEventChannel } from "../events/editor";
import { useSet } from "../hooks/use-set";

const SearchImagesModal = dynamic(
  () =>
    import("../components/search-images-modal").then(
      (mod) => mod.SearchImagesModal,
    ),
  {
    ssr: false,
  },
);

export const TermImageLayer = () => {
  const { id } = useSet();

  const [modalOpen, setModalOpen] = React.useState(false);

  const apiSetImage = api.terms.setImage.useMutation();

  const apiUploadImage = api.terms.uploadImage.useMutation({
    onSuccess: (jwt) => {
      editorEventChannel.emit("startUpload", jwt);
    },
  });
  const apiUploadImageComplete = api.terms.uploadImageComplete.useMutation({
    onSuccess: (data, { termId }) => {
      if (!data?.url) return;
      editorEventChannel.emit("propagateImageUrl", {
        id: termId,
        url: data.url,
      });
    },
  });

  React.useEffect(() => {
    const open = () => setModalOpen(true);

    const getTermId = (contextId?: string) => {
      if (!contextId || !contextId.startsWith("term:")) return null;
      const id = contextId.replace("term:", "");
      return id;
    };

    const requestUploadUrl = (contextId?: string) => {
      const termId = getTermId(contextId);
      if (!termId) return;

      apiUploadImage.mutate({
        studySetId: id,
        termId,
      });
    };

    const complete = (contextId?: string) => {
      const termId = getTermId(contextId);
      if (!termId) return;

      apiUploadImageComplete.mutate({
        studySetId: id,
        termId,
      });
    };

    const setImage = (args: {
      contextId?: string;
      optimisticUrl: string;
      query?: string;
      index?: number;
    }) => {
      const termId = getTermId(args.contextId);
      if (!termId) return;

      editorEventChannel.emit("propagateImageUrl", {
        id: termId,
        url: args.optimisticUrl,
      });

      if (args.query !== undefined && args.index !== undefined) {
        apiSetImage.mutate({
          studySetId: id,
          id: termId,
          query: args.query,
          index: args.index,
        });
      }
    };

    editorEventChannel.on("openSearchImages", open);
    editorEventChannel.on("imageSelected", setImage);
    editorEventChannel.on("requestUploadUrl", requestUploadUrl);
    editorEventChannel.on("uploadComplete", complete);
    return () => {
      editorEventChannel.off("openSearchImages", open);
      editorEventChannel.off("imageSelected", setImage);
      editorEventChannel.off("requestUploadUrl", requestUploadUrl);
      editorEventChannel.off("uploadComplete", complete);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SearchImagesModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
  );
};
