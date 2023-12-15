import React from "react";

import {
  Box,
  Flex,
  HStack,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
} from "@chakra-ui/react";

import { IconCopy } from "@tabler/icons-react";

import { GhostGroup } from "../../../components/ghost-group";
import { useClass } from "../../../hooks/use-class";
import { SectionSelect } from "../section-select";

export const InviteBanner = () => {
  const { data: class_ } = useClass();

  const [selectedSection, setSection] = React.useState<string>(
    class_!.sections![0]!.id,
  );

  return (
    <Box
      w="full"
      rounded="xl"
      p="8"
      borderWidth="2px"
      borderColor="gray.200"
      bg="white"
      shadow="lg"
      _dark={{ borderColor: "gray.750", bg: "gray.800" }}
    >
      <Flex
        justifyContent="space-between"
        flexDir={{
          base: "column",
          md: "row",
        }}
      >
        <Stack spacing="8">
          <HStack spacing="6" flexDir={{ base: "column", sm: "row" }}>
            <Box w="max-content">
              <GhostGroup />
            </Box>
            <Stack spacing="1">
              <Heading
                fontSize="lg"
                fontWeight={600}
                color="gray.800"
                _dark={{
                  color: "gray.200",
                }}
              >
                It&apos;s looking a little lonely in here...
              </Heading>
              <Text fontSize="sm" color="gray.500">
                Invite your students to join this class to get started.
              </Text>
              <HStack spacing="3" mt="4">
                <Box color="inherit" w="160px" minW="160px">
                  <SectionSelect
                    size="sm"
                    sections={class_?.sections || []}
                    onChange={(s) => {
                      setSection(s);
                    }}
                    value={selectedSection}
                  />
                </Box>
                <InputGroup>
                  <Input size="sm" />
                  <InputRightElement boxSize="32px">
                    <IconButton
                      rounded="md"
                      colorScheme="gray"
                      aria-label="Search database"
                      variant="ghost"
                      icon={<IconCopy size={16} />}
                      size="xs"
                    />
                  </InputRightElement>
                </InputGroup>
              </HStack>
            </Stack>
          </HStack>
        </Stack>
        <Flex
          maxH="112px"
          flex={{ base: undefined, md: 1 }}
          justifyContent={{ base: "start", md: "end" }}
          h={{ base: "112px", md: undefined }}
          mt={{ base: 4, md: 0 }}
        >
          <Box aspectRatio="1 / 1" rounded="md" bg="gray.200" h="full" />
        </Flex>
      </Flex>
    </Box>
  );
};
