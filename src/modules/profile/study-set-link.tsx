import {
  Box,
  Heading,
  HStack,
  LinkBox,
  LinkOverlay,
  Stack,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
import type { StudySetVisibility } from "@prisma/client";
import { visibilityIcon } from "../../common/visibility-icon";
import { Link } from "../../components/link";
import { plural } from "../../utils/string";

interface ProfileLinkableProps {
  title: string;
  url: string;
  numValues: number;
  label: string;
  visibility?: StudySetVisibility;
  leftIcon?: React.ReactNode;
}

export const ProfileLinkable: React.FC<ProfileLinkableProps> = ({
  title,
  url,
  numValues,
  label,
  visibility,
  leftIcon,
}) => {
  const linkBg = useColorModeValue("white", "gray.800");
  const mutedText = useColorModeValue("gray.600", "gray.400");
  const linkBorder = useColorModeValue("gray.200", "gray.700");

  return (
    <LinkBox
      as="article"
      h="full"
      rounded="md"
      p="4"
      bg={linkBg}
      borderColor={linkBorder}
      borderWidth="2px"
      shadow="md"
      transition="all ease-in-out 150ms"
      _hover={{
        transform: "translateY(-2px)",
        borderBottomColor: "blue.300",
      }}
    >
      <Stack spacing={2}>
        <Text fontSize="sm" color={mutedText}>
          {plural(numValues, label)}
        </Text>
        <HStack>
          {leftIcon}
          <Heading size="md">
            <LinkOverlay as={Link} href={url}>
              {title}
            </LinkOverlay>
          </Heading>
          {visibility && visibility !== "Public" ? (
            <Box color="gray.500">{visibilityIcon(visibility, 18)}</Box>
          ) : (
            ""
          )}
        </HStack>
      </Stack>
    </LinkBox>
  );
};
