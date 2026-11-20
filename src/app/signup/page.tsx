import PublicShell from "@/app/public-shell";
import AuthForm from "@/app/form/auth-form";

export default function SignUp() {
  return (
    <PublicShell>
      <AuthForm mode="signup" />
    </PublicShell>
  );
}
