import { Analytics } from "@vercel/analytics/react";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps as NextAppProps } from "next/app";

import { ChakraProvider } from "@chakra-ui/react";

import { theme } from "../lib/chakra-theme";
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
    <>
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
        <SessionProvider session={props.pageProps.session ?? undefined}>
          <HistoryProvider>{props.children}</HistoryProvider>
        </SessionProvider>
      </ChakraProvider>
      <Analytics />
    </>
  );
};
