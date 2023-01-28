import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "../utils/api";

import { Navbar } from "../components/navbar";
import { Chakra } from "../components/chakra";

const App: AppType<{ session: Session | null; cookies: string }> = ({
  Component,
  pageProps: { session, cookies, ...pageProps },
}) => {
  return (
    <Chakra cookies={cookies}>
      <SessionProvider session={session}>
        <Navbar />
        <Component {...pageProps} />
      </SessionProvider>
    </Chakra>
  );
};

export default api.withTRPC(App);
