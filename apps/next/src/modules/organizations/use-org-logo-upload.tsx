import { env } from "@quenti/env/client";
import { dataUrlToBuffer } from "@quenti/images/react/utils";
import { useFileReader } from "@quenti/lib/hooks";
import { api } from "@quenti/trpc";

import { useToast } from "@chakra-ui/react";

import { AnimatedXCircle } from "../../components/animated-icons/x";
import { Toast } from "../../components/toast";

interface UseOrgLogoUploadOptions {
  onComplete?: (orgId: string) => void | Promise<void>;
}

interface FileEvent<T = Element> extends React.FormEvent<T> {
  target: EventTarget & T;
}

export const useOrgLogoUpload = ({ onComplete }: UseOrgLogoUploadOptions) => {
  const toast = useToast();

  const [{ result }, setFile] = useFileReader({
    method: "readAsDataURL",
  });

  const uploadComplete = api.organizations.uploadLogoComplete.useMutation({
    onSuccess: async (_, { orgId }) => {
      await onComplete?.(orgId);
    },
  });

  const uploadLogo = api.organizations.uploadLogo.useMutation({
    onSuccess: async (jwt, { orgId }) => {
      if (!result || !env.NEXT_PUBLIC_CDN_WORKER_ENDPOINT) return;
      const buffer = dataUrlToBuffer(result as string);

      const response = await fetch(
        `${env.NEXT_PUBLIC_CDN_WORKER_ENDPOINT}/assets`,
        {
          method: "PUT",
          body: buffer,
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      );

      if (response.ok) {
        await uploadComplete.mutateAsync({ orgId });
      }
    },
  });

  const onInputFile = (e: FileEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) {
      return;
    }

    const limit = 10 * 1000000; // max limit 10 MB
    const file = e.target.files[0]!;

    if (file.size > limit) {
      toast({
        title: "That file is too large! Max file size is 10 MB",
        status: "error",
        colorScheme: "red",
        icon: <AnimatedXCircle />,
        render: Toast,
      });
    } else {
      setFile(file);
    }
  };

  return { file: result, setFile, onInputFile, uploadLogo, uploadComplete };
};
