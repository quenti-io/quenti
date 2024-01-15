import { Box } from "@chakra-ui/react";

import { IconUsersGroup } from "@tabler/icons-react";

interface CollabIconProps {
  size?: number;
}

export const CollabIcon: React.FC<CollabIconProps> = ({ size = 44 }) => {
  return (
    <Box
      p={`${(10 * size) / 44}px`}
      color="blue.600"
      position="relative"
      overflow="hidden"
      rounded="full"
      outline="1.5px solid"
      outlineOffset={-1.5}
      outlineColor="gray.100"
      _dark={{
        color: "blue.300",
        outlineColor: "gray.750",
      }}
      shadow="md"
    >
      <Box
        p={`${(10 * size) / 44}px`}
        position="absolute"
        top="0"
        left="0"
        w="full"
        h="full"
        rounded="full"
        bg="rgba(75, 131, 255, 0.1)"
        filter="blur(4px)"
        color="blue.200"
      >
        <Box opacity={0.75}>
          <IconUsersGroup size={(24 * size) / 44} />
        </Box>
      </Box>
      <IconUsersGroup size={(24 * size) / 44} />
    </Box>
  );
};
