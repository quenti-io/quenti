import { useRouter } from "next/router";

import { useSetFolderUnison } from "./use-set-folder-unison";

export const useEntityRootUrl = () => {
  const router = useRouter();
  const { id, type } = useSetFolderUnison();

  return type == "set"
    ? `/${id}`
    : `/${router.query.username as string}/folders/${
        router.query.slug as string
      }`;
};
