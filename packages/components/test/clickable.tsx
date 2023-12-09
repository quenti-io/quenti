import { Button, useColorModeValue } from "@chakra-ui/react";

export interface ClickableProps {
  onClick?: () => void;
  isSelected?: boolean;
  evaluation?: boolean;
  disabled?: boolean;
  hasIcon?: boolean;
}

export const Clickable: React.FC<React.PropsWithChildren<ClickableProps>> = ({
  onClick,
  isSelected,
  evaluation,
  disabled,
  children,
  hasIcon = evaluation !== undefined,
}) => {
  const selectedBorder = useColorModeValue("blue.600", "blue.200");
  const correctBorder = useColorModeValue(
    "rgba(47, 133, 90, 0.2)",
    "rgba(154, 230, 180, 0.2)",
  );
  const incorrectBorder = useColorModeValue(
    "rgba(197, 48, 48, 0.2)",
    "rgba(252, 129, 129, 0.2)",
  );
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
      px={hasIcon ? 4 : 6}
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
      onClick={disabled ? undefined : onClick}
      overflowWrap="anywhere"
      _hover={disabled ? {} : undefined}
      _focus={disabled ? {} : undefined}
      _active={disabled ? {} : undefined}
      justifyContent="start"
    >
      {children}
    </Button>
  );
};
