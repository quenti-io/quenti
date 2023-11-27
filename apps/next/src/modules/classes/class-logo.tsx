import Image from "next/image";
import React from "react";
import { thumbHashToDataURL } from "thumbhash";

import { decodeBase64 } from "@quenti/lib/bytes";

import { Box, Center } from "@chakra-ui/react";

import { IconSchool } from "@tabler/icons-react";

import { square } from "../../common/cdn-loaders";

export interface ClassLogoProps {
  url?: string | null;
  hash?: string | null;
  width: number;
  height: number;
  local?: boolean;
}

export const ClassLogo: React.FC<ClassLogoProps> = ({
  url,
  hash,
  width,
  height,
  local = false,
}) => {
  const Logo = ({ src }: { src: string }) => (
    <Box
      style={{
        width,
        height,
        position: "relative",
      }}
    >
      <Image
        src={src}
        alt="Class logo"
        loader={!local ? square : undefined}
        width={!local ? width : undefined}
        height={!local ? height : undefined}
        fill={local}
        blurDataURL={
          hash
            ? thumbHashToDataURL(new Uint8Array(decodeBase64(hash)))
            : undefined
        }
        placeholder={hash ? "blur" : undefined}
        style={{
          objectFit: "cover",
        }}
      />
    </Box>
  );

  if (url) return <Logo src={url} />;

  return (
    <Center
      style={{
        width,
        height,
      }}
      bg="white"
    >
      <Box color="gray.900">
        <IconSchool size={32} />
      </Box>
    </Center>
  );
};
