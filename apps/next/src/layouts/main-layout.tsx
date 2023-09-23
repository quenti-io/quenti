import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React from "react";
import LoadingBar, { type LoadingBarRef } from "react-top-loading-bar";

import { effectChannel } from "../events/effects";
import { useOnboardingRedirect } from "../hooks/use-onboarding-redirect";

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
const ConfettiLayer = dynamic(() => import("../components/confetti-layer"), {
  ssr: false,
});

const Navbar = dynamic(() =>
  import("../components/navbar").then((mod) => mod.Navbar),
);

export const MainLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  useOnboardingRedirect();

  const barRef = React.useRef<LoadingBarRef>(null);
  const router = useRouter();

  const [confetti, setConfetti] = React.useState(false);

  React.useEffect(() => {
    const setPageRegexp = /^\/c([a-zA-Z0-9_-]{24})$/;

    router.events.on("routeChangeStart", (url) => {
      if (setPageRegexp.test(url as string))
        barRef.current?.continuousStart(20, 750);
    });
    router.events.on("routeChangeComplete", (url) => {
      if (setPageRegexp.test(url as string)) barRef.current?.complete();
    });

    const prepareConfetti = () => setConfetti(false);
    const handleConfetti = () => setConfetti(true);

    effectChannel.on("prepareConfetti", prepareConfetti);
    effectChannel.on("confetti", handleConfetti);
    return () => {
      effectChannel.off("prepareConfetti", prepareConfetti);
      effectChannel.off("confetti", handleConfetti);
    };
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
      <div style={{ height: 80 }}>
        <Navbar />
      </div>
      <GlobalShortcutLayer />
      <SignupModal />
      <ChangelogContainer />
      {confetti && <ConfettiLayer />}
      {children}
    </>
  );
};

export const getLayout = (page: React.ReactElement) => (
  <MainLayout>{page}</MainLayout>
);
