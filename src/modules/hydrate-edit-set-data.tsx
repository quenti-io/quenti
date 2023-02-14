import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { Loading } from "../components/loading";
import { useLoading } from "../hooks/use-loading";
import {
  createSetEditorStore,
  SetEditorContext,
  type SetEditorStore,
} from "../stores/use-set-editor-store";
import { api, type RouterOutputs } from "../utils/api";

export const HydrateEditSetData: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const router = useRouter();
  const session = useSession();
  const id = router.query.id as string;
  const { loading } = useLoading();

  const { data } = api.studySets.byId.useQuery(id, {
    retry: false,
    onError: (e) => {
      if (e.data?.httpStatus == 403) {
        void (async () => {
          await router.push("/[id]", `/${id}`);
        })();
      }
    },
    onSuccess: (data) => {
      if (data.userId !== session.data?.user?.id) {
        void (async () => {
          await router.push("/[id]", `/${id}`);
        })();
      }
    },
  });

  if (loading || !data || data.userId !== session.data?.user?.id)
    return <Loading />;

  return <ContextLayer data={data}>{children}</ContextLayer>;
};

const ContextLayer: React.FC<
  React.PropsWithChildren<{
    data: RouterOutputs["studySets"]["byId"];
  }>
> = ({ data, children }) => {
  const storeRef = React.useRef<SetEditorStore>();
  if (!storeRef.current) {
    storeRef.current = createSetEditorStore({
      ...data,
      languages: [data.wordLanguage, data.definitionLanguage],
    });
  }

  return (
    <SetEditorContext.Provider value={storeRef.current}>
      {children}
    </SetEditorContext.Provider>
  );
};
