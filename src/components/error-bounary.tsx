import { Button, Center, Heading, Text, VStack } from "@chakra-ui/react";
import { log } from "next-axiom";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";

type ErrorBoundaryProps = React.PropsWithChildren;
interface ErrorBoundaryState {
  hasError: boolean;
  isLoading: boolean;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren) {
    super(props);
    // Define a state variable to track whether is an error or not
    this.state = { hasError: false, isLoading: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error: Error): void {
    log.error("Client error", error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <>
        <RouteListener onChange={() => this.setState({ hasError: false })} />
        <Head>
          <title>Error | Quizlet.cc</title>
        </Head>
        <Center height="calc(100vh - 120px)">
          <VStack textAlign="center" px="4">
            <Heading
              fontSize={{ base: "6xl", md: "8xl", lg: "9xl" }}
              bgGradient="linear(to-r, blue.300, purple.300)"
              bgClip="text"
            >
              Oh Snap!
            </Heading>
            <VStack spacing={6}>
              <Text
                fontSize={{ base: "md", sm: "lg" }}
                color="gray.500"
                fontWeight={600}
              >
                An error occured on this page that we couldn&apos;t handle.
              </Text>
              <Button
                onClick={() => {
                  this.setState({ isLoading: true });
                  setTimeout(() => {
                    this.setState({ hasError: false, isLoading: false });
                  }, 500);
                }}
                isLoading={this.state.isLoading}
              >
                Try again?
              </Button>
            </VStack>
          </VStack>
        </Center>
      </>
    );
  }
}

const RouteListener: React.FC<{ onChange: () => void }> = ({ onChange }) => {
  const router = useRouter();

  React.useEffect(() => {
    if (!router) return;

    router.events.on("routeChangeComplete", onChange);
    return () => {
      router.events.off("routeChangeComplete", onChange);
    };
  }, [router]);

  return <></>;
};
