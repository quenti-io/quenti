import { Center, Spinner } from "@chakra-ui/react";

interface LoadingProps {
  fullHeight?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ fullHeight = false }) => {
  return (
    <Center height={!fullHeight ? "calc(100vh - 160px)" : "100vh"}>
      <Spinner color="blue.200" />
    </Center>
  );
};
