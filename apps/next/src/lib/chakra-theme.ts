import {
  extendTheme,
  type ChakraProps,
  type ChakraTheme,
} from "@chakra-ui/react";
import { mode, type StyleFunctionProps } from "@chakra-ui/theme-tools";

const config = { initialColorMode: "light", useSystemColorMode: false };

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
      outline: ({ colorMode, colorScheme }: StyleFunctionProps) => ({
        borderRadius: "lg",
        borderColor:
          colorScheme !== "red"
            ? colorMode == "light"
              ? "gray.300"
              : "gray.600"
            : undefined,
      }),
      ghost: () => ({
        borderRadius: "lg",
      }),
      solid: () => ({
        bg: "blue.400",
        borderRadius: "lg",
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
  Input: {
    baseStyle: {
      field: {
        _placeholder: {
          color: "gray.500",
        },
        borderRadius: "lg",
      },
    },
    sizes: {
      md: {
        field: {
          px: "14px",
        },
      },
    },
  },
  FormLabel: {
    baseStyle: ({ colorMode }: StyleFunctionProps) => ({
      fontSize: "sm",
      color: colorMode == "light" ? "gray.600" : "gray.400",
    }),
  },
  Textarea: {
    baseStyle: {
      _placeholder: {
        color: "gray.500",
      },
    },
    sizes: {
      md: {
        px: "14px",
      },
    },
  },
  Menu: {
    baseStyle: {
      list: {
        shadow: "lg",
        borderRadius: "xl",
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
  Container: {
    baseStyle: {
      px: { base: 4, sm: 8 },
    },
  },
  Link: {
    baseStyle: {
      _hover: { textDecoration: "none" },
    },
  },
  Checkbox: {
    baseStyle: () => ({
      control: {
        rounded: "md",
        _checked: { background: "blue.400", borderColor: "blue.400" },
      },
      icon: { color: "white", padding: "2px" },
    }),
  },
  Avatar: {
    baseStyle: ({ colorMode }: StyleFunctionProps) => ({
      excessLabel: {
        bg: colorMode == "light" ? "gray.200" : "gray.700",
        fontWeight: 600,
      },
    }),
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
}) as ChakraTheme;
