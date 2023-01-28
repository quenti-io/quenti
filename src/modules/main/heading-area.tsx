import { Button, Heading, HStack, Link, Stack, Text } from "@chakra-ui/react";
import { IconArrowLeft } from "@tabler/icons-react";
import { useSet } from "../../hooks/use-set";

export const HeadingArea = () => {
  const data = useSet();

  return (
    <Stack spacing={4}>
      <HStack>
        <Button
          leftIcon={<IconArrowLeft />}
          as={Link}
          href="/sets"
          variant="ghost"
        >
          All sets
        </Button>
      </HStack>
      <Heading size="2xl">{data.title}</Heading>
      <Text color="gray.400">{data.terms.length} terms</Text>
    </Stack>
  );
};
