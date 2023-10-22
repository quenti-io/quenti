import { useSession } from "next-auth/react";
import React from "react";

import { menuEventChannel } from "../events/menu";
import tinykeys from "../lib/tinykeys";
import { CommandMenu } from "./command-menu";

export default function GlobalShortcutLayer() {
  const [open, setOpen] = React.useState(false);
  const session = useSession();

  React.useEffect(() => {
    const unsub = tinykeys(window, {
      "$mod+k": (e) => {
        if (!session.data?.user) return;

        e.preventDefault();
        setOpen(!open);
      },
    });

    return () => {
      unsub();
    };
  }, [session.data?.user, setOpen, open]);

  return (
    <CommandMenu
      isOpen={open}
      onClose={() => {
        setOpen(false);
        menuEventChannel.emit("commandMenuClosed");
      }}
    />
  );
}
