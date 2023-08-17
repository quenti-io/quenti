import dynamic from "next/dynamic";

import { Navbar } from "../components/navbar";

const GlobalShortcutLayer = dynamic(
  () => import("../components/global-shortcut-layer"),
  { ssr: false },
);
const ChangelogContainer = dynamic(
  () => import("../modules/changelog/changelog-container"),
  { ssr: false },
);
const SignupModal = dynamic(() => import("../components/signup-modal"), {
  ssr: false,
});

export const MainLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Navbar />
      <GlobalShortcutLayer />
      <SignupModal />
      <ChangelogContainer />
      {children}
    </>
  );
};

export const getLayout = (page: React.ReactElement) => (
  <MainLayout>{page}</MainLayout>
);
