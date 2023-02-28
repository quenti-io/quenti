import { Box, Button } from "@chakra-ui/react";
import { IconArrowRight } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { Link } from "../../components/link";

export const MainButton = () => {
  const session = useSession();

  return (
    <Button
      colorScheme="orange"
      size="lg"
      height="4rem"
      px="2rem"
      as={Link}
      href={session.data?.user ? "/home" : "/signup"}
      leftIcon={
        session.data?.user ? (
          <motion.div
            initial={{
              opacity: 0,
              x: -12,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            style={{
              marginRight: 16,
            }}
          >
            <Box w="8">
              <IconArrowRight size={32} />
            </Box>
          </motion.div>
        ) : undefined
      }
    >
      {session.data?.user ? "Go to dashboard" : "Sign up for early access"}
    </Button>
  );
};
