import { api } from "@quenti/trpc";

import type { AppProps } from "../common/app-providers";
import "../styles/globals.css";

const App = (props: AppProps) => {
  const { Component, pageProps } = props;
  if (Component.PageWrapper !== undefined) return Component.PageWrapper(props);
  return <Component {...pageProps} />;
};

export default api.withTRPC(App);
