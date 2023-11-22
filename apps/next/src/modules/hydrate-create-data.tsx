import { useRouter } from "next/router";
import React from "react";

import { api } from "@quenti/trpc";

import { editorEventChannel } from "../events/editor";
import { useLoading } from "../hooks/use-loading";
import { EditorContextLayer } from "./editor/editor-context-layer";
import { EditorLoading } from "./editor/editor-loading";

export const HydrateCreateData: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const router = useRouter();
  const id = router.query.id as string | undefined;

  const [isDirty, setIsDirty] = React.useState(false);

  const { data, error, refetch } = api.studySets.getAutosave.useQuery(
    { id },
    {
      staleTime: 0,
      cacheTime: 0,
      onSuccess: () => {
        if (isDirty) setIsDirty(false);
      },
    },
  );

  React.useEffect(() => {
    if (error && error.data?.httpStatus == 404) {
      void router.push("/create");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  React.useEffect(() => {
    const sub = () => {
      setIsDirty(true);
      void refetch();
    };

    editorEventChannel.on("refresh", sub);
    return () => {
      editorEventChannel.off("refresh", sub);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { loading } = useLoading();
  if (loading || !data || isDirty) return <EditorLoading mode="create" />;

  return (
    <EditorContextLayer data={data} mode="create">
      {children}
    </EditorContextLayer>
  );
};
