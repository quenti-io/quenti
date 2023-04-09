import {
  Box,
  Center,
  Flex,
  Heading,
  HStack,
  IconButton,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import React from "react";

const features = [
  {
    src: "/media/create-set.mp4",
    name: "Create Study Sets",
    description: "Create your own study sets or import from Quizlet.com",
  },
  {
    src: "/media/study-path.mp4",
    name: "Customize Your Studying",
    description: "Change how you answer questions, shuffle terms, and more.",
  },
  {
    src: "/media/folders.mp4",
    name: "Group Sets Into Folders",
    description: "Organize your sets into folders and combine flashcards.",
  },
  {
    src: "/media/command-menu.mp4",
    name: "Get Anywhere, From Anywhere",
    description: "Open the command menu with Ctrl + K and start typing.",
  },
];

export const EmptyDashboard = () => {
  const borderColor = useColorModeValue("gray.300", "gray.750");

  const [page, setPage] = React.useState(0);
  const feature = features[page]!;

  const dotColor = useColorModeValue("gray.200", "gray.750");
  const dotHover = useColorModeValue("gray.300", "gray.700");
  const dotSelected = useColorModeValue("gray.400", "gray.600");

  return (
    <Center
      w="full"
      rounded="lg"
      borderWidth="2px"
      borderColor={borderColor}
      p="12"
      shadow="md"
    >
      <VStack spacing={8} textAlign="center">
        <VStack>
          <Heading>This is your dashboard</Heading>
          <Text color="gray.500">
            Sets and folders you&apos;ve recently viewed will show up here.
          </Text>
        </VStack>
        <FeatureVideo src={feature.src} />
        <VStack>
          <Heading size="md">{feature.name}</Heading>
          <Text color="gray.500">{feature.description}</Text>
        </VStack>
        <Flex justifyContent="space-between" w="full">
          <IconButton
            size="sm"
            aria-label="Previous"
            icon={<IconChevronLeft />}
            variant="ghost"
            rounded="full"
            isDisabled={page == 0}
            onClick={() => setPage((p) => p - 1)}
          />
          <HStack>
            {Array.from({ length: 4 }).map((_, i) => (
              <Box
                key={i}
                rounded="full"
                width="3"
                height="3"
                bg={page == i ? dotSelected : dotColor}
                transition="all 0.2s"
                cursor="pointer"
                _hover={{
                  bg: dotHover,
                }}
                onClick={() => {
                  setPage(i);
                }}
              />
            ))}
          </HStack>
          <IconButton
            size="sm"
            aria-label="Previous"
            icon={<IconChevronRight />}
            variant="ghost"
            rounded="full"
            isDisabled={page == features.length - 1}
            onClick={() => setPage((p) => p + 1)}
          />
        </Flex>
      </VStack>
    </Center>
  );
};

const FeatureVideo = ({ src }: { src: string }) => {
  const videoBg = useColorModeValue("gray.200", "gray.800");
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    videoRef.current?.setAttribute("src", src);
  }, [src]);

  return (
    <Box
      rounded="lg"
      overflow="hidden"
      shadow="2xl"
      position="relative"
      maxW="2xl"
      bg={videoBg}
      width="calc(100vw - 64px)"
      style={{
        paddingBottom: "calc(.5625 * 100%)",
      }}
    >
      <video
        autoPlay
        loop
        muted
        ref={videoRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <source src={src} />
      </video>
    </Box>
  );
};
