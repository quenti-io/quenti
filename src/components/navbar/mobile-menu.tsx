import {
  Button,
  Collapse,
  Link,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
import { MobileUserOptions } from "./mobile-user-options";

export const MobileMenu: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  const { data: session, status } = useSession()!;
  const bgGradient = useColorModeValue(
    "linear(to-b, gray.50, white)",
    "linear(to-b, gray.900, gray.800)"
  );

  return (
    <Collapse in={isOpen}>
      <Stack
        pos="absolute"
        insetX={0}
        bgGradient={bgGradient}
        px="6"
        py="10"
        spacing={8}
      >
        <Stack spacing={4}>
          {session?.user && (
            <Button
              as={Link}
              href="/home"
              variant="outline"
              colorScheme="gray"
              fontWeight={700}
              fontSize="sm"
            >
              Home
            </Button>
          )}
          {session?.user?.admin && (
            <Button
              as={Link}
              href="/admin"
              variant="outline"
              colorScheme="gray"
              fontWeight={700}
              fontSize="sm"
            >
              Admin
            </Button>
          )}
          {status !== "loading" && !session && (
            <Button
              colorScheme="blue"
              fontWeight={700}
              onClick={async () => {
                await signIn("google", {
                  callbackUrl: "/home",
                });
              }}
            >
              Sign in
            </Button>
          )}
        </Stack>
        {session?.user && <MobileUserOptions />}
      </Stack>
    </Collapse>
  );
};
