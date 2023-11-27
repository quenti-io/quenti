import { Box, Center, GridItem, HStack, Heading } from "@chakra-ui/react";

import {
  IconBold,
  IconCircle,
  IconItalic,
  IconStrikethrough,
  IconUnderline,
} from "@tabler/icons-react";

import { NewsCard } from "../../news-card";
import { CreateCta } from "../common/create-cta";

export const RichText = () => {
  return (
    <GridItem>
      <NewsCard
        title={
          <HStack>
            <Heading size="md">Rich text support</Heading>
          </HStack>
        }
        description="Bold, underline, italicize, and highlight text in different colors."
        cta={<CreateCta />}
        image={
          <Center overflow="hidden" w="full" h="full" position="relative">
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              w="100px"
              h="100px"
              rounded="full"
              bg="blue.300"
              filter="blur(60px)"
              zIndex={10}
            />
            <Box
              zIndex={10}
              rounded="full"
              p="1.5px"
              bgGradient="linear(to-r, blue.300 40%, purple.300 80%, purple.100)"
              position="relative"
            >
              <Box
                zIndex={8}
                position="absolute"
                rounded="full"
                bgGradient="linear(to-r, blue.300 40%, purple.300 80%, purple.100)"
                top="0"
                left="0"
                w="full"
                h="full"
                filter="blur(12px)"
                opacity={0.5}
              />
              <HStack
                zIndex={10}
                position="relative"
                rounded="full"
                bg="white"
                _dark={{
                  bg: "gray.800",
                }}
                px="10px"
                py="6px"
              >
                <IconBold size={16} />
                <IconItalic size={16} />
                <IconUnderline size={16} />
                <IconStrikethrough size={16} />
                <Box w="4" h="4" position="relative">
                  <IconCircle size={16} />
                  <Center
                    w="full"
                    h="full"
                    position="absolute"
                    top="0"
                    left="0"
                  >
                    <Box w="7px" h="7px" rounded="full" position="relative">
                      <Box
                        position="absolute"
                        w="full"
                        h="full"
                        rounded="full"
                        top="0"
                        left="0"
                        bg="conic-gradient(#FC8181, #F6AD55, #F6E05E, #68D391, #63B3ED)"
                      />
                    </Box>
                  </Center>
                </Box>
              </HStack>
            </Box>
          </Center>
        }
      />
    </GridItem>
  );
};
