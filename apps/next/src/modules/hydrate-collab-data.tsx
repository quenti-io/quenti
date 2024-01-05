import { useRouter } from "next/router";
import React from "react";

import { type RouterOutputs, api } from "@quenti/trpc";

import { CollabEditorLayer } from "./collab/collab-editor-layer";

type CollabData = RouterOutputs["collab"]["get"];

export const CollabContext = React.createContext<
  { data: CollabData } | undefined
>(undefined);

export const HydrateCollabData: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const router = useRouter();
  const id = router.query.id as string;

  const { data, error } = api.collab.get.useQuery(
    {
      studySetId: id,
    },
    {
      enabled: !!id,
    },
  );

  React.useEffect(() => {
    if (!error) return;

    if (error.data?.code == "NOT_FOUND") {
      void router.push(`/${id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  if (!data) return null;

  return (
    <CollabContext.Provider value={{ data }}>
      <CollabEditorLayer data={data}>{children}</CollabEditorLayer>
    </CollabContext.Provider>
  );
};
