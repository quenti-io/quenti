import { DarkMode, GlobalStyle } from "@chakra-ui/react";
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

import Head from "next/head";
import { env } from "../env/client.mjs";
import "../styles/globals.css";
import dynamic from "next/dynamic";

export { reportWebVitals } from "next-axiom";

const GlobalShortcutLayer = dynamic(
  () => import("../components/global-shortcut-layer"),
  { ssr: false }
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/ban-types
type NextComponentWithAuth = NextComponentType<NextPageContext, any, {}> &
  Partial<AuthEnabledComponentConfig>;

export const BASE_PAGES = ["/", "/404", "/unauthorized"];

const App: AppType<{ session: Session | null; cookies: string }> = ({
  Component: _Component,
  pageProps: { session, cookies, ...pageProps },
}) => {
  const Component = _Component as NextComponentWithAuth;
  const router = useRouter();
  const base = env.NEXT_PUBLIC_BASE_URL;
  const pathname = router.pathname;
  const staticPage = BASE_PAGES.includes(pathname);

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

  const title = "Quizlet.cc - A batteries included Quizlet alternative";
  const desc =
    "Tired of Quizlet showing ads and only giving you a few practice rounds for free? Turns out an alternative isn't actually all that hard to make.";

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
        <meta name="title" content={title} />
        <meta name="description" content={desc} />
        <meta property="og:site_name" content="Quizlet.cc" />
        <meta property="og:url" content={base} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${base}/og-image.png`} />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={base} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={desc} />
        <meta property="twitter:image" content={`${base}/og-image.png`} />
      </Head>
      <Chakra cookies={cookies}>
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
      </Chakra>
    </>
  );
};

const Auth: React.FC<React.PropsWithChildren> = ({ children }) => {
  const router = useRouter();
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
      void (async () => {
        // TODO: Initialize axiom config here

        if (!data.user?.banned || router.pathname == "/banned")
          setLoading(false);
        else if (data.user?.banned) await router.push("/banned");
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUser]);

  return <>{children}</>;
};

export default api.withTRPC(App);
