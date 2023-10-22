import { Box } from "@chakra-ui/react";

export const StaticWrapper: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <Box w="full" minH="calc(100vh - 80px)" bg="gray.900" overflowX="hidden">
      {children}
    </Box>
  );
};
