import { Flex, FormLabel, SkeletonText } from "@chakra-ui/react";

export const SkeletonLabel: React.FC<
  React.PropsWithChildren & { isLoaded?: boolean }
> = ({ children, isLoaded = false }) => {
  return (
    <Flex h="21px" alignItems="center" w="max-content">
      <SkeletonText
        rounded="md"
        noOfLines={1}
        fitContent
        isLoaded={isLoaded}
        skeletonHeight="16px"
      >
        <FormLabel
          fontSize="sm"
          color="gray.700"
          _dark={{
            color: "gray.300",
          }}
        >
          {children}
        </FormLabel>
      </SkeletonText>
    </Flex>
  );
};
