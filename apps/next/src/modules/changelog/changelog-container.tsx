import React from "react";
import { ChangelogModal } from "./changelog-modal";
import { menuEventChannel } from "../../events/menu";
import { useSession } from "next-auth/react";
import { api } from "../../utils/api";

export default function ChangelogContainer() {
  const { data } = useSession();
  const [open, setOpen] = React.useState(false);
  const viewChangelog = api.user.viewChangelog.useMutation();

  React.useEffect(() => {
    if (data?.user?.changelogVersion != data?.version) {
      setTimeout(() => {
        setOpen(true);
        viewChangelog.mutate();

        const event = new Event("visibilitychange");
        document.dispatchEvent(event);
      }, 2000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  React.useEffect(() => {
    const open = () => setOpen(true);

    menuEventChannel.on("openChangelog", open);
    return () => {
      menuEventChannel.off("openChangelog", open);
    };
  }, []);

  return <ChangelogModal isOpen={open} onClose={() => setOpen(false)} />;
}
