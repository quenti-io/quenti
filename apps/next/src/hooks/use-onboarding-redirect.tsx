import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

import { APP_URL } from "@quenti/lib/constants/url";

export const useOnboardingRedirect = () => {
  const { data: session, status } = useSession();
  const isLoading = status == "loading";
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && session?.user && !session.user.completedOnboarding) {
      const params = new URLSearchParams();
      params.set(
        "callbackUrl",
        `${APP_URL}${window.location.pathname}${window.location.search}`,
      );
      void router.replace(`/onboarding?${params.toString()}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, session]);
};
