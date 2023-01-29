import {
  Button,
  Heading,
  HStack,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconArrowLeft } from "@tabler/icons-react";
import { useSet } from "../../hooks/use-set";

export const HeadingArea = () => {
  const { title, terms } = useSet();
  const text = useColorModeValue("gray.600", "gray.400");

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
      <Heading size="2xl">{title}</Heading>
      <Text color={text} fontWeight={600}>
        {terms.length} term{terms.length != 1 ? "s" : ""}
      </Text>
    </Stack>
  );
};
