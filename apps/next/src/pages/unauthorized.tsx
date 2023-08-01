import { Button, Center, Heading, Text, VStack } from "@chakra-ui/react";
import { IconArrowLeft } from "@tabler/icons-react";
import { motion } from "framer-motion";
import Head from "next/head";
import { Link } from "../components/link";
import { StaticWrapper } from "../components/static-wrapper";

export default function Unauthorized() {
  const stack = {
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.75,
      },
    },
    hidden: {
      opacity: 0,
      transition: {
        when: "afterChildren",
      },
    },
  };

  const header = {
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, easing: "ease-out" },
    },
    hidden: { opacity: 0, y: 20 },
  };

  const text = {
    visible: {
      opacity: 1,
      transition: { duration: 0.4 },
    },
    hidden: { opacity: 0 },
  };

  return (
    <StaticWrapper>
      <Head>
        <title>Missing Acccess | Quenti</title>
      </Head>
      <Center height="calc(100vh - 120px)" px="8" textAlign="center">
        <VStack color="whiteAlpha.900">
          <motion.div
            variants={stack}
            initial="hidden"
            animate="visible"
            style={{ display: "flex", flexDirection: "column", gap: 24 }}
          >
            <motion.div variants={header}>
              <Heading
                fontSize={{ base: "4xl", sm: "6xl", md: "7xl", lg: "8xl" }}
                bgGradient="linear(to-r, blue.300, purple.300)"
                bgClip="text"
              >
                Missing Access
              </Heading>
            </motion.div>
            <motion.div variants={text}>
              <Text
                fontSize={{ base: "md", sm: "lg" }}
                color="whiteAlpha.900"
                fontWeight={600}
              >
                Sorry, you don&apos;t have access to Quenti without a
                verified email.
              </Text>
            </motion.div>
            <motion.div variants={text}>
              <Button
                as={Link}
                variant="ghost"
                href="/"
                leftIcon={<IconArrowLeft size={18} />}
              >
                Go Back
              </Button>
            </motion.div>
          </motion.div>
        </VStack>
      </Center>
    </StaticWrapper>
  );
}
