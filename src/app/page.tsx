import PublicShell from "./public-shell";

export default function Home() {
  return (
    <PublicShell>
      <h1 className="public-title">Share music.<br />Vote together.</h1>
      <p className="mt-5 mb-7 text-[15px] leading-relaxed text-muted">Create a group, submit tracks and vote for your favourites.</p>
      <div className="flex flex-col gap-3.5">
      <a
        href="/login"
        className="rounded-full border-3 border-brown bg-brown px-6 py-3 text-center text-[15px] font-bold text-paper hover:border-rust hover:bg-rust"
      >
        Login
      </a>
      <a
        href="/signup"
        className="gradient-border rounded-full px-6 py-3 text-center text-[15px] font-bold hover:text-brand"
      >
        Sign Up
      </a>
      </div>
    </PublicShell>
  );
}
