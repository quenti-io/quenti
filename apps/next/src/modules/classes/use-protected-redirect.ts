import { useRouter } from "next/router";
import React from "react";

import { useClass } from "../../hooks/use-class";

export const useProtectedRedirect = (opts?: { for: "Student" | "Teacher" }) => {
  const router = useRouter();
  const { data } = useClass();
  const for_ = opts?.for ?? "Teacher";

  React.useEffect(() => {
    if (!data) return;
    if (data?.me.type !== for_) {
      void router.push(`/classes/${data.id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return data?.me.type === for_;
};
