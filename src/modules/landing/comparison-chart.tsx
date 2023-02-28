import {
  Flex,
  Heading,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { IconCheck, IconX } from "@tabler/icons-react";

export const ComparisonChart = () => {
  return (
    <Flex as="section" justify="center" mt={16} pb={20}>
      <Stack maxWidth="1200px" w="full" px="4" spacing={16}>
        <VStack spacing={6}>
          <Heading
            fontSize={{ base: "4xl", xl: "6xl" }}
            textAlign="center"
            data-aos="fade"
            color="whiteAlpha.900"
          >
            So... What&apos;s the Catch?
          </Heading>
          <Text
            textAlign="center"
            color="gray.400"
            maxW="1000px"
            fontSize={{ base: "lg", xl: "xl" }}
            data-aos="fade"
          >
            Quizlet has the advantage of being a well-established platform with
            many existing sets, users and lots of data. If you already pay for
            Quizlet Plus, don&apos;t bother, for now at least.
          </Text>
        </VStack>
        <TableContainer data-aos="fade">
          <Table>
            <Thead>
              <Tr>
                <Th fontWeight={700} color="whiteAlpha.900" w="400px">
                  Feature
                </Th>
                <Th>Quizlet</Th>
                <Th>Quizlet Plus</Th>
                <Th color="blue.200">Quizlet.cc</Th>
              </Tr>
            </Thead>
            <Tbody color="whiteAlpha.900">
              <Tr>
                <Td>Study sets</Td>
                <Td>
                  <IconCheck />
                </Td>
                <Td>
                  <IconCheck />
                </Td>
                <Td>
                  <IconCheck />
                </Td>
              </Tr>
              <Tr>
                <Td>Flashcards</Td>
                <Td>With ads</Td>
                <Td>
                  <IconCheck />
                </Td>
                <Td>
                  <IconCheck />
                </Td>
              </Tr>
              <Tr>
                <Td>Folders</Td>
                <Td>
                  <IconCheck />
                </Td>
                <Td>
                  <IconCheck />
                </Td>
                <Td>
                  <IconCheck />
                </Td>
              </Tr>
              <Tr>
                <Td>Learn</Td>
                <Td>
                  <IconX />
                </Td>
                <Td>
                  <IconCheck />
                </Td>
                <Td>
                  <IconCheck />
                </Td>
              </Tr>
              <Tr>
                <Td>Smart autocompletion</Td>
                <Td>
                  <IconCheck />
                </Td>
                <Td>
                  <IconCheck />
                </Td>
                <Td>
                  <IconX />
                </Td>
              </Tr>
              <Tr>
                <Td>Custom images</Td>
                <Td>
                  <IconX />
                </Td>
                <Td>
                  <IconCheck />
                </Td>
                <Td>Coming soon</Td>
              </Tr>
              <Tr>
                <Td>Test</Td>
                <Td>1 free</Td>
                <Td>
                  <IconCheck />
                </Td>
                <Td>Coming soon</Td>
              </Tr>
              <Tr>
                <Td>Match</Td>
                <Td>
                  <IconCheck />
                </Td>
                <Td>
                  <IconCheck />
                </Td>
                <Td>Coming soon</Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </Stack>
    </Flex>
  );
};
