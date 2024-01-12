import { Link } from "@quenti/components";

import { Button, HStack, Heading, Stack, Text } from "@chakra-ui/react";

import { IconArrowLeft, IconStack2 } from "@tabler/icons-react";

import { useSetEditorContext } from "../../stores/use-set-editor-store";

export const CollabSetInfo = () => {
  const id = useSetEditorContext((s) => s.id);
  const title = useSetEditorContext((s) => s.title);
  const description = useSetEditorContext((s) => s.description);

  return (
    <Stack spacing="4">
      <Stack>
        <Button
          leftIcon={<IconArrowLeft size="16" />}
          size="sm"
          variant="ghost"
          as={Link}
          href={`/${id}`}
          w="max"
        >
          Back to set
        </Button>
        <Heading>{title}</Heading>
      </Stack>
      <Text whiteSpace="pre-wrap">{description}</Text>
      <HStack color="gray.500">
        <IconStack2 size="16" />
        <Text fontSize="sm" fontWeight={600}>
          Submit 10-20 terms
        </Text>
      </HStack>
    </Stack>
  );
};
