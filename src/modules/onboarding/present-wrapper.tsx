import { Box, Center, Container, Fade, VStack } from "@chakra-ui/react";
import { Loading } from "../../components/loading";
import { SegmentedProgress } from "../../components/segmented-progress";
import { useLoading } from "../../hooks/use-loading";

interface PresentWrapperProps {
  step: number;
}

export const PresentWrapper: React.FC<
  React.PropsWithChildren<PresentWrapperProps>
> = ({ step, children }) => {
  const { loading } = useLoading();
  if (loading) return <Loading />;

  return (
    <Center h="calc(100vh - 120px)" position="relative">
      <Container maxW="3xl">
        <Fade
          in
          initial={{
            opacity: -1,
            translateY: -16,
          }}
          animate={{
            opacity: 1,
            translateY: 0,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          }}
          exit={{
            opacity: -1,
            translateY: -16,
            transition: {
              duration: 0.3,
              ease: "easeIn",
            },
          }}
        >
          {children}
        </Fade>
      </Container>
      <VStack position="absolute" left="0" bottom="4" w="full">
        <Box w="xs">
          <SegmentedProgress steps={7} currentStep={step} />
        </Box>
      </VStack>
    </Center>
  );
};
