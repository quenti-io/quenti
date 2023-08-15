import { AnimatePresence, motion } from "framer-motion";

import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Progress,
  Skeleton,
  useColorModeValue,
} from "@chakra-ui/react";

import { IconSearch } from "@tabler/icons-react";

export interface LoadingSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceInequality?: boolean;
  isPreviousData?: boolean;
  skeleton?: boolean;
}

export const LoadingSearch: React.FC<LoadingSearchProps> = ({
  value,
  onChange,
  placeholder = "Search",
  debounceInequality = false,
  isPreviousData = false,
  skeleton,
}) => {
  const elevatedBg = useColorModeValue("white", "gray.800");

  return (
    <Skeleton
      rounded="md"
      fitContent
      isLoaded={!skeleton}
      w="full"
      position="relative"
    >
      <InputGroup
        bg="transparent"
        shadow="sm"
        rounded="md"
        w="full"
        position="relative"
      >
        <InputLeftElement pointerEvents="none" pl="2" color="gray.500">
          <IconSearch size={18} />
        </InputLeftElement>
        <Input
          zIndex="20"
          placeholder={placeholder}
          pl="44px"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <Box
          position="absolute"
          top="0"
          left="0"
          width="full"
          h="full"
          rounded="md"
          bg={elevatedBg}
        />
        <AnimatePresence>
          {(debounceInequality || isPreviousData) && (
            <motion.div
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                borderRadius: "6px",
                overflow: "hidden",
              }}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: 0.3 }}
              exit={{
                opacity: 0,
                transition: { duration: 1, ease: "linear" },
              }}
            >
              <Progress
                position="absolute"
                height="1px"
                top="0"
                left="0"
                w="full"
                h="full"
                isIndeterminate
                background={elevatedBg}
              />
              <Box
                position="absolute"
                top="0"
                left="0"
                w="full"
                h="full"
                bg="transparent"
                backdropFilter="blur(100px)"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </InputGroup>
    </Skeleton>
  );
};
