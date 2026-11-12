import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-w-half flex-col items-center justify-center gap-4 bg-white p-2 pb-10 m-10 rounded-4xl">
      <Image
        src="/logo.png"
        alt="Logo"
        width={300}
        height={300}
      />
      <a
        href="/login"
        className="rounded-full border border-transparent bg-black px-8 py-3 font-medium text-white transition-colors hover:bg-gray-800"
      >
        Login
      </a>
      <a
        href="/signup"
        className="gradient-border rounded-full px-8 py-3 font-medium"
      >
        Sign Up
      </a>
    </main>
  );
}
