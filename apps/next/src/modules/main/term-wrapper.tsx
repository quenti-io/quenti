import { useInView } from "framer-motion";
import React from "react";

import type { FacingTerm } from "@quenti/interfaces";

import { Box } from "@chakra-ui/react";

import { DeloadedTerm } from "./deloaded-term";
import { DisplayableTermPure } from "./displayable-term";

interface TermWrapperProps {
  term: FacingTerm;
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
