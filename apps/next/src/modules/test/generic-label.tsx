import { FormLabel, useColorModeValue } from "@chakra-ui/react";

export interface GenericLabelProps {
  evaluation?: boolean;
}

export const GenericLabel: React.FC<
  React.PropsWithChildren<GenericLabelProps>
> = ({ evaluation, children }) => {
  const correctColor = useColorModeValue("green.500", "green.200");
  const incorrectColor = useColorModeValue("red.500", "red.200");

  return (
    <FormLabel
      fontWeight={600}
      color={
        evaluation !== undefined
          ? evaluation
            ? correctColor
            : incorrectColor
          : undefined
      }
    >
      {children}
    </FormLabel>
  );
};
