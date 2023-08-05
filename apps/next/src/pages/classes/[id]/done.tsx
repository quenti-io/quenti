import {
  Box,
  Flex,
  HStack,
  Heading,
  LinkBox,
  LinkOverlay,
  Skeleton,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconPointFilled, IconSchool } from "@tabler/icons-react";
import { Link } from "../../../components/link";
import { WizardLayout } from "../../../components/wizard-layout";
import { useClass } from "../../../hooks/use-class";
import { plural } from "../../../utils/string";

export default function OnboardingDone() {
  const { data } = useClass();

  const linkBg = useColorModeValue("white", "gray.800");
  const linkBorder = useColorModeValue("gray.200", "gray.700");

  return (
    <WizardLayout
      title="You're all set!"
      description="Your class is now ready to go."
      steps={4}
      currentStep={3}
    >
      <Skeleton isLoaded={!!data} rounded="md">
        <LinkBox
          as="article"
          h="full"
          rounded="md"
          p="5"
          bg={linkBg}
          borderColor={linkBorder}
          borderWidth="2px"
          shadow="lg"
          position="relative"
          transition="all ease-in-out 150ms"
          _hover={{
            transform: "translateY(-2px)",
            borderBottomColor: "blue.300",
          }}
          overflow="hidden"
        >
          <Box
            w="full"
            h="12"
            position="absolute"
            p="2"
            display="flex"
            justifyContent="end"
            top="0"
            left="0"
            bgGradient="linear(to-r, blue.400, orange.300)"
            zIndex="50"
            pointerEvents="none"
          />
          <Stack mt="-1" spacing="4">
            <Flex
              alignItems="end"
              pointerEvents="none"
              justifyContent="space-between"
            >
              <Box
                w="16"
                h="16"
                bg={linkBg}
                zIndex="100"
                position="relative"
                rounded="2xl"
                p="8px"
              >
                <Box
                  w="full"
                  h="full"
                  rounded="xl"
                  bg="white"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  shadow="lg"
                >
                  <Box color="gray.900">
                    <IconSchool size={32} />
                  </Box>
                </Box>
              </Box>
            </Flex>
            <Stack ml="1" spacing="1">
              <Heading
                size="md"
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  lineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                <LinkOverlay as={Link} href={`/classes/${data?.id || ""}`}>
                  {data?.name || "Loading"}
                </LinkOverlay>
              </Heading>
              <HStack fontSize="sm" color="gray.500" spacing="1">
                <Text>{plural(data?.students || 0, "student")}</Text>
                <IconPointFilled size={10} />
                <Text>{plural(data?.sections?.length || 0, "section")}</Text>
              </HStack>
            </Stack>
          </Stack>
        </LinkBox>
      </Skeleton>
    </WizardLayout>
  );
}
