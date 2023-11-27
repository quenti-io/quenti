import { IconButton, type IconButtonProps } from "@chakra-ui/react";

import { IconPhotoMinus, IconPhotoPlus } from "@tabler/icons-react";

export const AddImageButton: React.FC<Omit<IconButtonProps, "aria-label">> = (
  props,
) => {
  return (
    <IconButton
      aria-label="Add image"
      icon={<IconPhotoPlus size={18} />}
      w="80px"
      h="60px"
      variant="outline"
      colorScheme="gray"
      color="gray.600"
      borderColor="gray.200"
      rounded="xl"
      _dark={{
        borderColor: "gray.600",
        color: "gray.400",
        _hover: {
          background: "gray.700",
        },
      }}
      {...props}
    />
  );
};

export const RemoveImageButton: React.FC<{ onClick: () => void }> = ({
  onClick,
}) => {
  return (
    <IconButton
      aria-label="Remove image"
      icon={<IconPhotoMinus size={18} />}
      size="sm"
      position="absolute"
      top="-1"
      right="-1"
      variant="solid"
      shadow="md"
      bg="rgb(255, 255, 255, 0.85)"
      _hover={{
        bg: "rgba(237, 242, 247, 0.85)",
      }}
      color="gray.900"
      _dark={{
        bg: "rgb(45, 55, 72, 0.75)",
        color: "gray.50",
        _hover: {
          bg: "rgba(74, 85, 104, 0.75)",
        },
      }}
      backdropFilter="blur(6px)"
      onClick={onClick}
    />
  );
};
