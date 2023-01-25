import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "../utils/api";

import { Navbar } from "../components/navbar";
import { Chakra } from "../components/chakra";

const App: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    // @ts-ignore
    <Chakra cookies={pageProps.cookies}>
      <SessionProvider session={session}>
        <Navbar />
        <Component {...pageProps} />
      </SessionProvider>
    </Chakra>
  );
};

export default api.withTRPC(App);
