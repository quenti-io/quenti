import { Box, ScaleFade, Spinner, useColorModeValue } from "@chakra-ui/react";

import styles from "./glowing-button.module.css";

export const GlowingButton: React.FC<
  React.PropsWithChildren & { isLoading?: boolean; onClick?: () => void }
> = ({ children, isLoading = false, onClick }) => {
  const background = useColorModeValue("gray.50", "gray.800");
  const highlight = useColorModeValue("gray.100", "gray.750");

  return (
    <Box
      transition="transform 0.15s ease-in-out"
      transformOrigin="center"
      _active={{ transform: "scale(0.98)" }}
      onClick={() => {
        if (!isLoading) onClick?.();
      }}
    >
      <Box className={styles.cardWrapper}>
        <Box
          className={styles.card}
          background={background}
          transition="background 0.15s ease-in-out"
          _active={{
            background: highlight,
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            transition="opacity 0.4s ease-in-out, transform 0.4s ease-in-out"
            opacity={isLoading ? 0 : 100}
            transform={isLoading ? "scale(0)" : undefined}
          >
            {children}
          </Box>
          {isLoading && (
            <Box position="absolute" zIndex={30}>
              <ScaleFade
                in={isLoading}
                transition={{
                  enter: {
                    delay: 0.1,
                    duration: 0.5,
                    easings: ["easeInOut"],
                  },
                }}
                unmountOnExit
                initialScale={2.5}
              >
                <Spinner color="blue.300" size="xl" emptyColor="orange.200" />
              </ScaleFade>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
