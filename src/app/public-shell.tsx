import type { ReactNode } from "react";
import Link from "next/link";
import Paper from "@mui/material/Paper";

export default function PublicShell({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto grid w-[calc(100%-48px)] max-w-110 grid-cols-1 items-center gap-6 pt-6 pb-16 min-[701px]:max-w-240 min-[701px]:grid-cols-2 min-[701px]:gap-10 min-[701px]:pt-10">
      <Link
        href="/"
        className="col-span-full w-fit font-display text-[28px] font-bold tracking-tight"
        aria-label="Music Masters home"
      >
        Music Masters<span className="text-brand">.</span>
      </Link>
      <div
        className="relative min-h-34 overflow-hidden rounded-[80px_80px_16px_16px] bg-blue min-[701px]:min-h-107.5 min-[701px]:rounded-[160px_160px_20px_20px]"
        aria-hidden="true"
      >
        <span className="public-art-stripes absolute bottom-2.5 h-16.5 w-full min-[701px]:bottom-7 min-[701px]:h-27.5" />
        <span className="vinyl-record -top-4 right-6 size-42.5 min-[701px]:top-11 min-[701px]:-right-10 min-[701px]:size-80">
          <span />
        </span>
      </div>
      <Paper
        elevation={0}
        className="gradient-border"
        sx={{ p: { xs: 3, md: 4 } }}
      >
        {children}
      </Paper>
    </main>
  );
}
