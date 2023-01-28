import { Text } from "@chakra-ui/react";
import { useSet } from "../../hooks/use-set";

export const DescriptionArea = () => {
  const { description } = useSet();

  return <Text>{description}</Text>;
};
