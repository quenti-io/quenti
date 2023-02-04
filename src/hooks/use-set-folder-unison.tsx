import React from "react";
import { FolderContext } from "../modules/hydrate-folder-data";
import { SetContext } from "../modules/hydrate-set-data";
import type { RouterOutputs } from "../utils/api";
import type { Widen } from "../utils/widen";

type SetData = RouterOutputs["studySets"]["byId"];
type FolderData = RouterOutputs["folders"]["get"];

type SetFolderIntersection = Widen<SetData | FolderData> & {
  type: "set" | "folder";
};

export const useSetFolderUnison = () => {
  const set = React.useContext(SetContext)?.data;
  const folder = React.useContext(FolderContext);

  const _data = set ?? folder;
  const data = {
    ..._data,
    type: set ? "set" : "folder",
  } as SetFolderIntersection;

  if (!data) throw new Error("Missing either Set or Folder contexts in tree!");

  return data;
};
