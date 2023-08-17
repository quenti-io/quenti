import { type AppProps, AppProviders } from "./app-providers";

export const PageWrapper = (props: AppProps) => {
  const { Component, pageProps, router } = props;
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <AppProviders {...props}>
      {getLayout(<Component {...pageProps} />, router)}
    </AppProviders>
  );
};
