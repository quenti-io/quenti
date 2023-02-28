import { Center, Container, Heading, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import type { ComponentWithAuth } from "../components/auth-component";
import { ChangeUsernameInput } from "../components/change-username-input";
import { Loading } from "../components/loading";
import { useLoading } from "../hooks/use-loading";

const Onboarding: ComponentWithAuth = () => {
  const router = useRouter();

  const { loading } = useLoading();
  if (loading) return <Loading />;

  const stack = {
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
    hidden: {
      opacity: 0,
      transition: {
        when: "afterChildren",
      },
    },
  };

  const item = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: 20 },
  };

  const input = {
    visible: { opacity: 1, scale: 1 },
    hidden: { opacity: 0, scale: 0 },
  };

  return (
    <Center h="calc(100vh - 120px)">
      <Container maxW="2xl">
        <VStack spacing={12} textAlign="center">
          <motion.div
            variants={stack}
            initial="hidden"
            animate="visible"
            style={{ display: "flex", flexDirection: "column", gap: 24 }}
          >
            <motion.div variants={item}>
              <Heading size="3xl">👋</Heading>
            </motion.div>
            <motion.div variants={item}>
              <Heading size="3xl">Welcome to Quizlet.cc!</Heading>
            </motion.div>
            <motion.div variants={item}>
              <Text fontSize="lg">
                Pick a username to get started. You can change this any time in
                settings.
              </Text>
            </motion.div>
            <motion.div variants={input}>
              <VStack marginTop="12">
                <ChangeUsernameInput
                  disabledIfUnchanged={false}
                  onChange={() => {
                    void (async () => {
                      await router.push(`/home`);
                    })();
                  }}
                />
              </VStack>
            </motion.div>
          </motion.div>
        </VStack>
      </Container>
    </Center>
  );
};

Onboarding.title = "Welcome";
Onboarding.authenticationEnabled = true;

export default Onboarding;
