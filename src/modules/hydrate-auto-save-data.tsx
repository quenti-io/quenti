import type { AutoSaveTerm, SetAutoSave } from "@prisma/client";
import React from "react";
import { Loading } from "../components/loading";
import {
  createCreateSetStore,
  CreateSetContext,
  type CreateSetStore,
} from "../stores/use-create-set-store";
import { api } from "../utils/api";

export const HydrateAutoSaveData: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { data } = api.autoSave.get.useQuery();
  if (!data) return <Loading />;

  return <ContextLayer data={data}>{children}</ContextLayer>;
};

const ContextLayer: React.FC<
  React.PropsWithChildren<{
    data: SetAutoSave & { autoSaveTerms: AutoSaveTerm[] };
  }>
> = ({ data, children }) => {
  const storeRef = React.useRef<CreateSetStore>();
  if (!storeRef.current) {
    storeRef.current = createCreateSetStore(data);
  }

  return (
    <CreateSetContext.Provider value={storeRef.current}>
      {children}
    </CreateSetContext.Provider>
  );
};
