import NextLink, { type LinkProps as NextLinkProps } from "next/link";

import { chakra } from "@chakra-ui/react";

export const Link = chakra<typeof NextLink, NextLinkProps>(NextLink, {
  // ensure that you're forwarding all of the required props for your case
  shouldForwardProp: (prop) => ["href", "target", "children"].includes(prop),
});
