import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

import { SetContext } from "../modules/hydrate-set-data";

export const useNonSetOwnerRedirect = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const setData = React.useContext(SetContext)?.data;

  React.useEffect(() => {
    // If they're not authed, do nothing as authed page will automatically redirect to login
    if (!session || !session.user || !setData) return;
    if (setData.userId !== session.user.id) {
      void router.replace(`/sets/${setData.id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, setData]);
};
