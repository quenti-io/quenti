import Link from "next/link";

import { SUPPORT_EMAIL } from "@quenti/lib/constants/email";

import {
  Box,
  Button,
  Center,
  HStack,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";

import { FrameLogo } from "./frame-logo";
import { HeadSeo } from "./head-seo";

export interface NotFoundPageProps {
  navbarHeight: number;
  ignoreMargin?: boolean;
  bgHsl?: string;
  darkBgHsl?: string;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  navbarHeight,
  ignoreMargin = false,
  bgHsl = "0, 0%, 100%",
  darkBgHsl = "230, 21%, 11%",
}) => {
  return (
    <Center
      w="full"
      h={`calc(100vh - ${navbarHeight * 2}px)`}
      mt={!ignoreMargin ? `${navbarHeight}px` : undefined}
      px="6"
      pb="8"
      textAlign="center"
      overflow="hidden"
    >
      <HeadSeo
        title="Not Found"
        nextSeoProps={{
          noindex: true,
          nofollow: true,
        }}
      />
      <VStack spacing="16">
        <Box
          color="gray.200"
          _dark={{
            color: "gray.300",
          }}
          position="relative"
        >
          <Box
            position="absolute"
            top="0"
            left="0"
            filter="blur(20px)"
            color="gray.100"
            _dark={{
              color: "gray.500",
            }}
            zIndex={-1}
          >
            <FrameLogo width={60} height={60} />
          </Box>
          <FrameLogo width={60} height={60} />
        </Box>
        <VStack
          mt="-24"
          position="relative"
          bg={`hsl(${bgHsl})`}
          _dark={{
            bg: `hsl(${darkBgHsl})`,
          }}
          spacing="8"
        >
          <Box
            w="full"
            position="absolute"
            top="-150px"
            height="150px"
            backgroundImage={`
              linear-gradient(
                to top,
                hsl(${bgHsl}) 0%,
                hsla(${bgHsl}, 0.987) 8.1%,
                hsla(${bgHsl}, 0.951) 15.5%,
                hsla(${bgHsl}, 0.896) 22.5%,
                hsla(${bgHsl}, 0.825) 29%,
                hsla(${bgHsl}, 0.741) 35.3%,
                hsla(${bgHsl}, 0.648) 41.2%,
                hsla(${bgHsl}, 0.55) 47.1%,
                hsla(${bgHsl}, 0.45) 52.9%,
                hsla(${bgHsl}, 0.352) 58.8%,
                hsla(${bgHsl}, 0.259) 64.7%,
                hsla(${bgHsl}, 0.175) 71%,
                hsla(${bgHsl}, 0.104) 77.5%,
                hsla(${bgHsl}, 0.049) 84.5%,
                hsla(${bgHsl}, 0.013) 91.9%,
                hsla(${bgHsl}, 0) 100%
              )
            `}
            _dark={{
              backgroundImage: `
              linear-gradient(
                to top,
                hsl(${darkBgHsl}) 0%,
                hsla(${darkBgHsl}, 0.987) 8.1%,
                hsla(${darkBgHsl}, 0.951) 15.5%,
                hsla(${darkBgHsl}, 0.896) 22.5%,
                hsla(${darkBgHsl}, 0.825) 29%,
                hsla(${darkBgHsl}, 0.741) 35.3%,
                hsla(${darkBgHsl}, 0.648) 41.2%,
                hsla(${darkBgHsl}, 0.55) 47.1%,
                hsla(${darkBgHsl}, 0.45) 52.9%,
                hsla(${darkBgHsl}, 0.352) 58.8%,
                hsla(${darkBgHsl}, 0.259) 64.7%,
                hsla(${darkBgHsl}, 0.175) 71%,
                hsla(${darkBgHsl}, 0.104) 77.5%,
                hsla(${darkBgHsl}, 0.049) 84.5%,
                hsla(${darkBgHsl}, 0.013) 91.9%,
                hsla(${darkBgHsl}, 0) 100%
              )
            `,
            }}
          />
          <Heading
            color="gray.800"
            _dark={{
              color: "gray.200",
            }}
            size="4xl"
            fontWeight={700}
            maxW="xl"
            textAlign="center"
          >
            Looks like you&apos;ve been ghosted.
          </Heading>
          <HStack
            spacing="3"
            flexDir={{
              base: "column",
              sm: "row",
            }}
            color="gray.600"
            _dark={{
              color: "gray.400",
            }}
          >
            <Text
              fontSize="lg"
              fontWeight={600}
              fontFamily="mono"
              letterSpacing={1.25}
            >
              404
            </Text>
            <Box
              w="2px"
              h="20px"
              bg="gray.300"
              display={{
                base: "none",
                sm: "inherit",
              }}
              _dark={{
                bg: "gray.600",
              }}
              rounded="full"
            />
            <Text fontSize="lg" fontWeight={500}>
              The page you&apos;re looking for doesn&apos;t exist.
            </Text>
          </HStack>
          <HStack mt={{ base: 0, sm: "8" }}>
            <Button as={Link} href="/" variant="ghost" colorScheme="gray">
              Home
            </Button>
            <Button
              as={Link}
              href="https://status.quenti.io"
              variant="ghost"
              colorScheme="gray"
            >
              System status
            </Button>
            <Button
              as={Link}
              href={`mailto:${SUPPORT_EMAIL}`}
              variant="ghost"
              colorScheme="gray"
            >
              Support
            </Button>
          </HStack>
        </VStack>
      </VStack>
    </Center>
  );
};
