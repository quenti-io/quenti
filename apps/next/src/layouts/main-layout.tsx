import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React from "react";
import LoadingBar, { type LoadingBarRef } from "react-top-loading-bar";

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
  const barRef = React.useRef<LoadingBarRef>(null);
  const router = useRouter();

  React.useEffect(() => {
    router.events.on("routeChangeStart", () => {
      barRef.current?.continuousStart(20, 750);
    });
    router.events.on("routeChangeComplete", () => {
      barRef.current?.complete();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <LoadingBar
        ref={barRef}
        color="#ffa54c"
        height={3}
        waitingTime={500}
        transitionTime={500}
      />
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
