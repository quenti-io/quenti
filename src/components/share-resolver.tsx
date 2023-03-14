import type { EntityType } from "@prisma/client";
import { useRouter } from "next/router";
import React from "react";
import { useLoading } from "../hooks/use-loading";
import { Folder404 } from "../modules/folders/folder-404";
import { api } from "../utils/api";
import { Generic404 } from "./generic-404";
import { Loading } from "./loading";

export const ShareResolver = () => {
  const router = useRouter();
  const { loading } = useLoading();

  const id = router.query.id as string;
  const sanitized = (id || "").slice(1);

  const [resolved, setResolved] = React.useState<EntityType | "404">();

  api.shareResolver.query.useQuery(sanitized, {
    retry: false,
    enabled: !!id && !loading,
    onSuccess: (data) => {
      void (async () => {
        if (data.url) {
          await router.push(data.url);
        } else if (data.type == "folder") {
          setResolved("Folder");
        }
      })();
    },
    onError: () => {
      setResolved("404");
    },
  });

  if (resolved == "404") return <Generic404 />;
  if (resolved == "Folder") return <Folder404 />;
  return <Loading />;
};
