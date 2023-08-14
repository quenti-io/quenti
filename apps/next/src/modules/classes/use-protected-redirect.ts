import React from "react";
import { useClass } from "../../hooks/use-class";
import { useRouter } from "next/router";

export const useProtectedRedirect = () => {
  const router = useRouter();
  const { data } = useClass();

  React.useEffect(() => {
    if (!data) return;
    if (data?.me.type == "Student") {
      void router.push(`/classes/${data.id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return data?.me.type === "Teacher";
};
