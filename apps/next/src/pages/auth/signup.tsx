import { AuthLayout } from "../../components/auth-layout";

export default function Signup() {
  return (
    <AuthLayout
      mode="signup"
      onUserExists={() => {
        // void router.push("/home");
      }}
    />
  )
}
