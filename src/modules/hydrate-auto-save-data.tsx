import type { AutoSaveTerm, SetAutoSave } from "@prisma/client";
import React from "react";
import { Loading } from "../components/loading";
import { useLoading } from "../hooks/use-loading";
import {
  createSetEditorStore,
  SetEditorContext,
  type SetEditorStore,
} from "../stores/use-set-editor-store";
import { api } from "../utils/api";

export const HydrateAutoSaveData: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { data } = api.autoSave.get.useQuery();
  const { loading } = useLoading();
  if (loading || !data) return <Loading />;

  return <ContextLayer data={data}>{children}</ContextLayer>;
};

const ContextLayer: React.FC<
  React.PropsWithChildren<{
    data: SetAutoSave & { autoSaveTerms: AutoSaveTerm[] };
  }>
> = ({ data, children }) => {
  const storeRef = React.useRef<SetEditorStore>();
  if (!storeRef.current) {
    storeRef.current = createSetEditorStore({
      ...data,
      terms: data.autoSaveTerms
    });
  }

  return (
    <SetEditorContext.Provider value={storeRef.current}>
      {children}
    </SetEditorContext.Provider>
  );
};
