import { Button, ButtonGroup, Link } from "@chakra-ui/react";
import { IconCards, IconEdit } from "@tabler/icons-react";
import { useRouter } from "next/router";
import React from "react";
import { useFolder } from "../../hooks/use-folder";
import { EditFolderModal } from "./edit-folder-modal";
import { FolderCreatorOnly } from "./folder-creator-only";

export const ActionArea = () => {
  const router = useRouter();
  const slug = router.query.slug as string;
  const folder = useFolder();

  const [open, setOpen] = React.useState(false);

  return (
    <>
      <EditFolderModal isOpen={open} onClose={() => setOpen(false)} />
      <ButtonGroup size="lg" gap={2}>
        <Button
          leftIcon={<IconCards />}
          isDisabled={!folder.sets.length}
          as={Link}
          href={`/@${folder.user.username}/folders/${slug}/flashcards`}
        >
          Study
        </Button>
        <FolderCreatorOnly>
          <Button
            leftIcon={<IconEdit />}
            variant="ghost"
            colorScheme="orange"
            onClick={() => setOpen(true)}
          >
            Edit
          </Button>
        </FolderCreatorOnly>
      </ButtonGroup>
    </>
  );
};
