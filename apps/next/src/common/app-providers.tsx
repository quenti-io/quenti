import type { Session } from "next-auth";
import type { AppProps as NextAppProps } from "next/app";
import dynamic from "next/dynamic";

import { env } from "@quenti/env/client";

import { theme } from "../lib/chakra-theme";

const ChakraProvider = dynamic(
  () => import("@chakra-ui/react").then((mod) => mod.ChakraProvider),
  { ssr: false },
);
const HighlightInit = dynamic(
  () => import("@highlight-run/next/client").then((mod) => mod.HighlightInit),
  { ssr: false },
);
const SessionProvider = dynamic(
  () => import("next-auth/react").then((mod) => mod.SessionProvider),
  { ssr: false },
);
const Analytics = dynamic(
  () => import("@vercel/analytics/react").then((mod) => mod.Analytics),
  { ssr: false },
);
const HistoryProvider = dynamic(
  () =>
    import("../modules/history-provider").then((mod) => mod.HistoryProvider),
  { ssr: false },
);

const TelemetryProvider = dynamic(
  () => import("../lib/telemetry").then((mod) => mod.TelemetryProvider),
  {
    ssr: false,
  },
);
const IdentifyUser = dynamic(
  () => import("../lib/telemetry").then((mod) => mod.IdentifyUser),
  {
    ssr: false,
  },
);

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
