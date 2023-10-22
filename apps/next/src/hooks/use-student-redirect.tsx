import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

export const useStudentRedirect = (url: string, isReady = true) => {
  const { data: session } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    if (isReady && session?.user?.type === "Student") void router.push(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, session]);
};
