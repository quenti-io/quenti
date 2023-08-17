import { useRouter } from "next/router";

import { PageWrapper } from "../../common/page-wrapper";
import { AuthLayout } from "../../components/auth-layout";

export default function Login() {
  const router = useRouter();

  return (
    <AuthLayout
      mode="login"
      onUserExists={(callback) => {
        void router.push(callback);
      }}
    />
  );
}

Login.PageWrapper = PageWrapper;
