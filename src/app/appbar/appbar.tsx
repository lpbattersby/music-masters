"use client";

import { AlbumOutlined } from "@mui/icons-material";
import Link from "next/link";
import ProfileMenu from "./profile-menu";

export default function MMAppBar() {
  return (
    <header className="mx-auto flex w-[calc(100%-48px)] max-w-240 items-center justify-between border-b border-outline py-5.5 min-[481px]:py-7">
      <Link
        href="/dashboard"
        aria-label="Music Masters Dashboard"
        className="flex items-center gap-3"
      >
        <AlbumOutlined sx={{ color: "primary.main", fontSize: 46 }} />
        <span className="font-display text-2xl leading-[.9] font-black tracking-tight">
          Music
          <br />
          Masters<span className="text-brand">.</span>
        </span>
      </Link>
      <ProfileMenu />
    </header>
  );
}
