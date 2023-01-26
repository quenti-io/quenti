import {
  ChakraProvider,
  cookieStorageManagerSSR,
  localStorageManager,
} from "@chakra-ui/react";
import { theme } from "../lib/chakra-theme";

export const Chakra = ({ cookies, children }: any) => {
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

export const getServerSideProps = ({ req }: any) => {
  return {
    props: {
      cookies: req.headers.cookie ?? "",
    },
  };
};
