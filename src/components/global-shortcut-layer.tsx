import { useSession } from "next-auth/react";
import React from "react";
import { useShortcut } from "../hooks/use-shortcut";
import { CommandMenu } from "./command-menu";

export default function GlobalShortcutLayer() {
  const [open, setOpen] = React.useState(false);
  const session = useSession();

  useShortcut(["k"], () => {
    if (session.data?.user) setOpen(true);
  });

  return <CommandMenu isOpen={open} onClose={() => setOpen(false)} />;
}
