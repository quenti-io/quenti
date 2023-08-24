import { Button, useColorModeValue } from "@chakra-ui/react";

export interface ClickableProps {
  onClick?: () => void;
  isSelected?: boolean;
}

export const Clickable: React.FC<React.PropsWithChildren<ClickableProps>> = ({
  onClick,
  isSelected,
  children,
}) => {
  const selectedBorder = useColorModeValue("blue.600", "blue.200");
  const defaultBorder = useColorModeValue("gray.200", "gray.600");

  return (
    <Button
      w="full"
      variant="outline"
      rounded="xl"
      bg="transparent"
      borderWidth="2px"
      borderColor={isSelected ? selectedBorder : defaultBorder}
      px="6"
      py="4"
      h="full"
      colorScheme={isSelected ? "blue" : "gray"}
      onClick={onClick}
      justifyContent="start"
    >
      {children}
    </Button>
  );
};
