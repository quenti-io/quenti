import {
  Box,
  type BoxProps,
  Center,
  GridItem,
  type GridItemProps,
  HStack,
  Heading,
  SimpleGrid,
} from "@chakra-ui/react";

import { IconPhotoPlus } from "@tabler/icons-react";

import { NewsCard } from "../../news-card";
import { CreateCta } from "../common/create-cta";

export const Images = () => {
  return (
    <GridItem>
      <NewsCard
        title={
          <HStack>
            <Heading size="md">Images have arrived</Heading>
          </HStack>
        }
        description="Add images to terms from Unsplash or upload your own."
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
            <SimpleGrid columns={5} w="200px" gap="6px">
              <GridItem colSpan={2} aspectRatio="1 / 1" position="relative">
                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  w="full"
                  h="full"
                  bgGradient="linear(to-tr, blue.300, purple.200)"
                  zIndex={10}
                  rounded="md"
                  filter="blur(8px)"
                  opacity={0.4}
                />
                <Center
                  bgGradient="linear(to-tr, blue.300, purple.200)"
                  w="full"
                  h="full"
                  rounded="md"
                  color="white"
                  position="relative"
                  zIndex={15}
                >
                  <IconPhotoPlus size={40} />
                </Center>
              </GridItem>
              <DoubleWrapper opacity={0.9}>
                <Cell bgGradient="linear(to-tr, blue.200, blue.100)" />
                <Cell bgGradient="linear(to-tr, orange.100, red.100)" />
              </DoubleWrapper>
              <DoubleWrapper opacity={0.7}>
                <Cell bgGradient="linear(to-tr, purple.200, purple.100)" />
                <Cell bgGradient="linear(to-tr, blue.100, cyan.100)" />
              </DoubleWrapper>
              <DoubleWrapper opacity={0.5}>
                <Cell bgGradient="linear(to-tr, pink.200, pink.100)" />
                <Cell bgGradient="linear(to-tr, red.100, orange.100)" />
              </DoubleWrapper>
            </SimpleGrid>
          </Center>
        }
      />
    </GridItem>
  );
};

const DoubleWrapper: React.FC<GridItemProps> = ({ children, ...props }) => {
  return (
    <GridItem {...props}>
      <SimpleGrid h="full" gap="6px">
        {children}
      </SimpleGrid>
    </GridItem>
  );
};

const Cell: React.FC<BoxProps> = (props) => {
  return (
    <GridItem aspectRatio="1 / 1">
      <Box bg="blue.100" w="full" h="full" rounded="md" {...props} />
    </GridItem>
  );
};
