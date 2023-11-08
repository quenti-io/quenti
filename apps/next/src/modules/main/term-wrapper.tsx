import { useInView } from "framer-motion";
import React from "react";

import type { Term } from "@quenti/prisma/client";

import { Box } from "@chakra-ui/react";

import { DeloadedTerm } from "./deloaded-term";
import { DisplayableTermPure } from "./displayable-term";

interface TermWrapperProps {
  term: Term;
  creator?: boolean;
}

export const TermWrapper: React.FC<TermWrapperProps> = ({ term, creator }) => {
  const innerRef = React.useRef<HTMLDivElement>(null);
  const inView = useInView(innerRef);

  return (
    <Box ref={innerRef}>
      {inView ? (
        <DisplayableTermPure term={term} />
      ) : (
        <DeloadedTerm term={term} creator={creator} />
      )}
    </Box>
  );
};
