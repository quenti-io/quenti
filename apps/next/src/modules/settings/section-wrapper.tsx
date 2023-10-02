import React from "react";

import {
  Grid,
  Heading,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

export interface SectionWrapperProps {
  heading: string;
  description: string | React.ReactNode;
  additional?: React.ReactNode;
}

export const SectionWrapper: React.FC<
  React.PropsWithChildren<SectionWrapperProps>
> = ({ heading, description, additional, children }) => {
  const grayText = useColorModeValue("gray.600", "gray.400");

  return (
    <Grid
      gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }}
      gap={{ base: 6, md: 16 }}
    >
      <Stack spacing={4}>
        <Stack spacing={2}>
          <Heading size="md">{heading}</Heading>
          <Text color={grayText} fontSize="sm">
            {description}
          </Text>
        </Stack>
        {additional}
      </Stack>
      {children}
    </Grid>
  );
};
