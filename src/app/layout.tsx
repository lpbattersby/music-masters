import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Providers from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Music Masters",
  description: "Music Masters",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={geistSans.variable + " flex items-center justify-center"}>
      <body className="min-h-screen w-full flex flex-col items-center">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
