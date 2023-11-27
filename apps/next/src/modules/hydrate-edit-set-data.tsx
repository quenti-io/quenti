import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

import { api } from "@quenti/trpc";

import { useLoading } from "../hooks/use-loading";
import { EditorContextLayer } from "./editor/editor-context-layer";
import { EditorLoading } from "./editor/editor-loading";

export const HydrateEditSetData: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const router = useRouter();
  const session = useSession();
  const id = router.query.id as string;
  const { loading } = useLoading();

  const { data } = api.studySets.byId.useQuery(
    { studySetId: id },
    {
      enabled: !!id,
      staleTime: 0,
      cacheTime: 0,
      onError: (e) => {
        if (e.data?.httpStatus == 403) {
          void router.push("/[id]", `/${id}`);
        } else if (e.data?.httpStatus == 412) {
          void router.push(`/${id}/create`);
        }
      },
      onSuccess: (data) => {
        if (data.userId !== session.data?.user?.id) {
          void (async () => {
            await router.push("/[id]", `/${id}`);
          })();
        }
      },
    },
  );

  if (loading || !data || data.userId !== session.data?.user?.id)
    return <EditorLoading mode="edit" />;

  return (
    <EditorContextLayer data={data} mode="edit">
      {children}
    </EditorContextLayer>
  );
};
