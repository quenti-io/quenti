import { useRouter } from "next/router";
import { AuthLayout } from "../../components/auth-layout";

export default function Login() {
  const router = useRouter();

  return (
    <AuthLayout
      mode="login"
      onUserExists={() => {
        void router.push("/home");
      }}
    />
  )
}
