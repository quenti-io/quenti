import { BANNER_COLORS } from "@quenti/lib/color";

import {
  Box,
  Center,
  Popover,
  PopoverAnchor,
  PopoverContent,
  SimpleGrid,
} from "@chakra-ui/react";

import { IconCheck } from "@tabler/icons-react";

export interface BannerPickerProps {
  isOpen: boolean;
  onClose: () => void;
  selected: string;
  onSelect: (banner: string) => void;
}

export const BannerPicker: React.FC<
  React.PropsWithChildren<BannerPickerProps>
> = ({ isOpen, onClose, selected, onSelect, children }) => {
  return (
    <Popover isOpen={isOpen} onClose={onClose} placement="bottom">
      <PopoverAnchor>{children}</PopoverAnchor>
      <PopoverContent w="max" p="2">
        <SimpleGrid columns={5} spacing="2">
          {BANNER_COLORS.map((c) => (
            <Center
              key={c}
              w="10"
              h="8"
              rounded="md"
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
        </SimpleGrid>
      </PopoverContent>
    </Popover>
  );
};
