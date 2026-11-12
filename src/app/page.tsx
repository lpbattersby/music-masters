import Image from "next/image";

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
      <a
        href="/login"
        className="rounded-full border border-transparent bg-black px-8 py-3 font-medium text-white transition-colors hover:bg-gray-800 shadow-xl"
      >
        Login
      </a>
      <a
        href="/signup"
        className="gradient-border rounded-full px-8 py-3 font-medium shadow-xl"
      >
        Sign Up
      </a>
    </main>
  );
}
