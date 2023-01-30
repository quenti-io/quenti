import { type ChakraProps, extendTheme } from "@chakra-ui/react";
import { mode, StyleFunctionProps } from "@chakra-ui/theme-tools";

const config = { initialColorMode: "dark", useSystemColorMode: false };

const fonts = {
  heading: "Outfit",
  body: "Open Sans",
};

const colors = {
  blue: {
    50: "#e0edff",
    100: "#b0caff",
    200: "#7ea6ff",
    300: "#4b83ff",
    400: "#1a5fff",
    500: "#0042da",
    600: "#0036b4",
    700: "#002782",
    800: "#001751",
    900: "#1a202c",
  },
  orange: {
    50: "#fff1da",
    100: "#ffd7ae",
    200: "#ffbf7d",
    300: "#ffa54c",
    400: "#ff8b1a",
    500: "#e67200",
    600: "#b45800",
    700: "#813e00",
    800: "#4f2500",
    900: "#200b00",
  },
  yellow: {
    50: "#fff9da",
    100: "#ffedad",
    200: "#ffe17d",
    300: "#ffd54b",
    400: "#ffc91a",
    500: "#e6b000",
    600: "#b38800",
    700: "#806200",
    800: "#4e3a00",
    900: "#1d1400",
  },
  gray: {
    750: "#242C3A",
    1000: "#171923",
  },
};

const components = {
  Button: {
    defaultProps: {
      colorScheme: "blue",
    },
    variants: {
      solid: () => ({
        bg: "blue.400",
        color: "white",
        shadow: "inset 0 1px 0 0 rgb(255 255 255/.2)",
        _hover: {
          bg: "blue.300",
        },
      }),
    },
  },
  Popover: {
    baseStyle: {
      popper: {
        width: "fit-content",
        maxWidth: "fit-content",
      },
    },
  },
  Tooltip: {
    baseStyle: ({ colorMode }: StyleFunctionProps) => ({
      borderRadius: "md",
      bg: colorMode == "light" ? "white" : "gray.750",
      textColor: colorMode == "light" ? "black" : "white",
    }),
  },
  Link: {
    baseStyle: {
      _hover: { textDecoration: "none" },
    },
  },
};

const styles = {
  global: (props: ChakraProps) => ({
    body: {
      bg: mode("gray.50", "gray.1000")(props),
    },
  }),
};

export const theme = extendTheme({
  fonts,
  components,
  colors,
  config,
  styles,
});
