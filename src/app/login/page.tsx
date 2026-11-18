import PublicShell from '@/app/public-shell';
import AuthForm from '@/app/auth-form';

export default function Login() {
  return (
    <PublicShell>
      <AuthForm mode="login" />
    </PublicShell>
  );
}
