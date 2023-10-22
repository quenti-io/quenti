import { useRouter } from "next/router";

import { SimpleGrid, Skeleton } from "@chakra-ui/react";

import { IconCards, IconLayersSubtract } from "@tabler/icons-react";

import { useFolder } from "../../hooks/use-folder";
import { Linkable } from "../main/link-area";

export const LinkArea = () => {
  const router = useRouter();
  const slug = router.query.slug as string;
  const folder = useFolder();

  const folderUrl = `/@${folder.user.username}/folders/${slug}`;

  return (
    <SimpleGrid
      spacing="4"
      w={{ base: "full", lg: "160px" }}
      h="max-content"
      columns={{ base: 2, md: 3, lg: 1 }}
    >
      <Linkable
        name="Flashcards"
        icon={<IconCards />}
        href={`${folderUrl}/flashcards`}
      />
      <Linkable
        name="Match"
        icon={<IconLayersSubtract />}
        href={`${folderUrl}/match`}
      />
    </SimpleGrid>
  );
};

LinkArea.Skeleton = function LinkAreaSkeleton() {
  return (
    <SimpleGrid
      spacing="4"
      w={{ base: "full", lg: "160px" }}
      h="max-content"
      columns={{ base: 2, md: 3, lg: 1 }}
    >
      {Array.from({ length: 2 }).map((_, i) => (
        <Skeleton key={i} rounded="xl" h="59px" />
      ))}
    </SimpleGrid>
  );
};
