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

import { GlobalShortcutLayer } from "../components/global-shortcut-layer";
import "../styles/globals.css";
import Head from "next/head";

const growthbook = new GrowthBook({
  apiHost: "https://cdn.growthbook.io",
  clientKey: "sdk-gD5ZDoRwawG4G7L",
  enableDevMode: true,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/ban-types
type NextComponentWithAuth = NextComponentType<NextPageContext, any, {}> &
  Partial<AuthEnabledComponentConfig>;

export const BASE_PAGES = ["/", "/404", "/unauthorized"];

const App: AppType<{ session: Session | null; cookies: string }> = ({
  Component: _Component,
  pageProps: { session, cookies, ...pageProps },
}) => {
  const Component = _Component as NextComponentWithAuth;
  const pathname = useRouter().pathname;
  const staticPage = BASE_PAGES.includes(pathname);

  React.useEffect(() => {
    void (async () => growthbook.loadFeatures())();
  }, []);

  const children = (
    <>
      <Navbar />
      <GlobalShortcutLayer />
      {Component.authenticationEnabled ? (
        <>
          <Head>
            <title>
              {Component.title
                ? `${Component.title} | Quizlet.cc`
                : `Quizlet.cc`}
            </title>
          </Head>
          <Auth>
            <Component {...pageProps} />
          </Auth>
        </>
      ) : (
        <Component {...pageProps} />
      )}
    </>
  );

  return (
    <>
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#1a5fff" />
        <meta name="msapplication-TileColor" content="#1a5fff" />
        <meta name="theme-color" content="#171923" />
      </Head>
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
    </>
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
