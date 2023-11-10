import {
  Box,
  Card,
  Flex,
  Grid,
  GridItem,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";

export const LearnLoading = () => {
  const SkeletonWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
      <Flex h="21px">
        <Skeleton
          rounded="6px"
          fitContent
          h="14px"
          variant="refined"
          opacity="0.5"
        >
          {children}
        </Skeleton>
      </Flex>
    );
  };

  return (
    <Card
      w="full"
      rounded="2xl"
      borderWidth="2px"
      shadow="xl"
      bg="white"
      borderColor="gray.100"
      _dark={{
        bg: "gray.750",
        borderColor: "gray.700",
      }}
      position="relative"
    >
      <Box h="1" />
      <Stack spacing={6} px="8" py="6">
        <Flex alignItems="center" h="30px">
          <SkeletonWrapper>
            <Text textColor="gray.500" fontSize="sm" fontWeight={600}>
              Definition
            </Text>
          </SkeletonWrapper>
        </Flex>
        <Box minH={{ base: "60px", md: "140px" }}>
          <Skeleton fitContent rounded="lg" variant="refined">
            <Text fontSize="xl" whiteSpace="pre-wrap" overflowWrap="anywhere">
              Lorem ipsum dolor sit amet, consectetur
            </Text>
          </Skeleton>
        </Box>
        <Stack spacing="3">
          <Box mb="2">
            <SkeletonWrapper>
              <Text fontSize="sm" fontWeight={500}>
                Choose matching term
              </Text>
            </SkeletonWrapper>
          </Box>
          <Grid gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="6">
            {Array.from({ length: 4 }).map((_, i) => (
              <GridItem h="auto" key={i}>
                <Skeleton rounded="xl" h="68px" variant="refined" />
              </GridItem>
            ))}
          </Grid>
        </Stack>
      </Stack>
    </Card>
  );
};
