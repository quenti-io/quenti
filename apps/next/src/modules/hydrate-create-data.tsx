import React from "react";

import { api } from "@quenti/trpc";

import { useLoading } from "../hooks/use-loading";
import { EditorContextLayer } from "./editor/editor-context-layer";
import { EditorLoading } from "./editor/editor-loading";

export const HydrateCreateData: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { data } = api.studySets.getAutosave.useQuery(undefined, {
    staleTime: 0,
    cacheTime: 0,
  });

  const { loading } = useLoading();
  if (loading || !data) return <EditorLoading mode="create" />;

  return (
    <EditorContextLayer data={data} mode="create">
      {children}
    </EditorContextLayer>
  );
};
