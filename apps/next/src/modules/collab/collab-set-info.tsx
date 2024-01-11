import { Link } from "@quenti/components";

import { Button, Heading, Stack, Text } from "@chakra-ui/react";

import { IconArrowLeft } from "@tabler/icons-react";

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
    </Stack>
  );
};
