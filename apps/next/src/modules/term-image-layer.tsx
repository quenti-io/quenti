import dynamic from "next/dynamic";
import React from "react";

import { api } from "@quenti/trpc";

import { type Context, editorEventChannel } from "../events/editor";

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

    const requestUploadUrl = (context: Context) =>
      apiUploadImage.mutate(context);

    const complete = (context: Context) =>
      apiUploadImageComplete.mutate(context);

    const setImage = (args: {
      context: Context;
      optimisticUrl: string;
      query?: string;
      index?: number;
    }) => {
      editorEventChannel.emit("propagateImageUrl", {
        id: args.context.termId,
        url: args.optimisticUrl,
      });

      if (args.query !== undefined && args.index !== undefined) {
        apiSetImage.mutate({
          studySetId: args.context.studySetId,
          id: args.context.termId,
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
