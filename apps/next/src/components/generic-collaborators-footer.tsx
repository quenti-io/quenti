import {
  Avatar,
  AvatarGroup,
  Box,
  type BoxProps,
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
      <AvatarGroup size="xs" max={5} spacing="-3">
        {avatars.map((avatar) => (
          <Avatar
            key={avatar}
            borderWidth={3}
            name={avatar}
            src={avatar}
            width="30px"
            height="30px"
          />
        ))}
      </AvatarGroup>
    );

  return (
    <HStack
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
