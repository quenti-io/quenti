import {
  ChakraProvider,
  cookieStorageManagerSSR,
  localStorageManager,
} from "@chakra-ui/react";
import type { GetServerSideProps } from "next";
import { theme } from "../lib/chakra-theme";

type Data = { cookies: string };

export const Chakra: React.FC<React.PropsWithChildren<Data>> = ({
  cookies,
  children,
}) => {
  const colorModeManager =
    typeof cookies === "string"
      ? cookieStorageManagerSSR(cookies)
      : localStorageManager;

  return (
    <ChakraProvider colorModeManager={colorModeManager} theme={theme}>
      {children}
    </ChakraProvider>
  );
};

export const runtime = "experimental-edge";

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps<Data> = async ({ req }) => {
  return {
    props: {
      cookies: req.headers.cookie ?? "",
    },
  };
};
