import { SimpleGrid } from "@chakra-ui/react";

import { IconCards } from "@tabler/icons-react";

import { Linkable } from "../link-area";

export const LinkAreaSkeleton = () => {
  return (
    <SimpleGrid
      spacing="4"
      w={{ base: "full", lg: "160px" }}
      h="max-content"
      columns={{ base: 2, md: 3, lg: 1 }}
    >
      {["Learn", "Flashcards", "Test", "Match", "Crossword", "Gravity"].map(
        (name, i) => (
          <Linkable key={i} name={name} href="" icon={<IconCards />} skeleton />
        ),
      )}
    </SimpleGrid>
  );
};
