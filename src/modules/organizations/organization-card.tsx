import {
  Box,
  Button,
  ButtonGroup,
  Fade,
  Flex,
  useToast,
  Heading,
  LinkBox,
  LinkOverlay,
  Skeleton,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { organizationIcon } from "../../utils/icons";
import { getColorFromId } from "../../utils/color";
import { Link } from "../../components/link";
import { api } from "../../utils/api";
import { AnimatedCheckCircle } from "../../components/animated-icons/check";
import { useRouter } from "next/router";
import { plural } from "../../utils/string";

export interface OrganizationCardProps {
  id: string;
  name: string;
  accepted?: boolean;
  icon?: number;
  skeleton?: boolean;
  members: number;
  students: number;
}

export const OrganizationCard: React.FC<OrganizationCardProps> = ({
  id,
  name,
  accepted = true,
  icon = 0,
  skeleton,
  members,
  students,
}) => {
  const router = useRouter();
  const utils = api.useContext();
  const toast = useToast();

  const acceptInvite = api.organizations.acceptInvite.useMutation({
    onSuccess: async () => {
      await utils.organizations.getBelonging.invalidate();
      if (acceptInvite.variables?.accept) {
        await router.push(`/orgs/${id}`);
        toast({
          title: `Successfully joined ${name}`,
          status: "success",
          icon: <AnimatedCheckCircle />,
          containerStyle: { marginBottom: "2rem", marginTop: "-1rem" },
        });
      }
    },
  });

  const Wrapper = skeleton ? Skeleton : React.Fragment;
  const children = skeleton ? (
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
  const buttonBg = useColorModeValue("whiteAlpha.500", "blackAlpha.500");
  const buttonBgHover = useColorModeValue("whiteAlpha.600", "blackAlpha.600");

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
          >
            {!accepted && (
              <ButtonGroup size="sm" pointerEvents="all">
                <Button
                  variant="unstyled"
                  px="3"
                  colorScheme="gray"
                  bg={buttonBg}
                  display="flex"
                  _hover={{
                    bg: buttonBgHover,
                  }}
                  isLoading={
                    acceptInvite.isLoading &&
                    acceptInvite.variables?.orgId == id &&
                    acceptInvite.variables?.accept == false
                  }
                  onClick={() => {
                    acceptInvite.mutate({
                      accept: false,
                      orgId: id,
                    });
                  }}
                >
                  Reject
                </Button>
                <Button
                  isLoading={
                    acceptInvite.isLoading &&
                    acceptInvite.variables?.orgId == id &&
                    acceptInvite.variables?.accept == true
                  }
                  onClick={() => {
                    acceptInvite.mutate({
                      accept: true,
                      orgId: id,
                    });
                  }}
                >
                  Accept
                </Button>
              </ButtonGroup>
            )}
          </Box>
          <Stack mt="-1" spacing="4">
            <Flex
              justifyContent="space-between"
              alignItems="end"
              pointerEvents="none"
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
