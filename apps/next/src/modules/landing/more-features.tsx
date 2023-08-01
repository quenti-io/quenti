import { Flex, Heading, SimpleGrid, Stack } from "@chakra-ui/react";
import {
  IconCloudDownload,
  IconFolder,
  IconLock,
  IconShare,
} from "@tabler/icons-react";
import { Feature, type FeatureProps } from "./feature";

const features: FeatureProps[] = [
  {
    title: "Profiles and Sharing",
    icon: <IconShare size={40} />,
    description:
      "Public sets can be shared with anyone and will appear on your profile.",
  },
  {
    title: "Study Folders",
    icon: <IconFolder size={40} />,
    description:
      "Group sets together in folders for easy access and study all sets at once.",
  },
  {
    title: "Private and Unlisted Sets",
    icon: <IconLock size={40} />,
    description: "Private and unlisted sets will not appear on your profile.",
  },
  {
    title: "Import from Quizlet",
    icon: <IconCloudDownload size={40} />,
    description: "Import and study sets directly from Quizlet in an instant.",
  },
];

export const MoreFeatures = () => {
  return (
    <Flex as="section" justify="center" pos="relative" px="4">
      <Stack spacing={12} maxW="1000px" textAlign="center">
        <Heading
          fontSize="4xl"
          textAlign="center"
          color="whiteAlpha.900"
          data-aos="fade"
        >
          And many more features
        </Heading>
        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          gap={8}
          pb="20"
          data-aos="fade"
        >
          {features.map((feature, i) => (
            <Feature key={i} {...feature} />
          ))}
        </SimpleGrid>
      </Stack>
    </Flex>
  );
};
