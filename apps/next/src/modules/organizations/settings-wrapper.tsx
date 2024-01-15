import {
  Flex,
  Grid,
  GridItem,
  Heading,
  SkeletonText,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

export interface SettingsWrapperProps {
  heading: string;
  description: string | React.ReactNode;
  noOfLines?: number;
  isLoaded: boolean;
}

export const SettingsWrapper: React.FC<
  React.PropsWithChildren<SettingsWrapperProps>
> = ({ heading, description, noOfLines = 1, children, isLoaded }) => {
  const mutedColor = useColorModeValue("gray.700", "gray.300");

  return (
    <Grid
      gridTemplateColumns={{ base: "1fr", md: "1fr 2fr" }}
      gap={{ base: 4, md: 16 }}
      maxW="4xl"
    >
      <GridItem>
        <Stack spacing="1" h="full">
          <Flex h="6" alignItems="center">
            <SkeletonText noOfLines={1} skeletonHeight="5" isLoaded={isLoaded}>
              <Heading size="md">{heading}</Heading>
            </SkeletonText>
          </Flex>
          <Flex alignItems="center" pb="2">
            <SkeletonText
              noOfLines={noOfLines}
              skeletonHeight={3}
              isLoaded={isLoaded}
            >
              <Text fontSize="sm" color={mutedColor}>
                {description}
              </Text>
            </SkeletonText>
          </Flex>
        </Stack>
      </GridItem>
      <GridItem>{children}</GridItem>
    </Grid>
  );
};
