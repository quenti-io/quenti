import {
  Flex,
  FormLabel,
  SkeletonText,
  useColorModeValue,
} from "@chakra-ui/react";

export const SkeletonLabel: React.FC<
  React.PropsWithChildren & { isLoaded?: boolean }
> = ({ children, isLoaded = false }) => {
  const mutedColor = useColorModeValue("gray.700", "gray.300");

  return (
    <Flex h="21px" alignItems="center" w="max-content">
      <SkeletonText
        rounded="md"
        noOfLines={1}
        fitContent
        isLoaded={isLoaded}
        skeletonHeight="16px"
      >
        <FormLabel fontSize="sm" color={mutedColor}>
          {children}
        </FormLabel>
      </SkeletonText>
    </Flex>
  );
};
