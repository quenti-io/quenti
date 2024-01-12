import { Link } from "@quenti/components";

import { Button, HStack, Heading, Stack, Text } from "@chakra-ui/react";

import { IconArrowLeft, IconStack2 } from "@tabler/icons-react";

import { useSetEditorContext } from "../../stores/use-set-editor-store";
import { plural } from "../../utils/string";

export const CollabSetInfo = () => {
  const id = useSetEditorContext((s) => s.id);
  const title = useSetEditorContext((s) => s.title);
  const description = useSetEditorContext((s) => s.description);
  const collab = useSetEditorContext((s) => s.collab)!;

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
          {collab.maxTerms == collab.minTerms
            ? `Submit ${plural(collab.minTerms, "term")}`
            : `Submit between ${collab.minTerms}-${collab.maxTerms} terms`}
        </Text>
      </HStack>
    </Stack>
  );
};
