import { Text } from "@chakra-ui/react";

import { useFolder } from "../../hooks/use-folder";

export const FolderDescription = () => {
  const folder = useFolder();

  return (
    !!folder.description.length && (
      <Text whiteSpace="pre-wrap" mt="6">
        {folder.description}
      </Text>
    )
  );
};
