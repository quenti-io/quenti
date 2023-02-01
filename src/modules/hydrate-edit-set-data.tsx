import { useRouter } from "next/router";
import React from "react";
import { Loading } from "../components/loading";
import { SetData } from "../interfaces/set-data";
import {
  createSetEditorStore,
  SetEditorContext,
  SetEditorStore,
} from "../stores/use-set-editor-store";
import { api } from "../utils/api";

export const HydrateEditSetData: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const id = useRouter().query.id as string;
  const { data } = api.studySets.byId.useQuery(id);

  if (!data) return <Loading />;

  return <ContextLayer data={data}>{children}</ContextLayer>;
};

const ContextLayer: React.FC<
  React.PropsWithChildren<{
    data: SetData;
  }>
> = ({ data, children }) => {
  const storeRef = React.useRef<SetEditorStore>();
  if (!storeRef.current) {
    storeRef.current = createSetEditorStore(data);
  }

  return (
    <SetEditorContext.Provider value={storeRef.current}>
      {children}
    </SetEditorContext.Provider>
  );
};
