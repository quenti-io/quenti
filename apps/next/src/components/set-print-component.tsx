import React from "react";

import { Box, Heading, Table, Td, Text, Tr } from "@chakra-ui/react";

import { useSet } from "../hooks/use-set";
import { plural } from "../utils/string";

export const SetPrintComponent = React.forwardRef<HTMLDivElement>(
  function SetPrint(_, ref) {
    const { title, terms } = useSet();

    return (
      <Box ref={ref}>
        <Box>
          <Box>
            <Heading>{title}</Heading>
            <Text fontSize="sm">{plural(terms.length, "term")}</Text>
          </Box>
          <Box className="print-container" style={{ margin: 0, padding: 0 }}>
            {terms.map((term) => (
              <>
                <div className="page-break" />
                <Box
                  p="4"
                  borderColor="gray.200"
                  className="no-break"
                  borderWidth="1px"
                  marginBottom="4"
                  key={term.id}
                >
                  <Table w="full">
                    <Tr>
                      <Td
                        w="50%"
                        borderRightColor="gray.200"
                        borderRightWidth="1px"
                      >
                        <Text w="full" whiteSpace="pre-wrap">
                          {term.word}
                        </Text>
                      </Td>
                      <Td w="50%">
                        <Text w="full" whiteSpace="pre-wrap">
                          {term.definition}
                        </Text>
                      </Td>
                    </Tr>
                  </Table>
                </Box>
              </>
            ))}
          </Box>
        </Box>
      </Box>
    );
  },
);
