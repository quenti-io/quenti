import { Heading, Stack, Text } from "@chakra-ui/react";

import { useSetEditorContext } from "../../stores/use-set-editor-store";

export const CollabSetInfo = () => {
  const title = useSetEditorContext((s) => s.title);
  const description = useSetEditorContext((s) => s.description);

  return (
    <Stack spacing="4">
      <Heading>{title}</Heading>
      <Text whiteSpace="pre-wrap">{description}</Text>
    </Stack>
  );
};
