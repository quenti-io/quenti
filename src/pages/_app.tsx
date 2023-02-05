import { DarkMode, GlobalStyle } from "@chakra-ui/react";
import type { NextComponentType, NextPageContext } from "next";
import { type Session } from "next-auth";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import { type AppType } from "next/app";
import { useRouter } from "next/router";
import React from "react";
import type { AuthEnabledComponentConfig } from "../components/auth-component";
import { Chakra } from "../components/chakra";
import { Loading } from "../components/loading";
import { Navbar } from "../components/navbar";
import { api } from "../utils/api";

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
    </Chakra>
  );
};

const Auth: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { data, status } = useSession();
  const isUser = !!data?.user;

  React.useEffect(() => {
    void (async () => {
      if (status == "loading") return;
      if (!isUser) await signIn("google");
    })();
  }, [isUser, status]);

  if (isUser) {
    return <>{children}</>;
  }

  return <Loading />;
};

export default api.withTRPC(App);
