import Image from "next/image";
import LoginForm from '@/app/login/login-form';

export default function Login() {
  return (
    <main className="flex min-w-half flex-col items-center justify-center gap-4 bg-white p-2 pb-10 m-5 rounded-4xl max-w-md">
      <Image
        src="/logo.png"
        alt="Logo"
        width={300}
        height={300}
        loading="eager"
      />
      <LoginForm />
    </main>
  );
}
