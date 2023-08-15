import { Text } from "@chakra-ui/react";

import { useFolder } from "../../hooks/use-folder";

export const FolderDescription = () => {
  const folder = useFolder();

  return <Text whiteSpace="pre-wrap">{folder.description}</Text>;
};
