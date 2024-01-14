import React from "react";

import type { Widen } from "@quenti/lib/widen";
import type { RouterOutputs } from "@quenti/trpc";

import { FolderContext } from "../modules/hydrate-folder-data";
import type { AuthedData } from "../modules/hydrate-set-data";
import { SetContext } from "../modules/hydrate-set-data";

type SetData = RouterOutputs["studySets"]["byId"];
type FolderData = RouterOutputs["folders"]["get"];

type SetFolderIntersection = Widen<SetData | FolderData> & {
  entityType: "set" | "folder";
};

export const useSetFolderUnison = (authed?: boolean) => {
  const _set = React.useContext(SetContext)?.data;
  const set = authed ? (_set as AuthedData) : _set;
  const folder = React.useContext(FolderContext);

  const _data = set ?? folder;
  const data = {
    ..._data,
    entityType: set ? "set" : "folder",
  } as SetFolderIntersection;

  if (!data) throw new Error("Missing either Set or Folder contexts in tree!");

  return data;
};
