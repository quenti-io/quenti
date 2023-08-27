import { Button, useColorModeValue } from "@chakra-ui/react";

export interface ClickableProps {
  onClick?: () => void;
  isSelected?: boolean;
  evaluation?: boolean;
  disabled?: boolean;
}

export const Clickable: React.FC<React.PropsWithChildren<ClickableProps>> = ({
  onClick,
  isSelected,
  evaluation,
  disabled,
  children,
}) => {
  const selectedBorder = useColorModeValue("blue.600", "blue.200");
  const correctBorder = useColorModeValue("green.500", "green.200");
  const incorrectBorder = useColorModeValue("red.500", "red.200");
  const defaultBorder = useColorModeValue("gray.200", "gray.600");

  return (
    <Button
      w="full"
      variant="outline"
      rounded="xl"
      bg="transparent"
      borderWidth="2px"
      borderColor={
        evaluation !== undefined
          ? evaluation
            ? correctBorder
            : incorrectBorder
          : isSelected
          ? selectedBorder
          : defaultBorder
      }
      px="6"
      py="4"
      h="full"
      colorScheme={
        evaluation !== undefined
          ? evaluation
            ? "green"
            : "red"
          : isSelected
          ? "blue"
          : "gray"
      }
      pointerEvents={disabled ? "none" : undefined}
      onClick={onClick}
      justifyContent="start"
    >
      {children}
    </Button>
  );
};
