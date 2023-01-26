import { Center, Spinner } from "@chakra-ui/react";

export const Loading = () => {
  return (
    <Center height="calc(100vh - 120px)">
      <Spinner color="blue.200" />
    </Center>
  );
};
