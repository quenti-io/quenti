import { Box, Card, Heading, Stack, Text } from "@chakra-ui/react";

export interface NewsCardProps {
  title: string | React.ReactNode;
  description: string;
  cta?: React.ReactNode;
  image: React.ReactNode;
}

export const NewsCard: React.FC<NewsCardProps> = ({
  title,
  description,
  cta,
  image,
}) => {
  return (
    <Card
      rounded="lg"
      h="full"
      shadow="md"
      p="0"
      borderWidth="2px"
      borderColor="gray.100"
      bg="white"
      _dark={{
        bg: "gray.800",
        borderColor: "gray.700",
      }}
    >
      <Box
        w="full"
        h="120px"
        borderBottomWidth="2px"
        borderColor="gray.100"
        _dark={{
          borderColor: "gray.700",
        }}
        userSelect="none"
      >
        {image}
      </Box>
      <Stack p="5">
        {typeof title === "string" ? (
          <Heading size="md">{title}</Heading>
        ) : (
          title
        )}
        <Text
          fontSize="sm"
          color="gray.600"
          _dark={{
            color: "gray.400",
          }}
        >
          {description}
        </Text>
        {cta}
      </Stack>
    </Card>
  );
};
