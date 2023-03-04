import { useRouter } from "next/router";
import React from "react";
import { Loading } from "./loading";
import { Folder404 } from "../modules/folders/folder-404";
import { api } from "../utils/api";

export const ShareResolver = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const sanitized = (id || "").slice(1);

  const [resolved, setResolved] = React.useState(false);

  api.shareResolver.query.useQuery(sanitized, {
    retry: false,
    enabled: !!id,
    onSuccess: (data) => {
      void (async () => {
        if (data.url) {
          await router.push(data.url);
        } else if (data.type == "folder") {
          setResolved(true);
        }
      })();
    },
  });

  if (resolved) return <Folder404 />;
  return <Loading />;
};
