import { HighlightInit } from "@highlight-run/next/client";
import { Analytics } from "@vercel/analytics/react";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps as NextAppProps } from "next/app";

import { env } from "@quenti/env/client";

import { ChakraProvider } from "@chakra-ui/react";

import { theme } from "../lib/chakra-theme";
import { IdentifyUser, TelemetryProvider } from "../lib/telemetry";
import { HistoryProvider } from "../modules/history-provider";

export { reportWebVitals } from "next-axiom";

export type AppProps = Omit<
  NextAppProps<{ session: Session } & Record<string, unknown>>,
  "Component"
> & {
  Component: NextAppProps["Component"] & {
    getLayout?: (
      page: React.ReactElement,
      router: NextAppProps["router"],
    ) => React.ReactNode;
    PageWrapper?: (props: AppProps) => JSX.Element;
  };
};

type AppPropsWithChildren = AppProps & { children: React.ReactNode };

export const AppProviders = (props: AppPropsWithChildren) => {
  return (
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
      <TelemetryProvider>
        <HighlightInit
          excludedHostnames={["localhost"]}
          projectId={env.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID}
          tracingOrigins
          networkRecording={{
            enabled: true,
            recordHeadersAndBody: true,
          }}
          environment={env.NEXT_PUBLIC_DEPLOYMENT}
        />
        <SessionProvider session={props.pageProps.session ?? undefined}>
          <IdentifyUser />
          <HistoryProvider>{props.children}</HistoryProvider>
        </SessionProvider>
      </TelemetryProvider>
      <Analytics
        mode={
          env.NEXT_PUBLIC_DEPLOYMENT == "production"
            ? "production"
            : "development"
        }
      />
    </ChakraProvider>
  );
};
