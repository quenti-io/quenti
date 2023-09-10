import React from "react";

import { env } from "@quenti/env/client";
import { UploadAvatarModal as InnerModal } from "@quenti/images/react";
import { api } from "@quenti/trpc";

interface UploadAvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadAvatarModal: React.FC<UploadAvatarModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [buffer, setBuffer] = React.useState<ArrayBuffer | null>(null);

  const uploadComplete = api.user.uploadAvatarComplete.useMutation({
    onSuccess: () => {
      const event = new Event("visibilitychange");
      document.dispatchEvent(event);
      onClose();
    },
  });

  const uploadAvatar = api.user.uploadAvatar.useMutation({
    onSuccess: async (jwt) => {
      if (!buffer || !env.NEXT_PUBLIC_CDN_WORKER_ENDPOINT) return;

      const result = await fetch(env.NEXT_PUBLIC_CDN_WORKER_ENDPOINT, {
        method: "PUT",
        body: buffer,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (result.ok) {
        await uploadComplete.mutateAsync();
      }
    },
  });

  return (
    <InnerModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmitBuffer={(buffer) => {
        setBuffer(buffer);
        uploadAvatar.mutate();
      }}
      isLoading={uploadAvatar.isLoading || uploadComplete.isLoading}
    />
  );
};
