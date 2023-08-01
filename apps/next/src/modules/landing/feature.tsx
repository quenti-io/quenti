import { Box, Text, VStack } from "@chakra-ui/react";

export interface FeatureProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  alt?: boolean;
}

export const Feature: React.FC<FeatureProps> = ({
  title,
  icon,
  description,
  alt,
}) => {
  return (
    <Box
      pos="relative"
      bg="gray.800"
      rounded="xl"
      p="10"
      role="group"
      border="2px"
      borderColor="gray.800"
      transition="border-color ease-in-out 0.2s"
      shadow="xl"
      _hover={{
        borderColor: "gray.750",
      }}
    >
      <VStack spacing={2}>
        <Text
          fontSize={!alt ? "xl" : "2xl"}
          color="whiteAlpha.900"
          fontWeight={!alt ? 600 : 700}
        >
          {title}
        </Text>
        <Text color="gray.400">{description}</Text>
      </VStack>
      <Box
        pos="absolute"
        top="-20px"
        left="50%"
        transform="translateX(-50%)"
        color={!alt ? "blue.300" : "orange.200"}
        transition="transform ease-in-out 0.2s"
        _groupHover={{
          transform: "translateX(-50%) translateY(-4px)",
        }}
      >
        {icon}
      </Box>
    </Box>
  );
};
