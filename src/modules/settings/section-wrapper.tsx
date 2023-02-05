import {
  Grid,
  Heading,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";

export interface SectionWrapperProps {
  heading: string;
  description: string;
}

export const SectionWrapper: React.FC<
  React.PropsWithChildren<SectionWrapperProps>
> = ({ heading, description, children }) => {
  const grayText = useColorModeValue("gray.600", "gray.400");

  return (
    <Grid
      gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }}
      gap={{ base: 4, md: 16 }}
    >
      <Stack spacing={2}>
        <Heading size="md">{heading}</Heading>
        <Text color={grayText} fontSize="sm">
          {description}
        </Text>
      </Stack>
      {children}
    </Grid>
  );
};
