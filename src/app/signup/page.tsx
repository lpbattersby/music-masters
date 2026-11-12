import Image from "next/image";
import SignupForm from '@/app/signup/signup-form';

export default function Home() {
  return (
    <main className="gradient-border flex min-w-half flex-col items-center justify-center gap-4 bg-white p-2 pb-10 m-5 rounded-4xl max-w-md shadow-xl">
      <Image
        src="/logo.png"
        alt="Logo"
        width={300}
        height={300}
        loading="eager"
      />
      <SignupForm />
    </main>
  );
}
