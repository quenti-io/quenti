import { Box, Fade, useColorModeValue } from "@chakra-ui/react";

export const AuthGradient = () => {
  const gradient = useColorModeValue(
    "linear(to-t, gray.50, blue.300)",
    "linear(to-t, gray.1000, blue.300)",
  );
  const gradientOpacity = useColorModeValue("0.3", "0.1");

  return (
    <Fade
      in
      transition={{
        enter: {
          duration: 1.5,
          delay: 0.2,
          ease: "easeOut",
        },
      }}
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        w="full"
        h="50vh"
        opacity={gradientOpacity}
        bgGradient={gradient}
      />
    </Fade>
  );
};
