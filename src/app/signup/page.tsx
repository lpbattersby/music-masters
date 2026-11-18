import PublicShell from "@/app/public-shell";
import AuthForm from "@/app/auth-form";

export default function SignUp() {
  return (
    <PublicShell>
      <AuthForm mode="signup" />
    </PublicShell>
  );
}
