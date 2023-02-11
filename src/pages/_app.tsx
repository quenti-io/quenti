import { DarkMode, GlobalStyle } from "@chakra-ui/react";
import { GrowthBook, GrowthBookProvider } from "@growthbook/growthbook-react";
import type { NextComponentType, NextPageContext } from "next";
import { type Session } from "next-auth";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import { type AppType } from "next/app";
import { useRouter } from "next/router";
import React from "react";
import type { AuthEnabledComponentConfig } from "../components/auth-component";
import { Chakra } from "../components/chakra";
import { Navbar } from "../components/navbar";
import { LoadingProvider, useLoading } from "../hooks/use-loading";
import { api } from "../utils/api";

import "../styles/globals.css";

const growthbook = new GrowthBook({
  apiHost: "https://cdn.growthbook.io",
  clientKey: "sdk-gD5ZDoRwawG4G7L",
  enableDevMode: true,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/ban-types
type NextComponentWithAuth = NextComponentType<NextPageContext, any, {}> &
  Partial<AuthEnabledComponentConfig>;

const App: AppType<{ session: Session | null; cookies: string }> = ({
  Component: _Component,
  pageProps: { session, cookies, ...pageProps },
}) => {
  const Component = _Component as NextComponentWithAuth;
  const pathname = useRouter().pathname;
  const staticPage = pathname === "/" || pathname === "/404";

  React.useEffect(() => {
    void (async () => growthbook.loadFeatures())();
  }, []);

  const children = (
    <>
      <Navbar />
      {Component.authenticationEnabled ? (
        <Auth>
          <Component {...pageProps} />
        </Auth>
      ) : (
        <Component {...pageProps} />
      )}
    </>
  );

  return (
    <Chakra cookies={cookies}>
      <GrowthBookProvider growthbook={growthbook}>
        <LoadingProvider>
          <SessionProvider session={session}>
            {staticPage ? (
              <DarkMode>
                <GlobalStyle />
                {children}
              </DarkMode>
            ) : (
              children
            )}
          </SessionProvider>
        </LoadingProvider>
      </GrowthBookProvider>
    </Chakra>
  );
};

const Auth: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { data, status } = useSession();
  const isUser = !!data?.user;

  const { setLoading } = useLoading();

  React.useEffect(() => {
    void (async () => {
      if (status == "loading") return;
      if (!isUser) await signIn("google");
    })();
  }, [isUser, status]);

  React.useEffect(() => {
    if (isUser) {
      growthbook.setAttributes({
        id: data.user!.id,
        email: data.user!.email,
        loggedIn: true,
      });

      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUser]);

  return <>{children}</>;
};

export default api.withTRPC(App);
