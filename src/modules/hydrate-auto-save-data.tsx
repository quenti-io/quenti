import type { AutoSaveTerm, SetAutoSave } from "@prisma/client";
import { useRouter } from "next/router";
import React from "react";
import { Loading } from "../components/loading";
import { useLoading } from "../hooks/use-loading";
import {
  createSetEditorStore,
  SetEditorStoreContext,
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
  const router = useRouter();
  const create = api.studySets.createFromAutosave.useMutation({
    onSuccess: async (data) => {
      await router.push(`/${data.id}`);
    },
  });

  const storeRef = React.useRef<SetEditorStore>();
  if (!storeRef.current) {
    storeRef.current = createSetEditorStore(
      {
        ...data,
        terms: data.autoSaveTerms,
        languages: [data.wordLanguage, data.definitionLanguage],
      },
      {
        onComplete: () => {
          void (async () => {
            await create.mutateAsync();
          })();
        },
      }
    );
  }

  return (
    <SetEditorStoreContext.Provider value={storeRef.current}>
      {children}
    </SetEditorStoreContext.Provider>
  );
};
