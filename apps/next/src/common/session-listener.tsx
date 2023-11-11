import { H } from "@highlight-run/next/client";
import { useSession } from "next-auth/react";
import React from "react";

export const SessionListener = () => {
  const { status } = useSession();

  React.useEffect(() => {
    if (status !== "authenticated") return;
    try {
      H.start();
    } catch {}
  }, [status]);

  return <></>;
};
