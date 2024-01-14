import {
  Avatar,
  Box,
  type BoxProps,
  Center,
  HStack,
  Text,
} from "@chakra-ui/react";

import { IconGhost3 } from "@tabler/icons-react";

export interface GenericCollaboratorsFooterProps {
  total: number;
  avatars: string[];
  emptyText?: string;
  lightBg?: BoxProps["color"];
  darkBg?: BoxProps["color"];
}

export const GenericCollaboratorsFooter: React.FC<
  GenericCollaboratorsFooterProps
> = ({
  total,
  avatars,
  emptyText = "No collaborators yet",
  lightBg = "white",
  darkBg = "gray.800",
}) => {
  if ((total || 0) > 0)
    return (
      <HStack h="24px" ml="-3px" pointerEvents="none" gap="0">
        {avatars.map((avatar) => (
          <Avatar
            size="xs"
            marginEnd="-3"
            bg="gray.100"
            _dark={{
              bg: "gray.700",
              borderColor: darkBg,
            }}
            icon={<></>}
            getInitials={() => ""}
            key={avatar}
            borderWidth={3}
            name={avatar}
            src={avatar}
            width="30px"
            height="30px"
          />
        ))}
        {total > 5 && (
          <Center
            bg="gray.200"
            borderColor="white"
            _dark={{
              bg: "gray.700",
              borderColor: darkBg,
            }}
            rounded="full"
            w="max"
            px="6px"
            pr="7px"
            h="30px"
            borderWidth={3}
            position="relative"
            fontSize="12px"
            fontWeight={600}
            fontFamily="heading"
          >
            <Text>+{total - 5}</Text>
          </Center>
        )}
      </HStack>
    );

  return (
    <HStack
      pointerEvents="none"
      color="gray.600"
      _dark={{
        color: "gray.400",
      }}
      fontWeight={500}
      spacing="4"
      ml="-3px"
    >
      <Box position="relative">
        <Box
          position="absolute"
          top="0"
          left="0"
          opacity={0.5}
          ml="10px"
          zIndex={1}
        >
          <IconGhost3 size={20} />
        </Box>
        <Box
          position="absolute"
          top="0"
          left="0"
          zIndex={2}
          color={lightBg}
          _dark={{
            color: darkBg,
          }}
        >
          <IconGhost3 size={20} strokeWidth={8} />
        </Box>
        <Box
          position="relative"
          zIndex={3}
          fill={lightBg}
          _dark={{
            fill: darkBg,
          }}
        >
          <IconGhost3 size={20} fill="inherit" />
        </Box>
      </Box>
      <Text fontSize="sm">{emptyText}</Text>
    </HStack>
  );
};
