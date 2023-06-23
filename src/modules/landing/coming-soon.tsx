import {
  Flex,
  Heading,
  // eslint-disable-next-line no-restricted-imports
  Link,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { IconReport, IconSchool } from "@tabler/icons-react";
import { Feature } from "./feature";

export const ComingSoon = () => {
  return (
    <Flex as="section" justify="center" mt={16}>
      <Stack maxWidth="1000px" w="full" px="4" spacing={16}>
        <VStack spacing={6}>
          <Link id="coming-soon" cursor="text" mt="-32" pt="32">
            <Heading
              fontSize={{ base: "4xl", xl: "6xl" }}
              textAlign="center"
              data-aos="fade"
              color="whiteAlpha.900"
            >
              Coming Soon
            </Heading>
          </Link>
          <Text
            textAlign="center"
            color="gray.400"
            maxW="1000px"
            fontSize={{ base: "lg", xl: "xl" }}
            data-aos="fade"
          >
            Quizlet.cc is still under active development, and currently lacks
            quite a few things. Here&apos;s what you can expect to arrive in the
            following months:
          </Text>
        </VStack>
        <VStack gap={8} pb="20" textAlign="center">
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={8} data-aos="fade-up">
            <Feature
              icon={<IconReport size={40} />}
              title="Test"
              description="Fill out a graded practice test automatically generated from your terms and flashcards."
              alt
            />
            <Feature
              icon={<IconSchool size={40} />}
              title="Courses"
              description="Courses allow you to enroll students and have a single place to group and assign study sets."
              alt
            />
          </SimpleGrid>
        </VStack>
      </Stack>
    </Flex>
  );
};
