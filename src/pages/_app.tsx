import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "../utils/api";

import { Navbar } from "../components/navbar";
import { Chakra } from "../components/chakra";
import { useRouter } from "next/router";
import { DarkMode, GlobalStyle } from "@chakra-ui/react";

const App: AppType<{ session: Session | null; cookies: string }> = ({
  Component,
  pageProps: { session, cookies, ...pageProps },
}) => {
  const onIndex = useRouter().pathname === "/";
  const children = (
    <>
      <Navbar />
      <Component {...pageProps} />
    </>
  );

  return (
    <Chakra cookies={cookies}>
      <SessionProvider session={session}>
        {onIndex ? (
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

export default api.withTRPC(App);
