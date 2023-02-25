import { Button, Link } from "@chakra-ui/react";
import { IconArrowRight } from "@tabler/icons-react";
import { useSession } from "next-auth/react";

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
          <IconArrowRight size={32} style={{ marginRight: 18 }} />
        ) : undefined
      }
    >
      {session.data?.user ? "Go to dashboard" : "Sign up for early access"}
    </Button>
  );
};
