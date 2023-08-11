import { ChakraProvider, DarkMode, GlobalStyle } from "@chakra-ui/react";
import { ErrorBoundary as HighlightBoundary } from "@highlight-run/react";
import { env } from "@quenti/env/client";
import { api } from "@quenti/trpc";
import { Analytics } from "@vercel/analytics/react";
import { H } from "highlight.run";
import type { NextComponentType, NextPageContext } from "next";
import { type Session } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";
import { type AppType } from "next/app";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import type { AuthEnabledComponentConfig } from "../components/auth-component";
import { Navbar } from "../components/navbar";
import { LoadingProvider, useLoading } from "../hooks/use-loading";
import { theme } from "../lib/chakra-theme";

import "../styles/globals.css";

import pjson from "../../package.json";
import { ErrorBoundary } from "../components/error-bounary";
import { HistoryProvider } from "../modules/history-provider";
const version = pjson.version;

export { reportWebVitals } from "next-axiom";

const GlobalShortcutLayer = dynamic(
  () => import("../components/global-shortcut-layer"),
  { ssr: false }
);
const ChangelogContainer = dynamic(
  () => import("../modules/changelog/changelog-container"),
  { ssr: false }
);
const SignupModal = dynamic(() => import("../components/signup-modal"), {
  ssr: false,
});

if (env.NEXT_PUBLIC_DEPLOYMENT) {
  H.init(env.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID, {
    tracingOrigins: true,
    networkRecording: {
      enabled: true,
      recordHeadersAndBody: true,
    },
    version,
    environment: env.NEXT_PUBLIC_DEPLOYMENT,
    manualStart: true,
    backendUrl: `${env.NEXT_PUBLIC_BASE_URL}/highlight-events`,
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/ban-types
type NextComponentWithAuth = NextComponentType<NextPageContext, any, {}> &
  Partial<AuthEnabledComponentConfig>;

export const BASE_PAGES = ["/", "/signup", "/404", "/unauthorized"];
export const AUTH_PAGES = ["/auth/login", "/auth/signup"];

const App: AppType<
  {
    session: Session | null;
    id?: string;
    folderData?: { username: string; idOrSlug: string };
  } & JSX.IntrinsicAttributes
> = ({ Component: _Component, pageProps: { session, ...pageProps } }) => {
  const Component = _Component as NextComponentWithAuth & {
    layout?: React.ComponentType;
  };
  const router = useRouter();
  const base = env.NEXT_PUBLIC_BASE_URL;
  const pathname = router.pathname;
  const staticPage = BASE_PAGES.includes(pathname);
  const authPage = AUTH_PAGES.includes(pathname);
  const isOnboarding = pathname.startsWith("/onboarding");

  const Layout = Component.layout ?? React.Fragment;

  const children = (
    <>
      {!authPage && !isOnboarding && <Navbar />}
      <GlobalShortcutLayer />
      <SignupModal />
      <ChangelogContainer />
      {Component.authenticationEnabled ? (
        <HighlightBoundary customDialog={<ErrorBoundary />} showDialog>
          <Head>
            <title>
              {Component.title ? `${Component.title} | Quenti` : `Quenti`}
            </title>
          </Head>
          <Auth>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </Auth>
        </HighlightBoundary>
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </>
  );

  const title = "Quenti - A batteries included Quizlet alternative";
  const desc =
    "Tired of Quizlet showing ads and only giving you a few practice rounds for free? Stop wasting your time getting bombarded by premium offers, and resume studying today.";

  const ogImageUrl = (): string => {
    if (pageProps.id) {
      return `${base}/api/og?id=${pageProps.id}`;
    } else if (pageProps.folderData) {
      return `${base}/api/og?folderData=${pageProps.folderData.username}+${pageProps.folderData.idOrSlug}`;
    }
    return `${base}/api/og-image.png`;
  };

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
        <meta property="og:site_name" content="Quenti" />
        <meta property="og:url" content={base} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={ogImageUrl()} />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={base} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={desc} />
        <meta property="twitter:image" content={ogImageUrl()} />
        <meta name="robots" content="noindex" />
      </Head>
      <ChakraProvider
        theme={theme}
        toastOptions={{
          defaultOptions: {
            containerStyle: {
              marginBottom: "2rem",
              marginTop: "-1rem",
            },
          },
        }}
      >
        <HistoryProvider>
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
        </HistoryProvider>
      </ChakraProvider>
      <Analytics />
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
      if (!isUser)
        await router.push(
          `/auth/login?callbackUrl=${encodeURIComponent(router.asPath)}`
        );
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUser, status]);

  React.useEffect(() => {
    if (isUser) {
      void (async () => {
        if (env.NEXT_PUBLIC_DEPLOYMENT && data.user?.enableUsageData) H.start();

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
