import { useRouter } from "next/router";

import { Box, Button, HStack, Text } from "@chakra-ui/react";

import { IconArrowRight } from "@tabler/icons-react";

export const CreateCta = () => {
  const router = useRouter();

  return (
    <Button
      size="xs"
      mt="1"
      variant="link"
      w="max"
      role="group"
      _hover={{
        textDecoration: "none",
      }}
      _active={{
        color: "blue.700",
      }}
      _dark={{
        _active: {
          color: "blue.100",
        },
      }}
      onClick={async () => {
        await router.push("/create");
      }}
    >
      <HStack fontSize="xs" spacing="1">
        <Text>Try it out</Text>
        <Box
          _groupHover={{
            transform: "rotate(-45deg)",
          }}
          transition="transform 0.2s ease-in-out"
        >
          <IconArrowRight size={16} />
        </Box>
      </HStack>
    </Button>
  );
};
