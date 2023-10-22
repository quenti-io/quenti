import { useRouter } from "next/router";

import { PageWrapper } from "../../common/page-wrapper";
import { AuthLayout } from "../../components/auth-layout";

export default function Signup() {
  const router = useRouter();

  return (
    <AuthLayout
      mode="signup"
      onUserExists={(callback) => {
        void router.push(callback);
      }}
    />
  );
}

Signup.PageWrapper = PageWrapper;
