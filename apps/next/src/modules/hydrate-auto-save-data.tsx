import { useRouter } from "next/router";
import React from "react";

import { type RouterOutputs, api } from "@quenti/trpc";

import { Loading } from "../components/loading";
import { useLoading } from "../hooks/use-loading";
import {
  type SetEditorStore,
  SetEditorStoreContext,
  createSetEditorStore,
} from "../stores/use-set-editor-store";

export const HydrateAutoSaveData: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { data } = api.autoSave.get.useQuery(undefined, {
    cacheTime: 0,
    refetchOnWindowFocus: false,
  });
  const { loading } = useLoading();
  if (loading || !data) return <Loading />;

  return <ContextLayer data={data}>{children}</ContextLayer>;
};

const ContextLayer: React.FC<
  React.PropsWithChildren<{
    data: RouterOutputs["autoSave"]["get"];
  }>
> = ({ data, children }) => {
  const router = useRouter();
  const create = api.studySets.createFromAutosave.useMutation({
    onError: (data) => {
      storeRef.current!.getState().setSaveError(data.message);
    },
    onSuccess: async (data) => {
      await router.push(`/${data.id}`);
    },
  });

  React.useEffect(() => {
    storeRef.current!.getState().setIsLoading(create.isLoading);
  }, [create.isLoading]);

  const storeRef = React.useRef<SetEditorStore>();
  if (!storeRef.current) {
    storeRef.current = createSetEditorStore(
      {
        ...data,
        terms: data.autoSaveTerms,
      },
      {
        onComplete: () => {
          void (async () => {
            await create.mutateAsync();
          })();
        },
      },
    );
  }

  return (
    <SetEditorStoreContext.Provider value={storeRef.current}>
      {children}
    </SetEditorStoreContext.Provider>
  );
};
