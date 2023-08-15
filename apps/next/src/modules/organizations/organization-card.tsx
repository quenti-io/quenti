import React from "react";

import { Link } from "@quenti/components";

import {
  Box,
  Fade,
  Flex,
  Heading,
  LinkBox,
  LinkOverlay,
  Skeleton,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { getColorFromId } from "../../utils/color";
import { organizationIcon } from "../../utils/icons";
import { plural } from "../../utils/string";

export interface OrganizationCardProps {
  id: string;
  name: string;
  icon?: number;
  skeleton?: boolean;
  disableLink?: boolean;
  members: number;
  students: number;
}

export const OrganizationCard: React.FC<OrganizationCardProps> = ({
  id,
  name,
  icon = 0,
  skeleton,
  disableLink = false,
  members,
  students,
}) => {
  const Wrapper = skeleton ? Skeleton : React.Fragment;
  const children =
    skeleton || disableLink ? (
      name
    ) : (
      <LinkOverlay as={Link} href={`/orgs/${id}`}>
        {name}
      </LinkOverlay>
    );

  const Icon = organizationIcon(icon);

  const linkBg = useColorModeValue("white", "gray.800");
  const linkBorder = useColorModeValue("gray.200", "gray.700");
  const iconBg = useColorModeValue("gray.700", "whiteAlpha.900");

  return (
    <Wrapper rounded="md">
      <Fade in>
        <LinkBox
          as="article"
          h="full"
          rounded="md"
          position="relative"
          p="5"
          bg={linkBg}
          borderColor={linkBorder}
          borderWidth="2px"
          transition="all ease-in-out 150ms"
          shadow="md"
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
            bgGradient={`linear(to-r, blue.300, ${getColorFromId(id)})`}
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
                rounded="full"
                p="4px"
              >
                <Box
                  w="full"
                  h="full"
                  rounded="full"
                  bg={iconBg}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  shadow="xl"
                >
                  <Box color={linkBg}>
                    <Icon size={32} />
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
                {children}
              </Heading>
              <Text fontSize="sm" color="gray.500">
                {plural(members, "member")} &middot;{" "}
                {plural(students, "student")}
              </Text>
            </Stack>
          </Stack>
        </LinkBox>
      </Fade>
    </Wrapper>
  );
};
