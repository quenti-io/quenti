import { useSession } from "next-auth/react";
import React from "react";

import { env } from "@quenti/env/client";
import { UploadAvatarModal as InnerModal } from "@quenti/images/react";
import { api } from "@quenti/trpc";

import { useToast } from "@chakra-ui/react";

import { AnimatedXCircle } from "../../components/animated-icons/x";
import { Toast } from "../../components/toast";

interface UploadAvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadAvatarModal: React.FC<UploadAvatarModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { update } = useSession();
  const toast = useToast();

  const [buffer, setBuffer] = React.useState<ArrayBuffer | null>(null);

  const uploadComplete = api.user.uploadAvatarComplete.useMutation({
    onSuccess: async () => {
      await update();
      onClose();
    },
  });

  const uploadAvatar = api.user.uploadAvatar.useMutation({
    onSuccess: async (jwt) => {
      if (!buffer || !env.NEXT_PUBLIC_CDN_WORKER_ENDPOINT) return;

      const result = await fetch(
        `${env.NEXT_PUBLIC_CDN_WORKER_ENDPOINT}/avatar`,
        {
          method: "PUT",
          body: buffer,
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      );

      if (result.ok) {
        await uploadComplete.mutateAsync();
      }
    },
  });

  return (
    <InnerModal
      isOpen={isOpen}
      onClose={onClose}
      onError={(error) => {
        toast({
          title: error,
          status: "error",
          colorScheme: "red",
          icon: <AnimatedXCircle />,
          render: Toast,
        });
      }}
      onSubmitBuffer={(buffer) => {
        setBuffer(buffer);
        uploadAvatar.mutate();
      }}
      isLoading={uploadAvatar.isLoading || uploadComplete.isLoading}
    />
  );
};
