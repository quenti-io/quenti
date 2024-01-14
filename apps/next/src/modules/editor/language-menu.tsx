import React from "react";

import { type Language, languages } from "@quenti/core";

import {
  Box,
  Center,
  Divider,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Popover,
  PopoverBody,
  PopoverContent,
  Stack,
  Text,
  VStack,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  IconCheck,
  IconHelpHexagon,
  IconHexagons,
  IconLanguage,
  IconSearch,
  IconVariable,
} from "@tabler/icons-react";

const topLanguages: Language[] = [
  "en",
  "es",
  "fr",
  "de",
  "it",
  "pt",
  "ru",
  "ja",
  "zh_cn",
];
const specialLanguages: Language[] = ["chem", "math", "unknown"];

export interface LanguageMenuProps {
  isOpen: boolean;
  onClose: () => void;
  selected: Language;
  onChange: (l: Language) => void;
  isLazy?: boolean;
}

export const LanguageMenuWrapper: React.FC<
  React.PropsWithChildren<LanguageMenuProps>
> = ({ isOpen, onClose, selected, onChange, isLazy, children }) => {
  const allLanguages = Object.entries(languages) as [Language, string][];
  const [query, setQuery] = React.useState("");

  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  function filterFn<T extends { name: string }>(item: T) {
    const q = query.toLowerCase();
    return item.name.toLowerCase().includes(q);
  }

  const topLanguagesGroup = topLanguages
    .map((l) => ({
      name: languages[l],
      value: l,
      isSelected: selected === l,
    }))
    .filter(filterFn);

  const specialLanguagesGroup = [
    {
      isSelected: selected === "chem",
      name: languages.chem,
      value: "chem" as const,
      icon: <IconHexagons size={18} />,
    },
    {
      isSelected: selected === "math",
      name: languages.math,
      value: "math" as const,
      icon: <IconVariable size={18} />,
    },
    {
      isSelected: selected === "unknown",
      name: languages.unknown,
      value: "unknown" as const,
      icon: <IconHelpHexagon size={18} />,
    },
  ].filter(filterFn);

  const allLanguagesGroup = allLanguages
    .filter(([k]) => !topLanguages.includes(k) && !specialLanguages.includes(k))
    .map(([value, name]) => ({
      name,
      value,
      isSelected: selected === value,
    }))
    .filter(filterFn);

  const allFiltered = allLanguages
    .map((x) => ({ name: x[1], value: x[0] }))
    .filter(filterFn);

  const onSelect = (l: Language) => {
    onChange(l);
    onClose();
  };

  const menuColor = useColorModeValue("white", "gray.750");
  const headerColor = useColorModeValue("gray.100", "gray.800");

  return (
    <Popover
      isOpen={isOpen}
      onOpen={() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            inputRef.current!.focus();
          });

          const elem = document.getElementById(`language-menu-opt-${selected}`);

          if (!elem) return;
          containerRef.current!.scrollTop = elem.offsetTop - 100;
        });
      }}
      onClose={onClose}
      initialFocusRef={inputRef}
      isLazy={isLazy}
    >
      {children}
      <PopoverContent
        bg={menuColor}
        rounded="lg"
        p="0"
        border="none"
        overflow="hidden"
        zIndex="30"
        shadow="xl"
        w="80"
      >
        <PopoverBody p="0">
          <Stack spacing={0}>
            <Box pt="2" bg={headerColor} shadow="lg">
              <InputGroup>
                <InputLeftElement color="gray.500" pl="2">
                  <IconSearch size={16} />
                </InputLeftElement>
                <Input
                  size="lg"
                  placeholder="Search languages..."
                  variant="flushed"
                  px="4"
                  pb="2"
                  value={query}
                  ref={inputRef}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && allFiltered.length == 1) {
                      onSelect(allFiltered[0]!.value);
                    }
                  }}
                />
              </InputGroup>
            </Box>
            <Box height={400} overflowY="scroll" ref={containerRef}>
              <LanguageGroupPure
                name="Top Languages"
                languagesProps={topLanguagesGroup}
                onSelect={onSelect}
              />
              <LanguageGroupPure
                name="Special Languages"
                languagesProps={specialLanguagesGroup}
                onSelect={onSelect}
              />
              <LanguageGroupPure
                name="All Languages"
                languagesProps={allLanguagesGroup}
                onSelect={onSelect}
              />
              {!allFiltered.length && (
                <Center w="full" h="full" color="gray.500">
                  <VStack>
                    <IconLanguage size="40" />
                    <Text>No languages found</Text>
                  </VStack>
                </Center>
              )}
            </Box>
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

interface LanguageGroup {
  name: string;
  languagesProps: LanguageItemProps[];
  onSelect?: (l: Language) => void;
}

const LanguageGroup: React.FC<LanguageGroup> = ({
  name,
  languagesProps,
  onSelect,
}) => {
  if (!languagesProps.length) return null;

  return (
    <React.Fragment>
      <Stack spacing={0}>
        <Box px="4" py="4">
          <Text fontSize="md" fontWeight={600} color="gray.500">
            {name}
          </Text>
        </Box>
        {languagesProps.map((l) => (
          <LanguageItemPure
            {...l}
            key={l.value}
            onClick={() => {
              onSelect?.(l.value);
            }}
          />
        ))}
      </Stack>
      <Divider mt="3" />
    </React.Fragment>
  );
};

const LanguageGroupPure = React.memo(LanguageGroup);

interface LanguageItemProps {
  isSelected: boolean;
  name: string;
  value: Language;
  icon?: React.ReactNode;
  onClick?: () => void;
}

const LanguageItem: React.FC<LanguageItemProps> = ({
  isSelected,
  name,
  value,
  icon,
  onClick,
}) => {
  const { colorMode } = useColorMode();
  const hoverColor = useColorModeValue("gray.100", "gray.700");
  const iconColor = useColorModeValue("gray.600", "gray.400");

  return React.useMemo(
    () => (
      <Box
        px="4"
        py="2"
        transition="background-color 0.1s ease-in-out"
        id={`language-menu-opt-${value}`}
        cursor="pointer"
        _hover={{
          bg: hoverColor,
        }}
        onClick={onClick}
      >
        <HStack>
          {isSelected ? (
            <Box color="orange.300">
              <IconCheck size="18" />
            </Box>
          ) : (
            <Box color={iconColor}>{icon}</Box>
          )}
          <Text fontWeight={isSelected ? 700 : undefined}>{name}</Text>
        </HStack>
      </Box>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isSelected, name, value, colorMode],
  );
};

const LanguageItemPure = React.memo(LanguageItem);
