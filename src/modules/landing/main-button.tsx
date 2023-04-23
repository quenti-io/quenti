import { Button } from "@chakra-ui/react";
import { Link } from "../../components/link";

export const MainButton = () => {
  return (
    <Button
      colorScheme="orange"
      size="lg"
      height="4rem"
      px="2rem"
      as={Link}
      href={"/signup"}
    >
      Sign up for free
    </Button>
  );
};
