import dynamic from "next/dynamic";

import TopLoadingBar from "../common/top-loading-bar";
import { PhotoViewProvider } from "../components/photo-view/provider";

const OnboardingRedirect = dynamic(
  () => import("../common/onboarding-redirect"),
  { ssr: false },
);
const GlobalShortcutLayer = dynamic(
  () => import("../components/global-shortcut-layer"),
  { ssr: false },
);
const SignupModal = dynamic(() => import("../components/signup-modal"), {
  ssr: false,
});
const CreateClassNotice = dynamic(
  () => import("../components/create-class-notice"),
  {
    ssr: false,
  },
);
const ConfettiLayer = dynamic(() => import("../components/confetti-layer"), {
  ssr: false,
});

const Navbar = dynamic(() =>
  import("../components/navbar").then((mod) => mod.Navbar),
);

export const MainLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <>
      <TopLoadingBar />
      <div style={{ height: 80 }}>
        <Navbar />
      </div>
      <OnboardingRedirect />
      <GlobalShortcutLayer />
      <SignupModal />
      <CreateClassNotice />
      <ConfettiLayer />
      <PhotoViewProvider>{children}</PhotoViewProvider>
    </>
  );
};

export const getLayout = (page: React.ReactElement) => (
  <MainLayout>{page}</MainLayout>
);
