import { BANNER_COLORS } from "@quenti/lib/color";

import {
  Box,
  Button,
  Center,
  GridItem,
  Popover,
  PopoverAnchor,
  PopoverContent,
  SimpleGrid,
} from "@chakra-ui/react";

import { IconCheck, IconRotate } from "@tabler/icons-react";

export interface BannerPickerProps {
  isOpen: boolean;
  onClose: () => void;
  selected: string;
  onSelect: (banner: string) => void;
  onReset?: () => void;
  columns?: number;
  reset?: boolean;
}

export const BannerPicker: React.FC<
  React.PropsWithChildren<BannerPickerProps>
> = ({
  isOpen,
  onClose,
  selected,
  onSelect,
  onReset,
  children,
  columns = 5,
  reset,
}) => {
  return (
    <Box
      style={{
        zIndex: 100,
        position: "relative",
      }}
    >
      <Popover isOpen={isOpen} onClose={onClose} placement="bottom" isLazy>
        <PopoverAnchor>{children}</PopoverAnchor>
        <PopoverContent w="max" p="2" rounded="xl">
          <SimpleGrid columns={columns} spacing="6px">
            {BANNER_COLORS.map((c) => (
              <Center
                key={c}
                w="10"
                h="8"
                rounded="lg"
                bgGradient={`linear(to-tr, blue.300, ${c})`}
                cursor="pointer"
                onClick={() => onSelect(c)}
                color="white"
                position="relative"
                role="group"
                overflow="hidden"
              >
                {selected === c && <IconCheck size={16} strokeWidth={3} />}
                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  w="full"
                  h="full"
                  transition="opacity 0.15s ease-in-out"
                  opacity={0}
                  _hover={{
                    opacity: 0.3,
                  }}
                  bg="white"
                />
              </Center>
            ))}
            {reset && (
              <GridItem colSpan={3} mt="1">
                <Button
                  size="sm"
                  w="full"
                  rounded="lg"
                  variant="outline"
                  leftIcon={<IconRotate size={14} />}
                  colorScheme="gray"
                  fontSize="xs"
                  onClick={onReset}
                >
                  Reset
                </Button>
              </GridItem>
            )}
          </SimpleGrid>
        </PopoverContent>
      </Popover>
    </Box>
  );
};
