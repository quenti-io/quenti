import React from "react";

import { Avatar, Popover, PopoverTrigger } from "@chakra-ui/react";

import { useSet } from "../../hooks/use-set";
import { CollaboratorPopoverContent } from "./collaborator-popover-content";

const TermAuthorAvatarRaw = ({ authorId }: { authorId: string }) => {
  const { collaborators } = useSet();
  if (!collaborators) return null;

  const collaborator = collaborators.find((c) => c.id == authorId);
  if (!collaborator) return null;

  return (
    <Popover isLazy trigger="hover" placement="top">
      <PopoverTrigger>
        <Avatar size="xs" src={collaborator.image || ""} />
      </PopoverTrigger>
      <CollaboratorPopoverContent
        type="collaborator"
        user={{
          ...collaborator,
          username: collaborator.username!,
        }}
      />
    </Popover>
  );
};

export const TermAuthorAvatar = React.memo(TermAuthorAvatarRaw);
