import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { IconMoon, IconSun, IconUser } from "@tabler/icons";
import { IconButton } from "./icon-button";

export const Navbar: React.FC = () => {
  const { data: session, status } = useSession();

  return (
    <header className="flex h-20 w-full items-center">
      <div className="container">
        <nav className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Quizlet.cc</h3>
          <div className="flex gap-4">
            {session?.user ? (
              <div className="flex gap-6">
                <div className="flex items-center gap-3 text-lg font-semibold">
                  <Image
                    width={24}
                    height={24}
                    alt="Profile picture"
                    src={session.user.image!}
                    className="rounded-full"
                  />
                  {session.user.name}
                </div>
                <button
                  className="default-button"
                  onClick={() => void signOut()}
                >
                  Sign out
                </button>
              </div>
            ) : status == "unauthenticated" ? (
              <IconButton
                icon={IconUser}
                label="Sign in"
                onClick={() => void signIn()}
              />
            ) : (
              ""
            )}
            <div className="flex items-center">
              <ThemeToggle />
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

const ThemeToggle: React.FC = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const buttonCss =
    "border-r border-slate-300 p-2 aria-selected:bg-slate-250 dark:border-slate-700 dark:aria-selected:bg-slate-750 hover:bg-slate-250 dark:hover:bg-slate-750";

  if (!mounted) return <></>;
  return (
    <div className="flex rounded-md shadow-sm outline outline-1 outline-slate-300 dark:outline-slate-700">
      <button
        className={`${buttonCss} rounded-l-md`}
        aria-selected={resolvedTheme === "light"}
        onClick={() => setTheme("light")}
      >
        <IconSun />
      </button>
      <button
        className={`${buttonCss} rounded-r-md`}
        aria-selected={resolvedTheme === "dark"}
        onClick={() => setTheme("dark")}
      >
        <IconMoon />
      </button>
    </div>
  );
};
