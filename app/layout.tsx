import type { Metadata } from "next";
import localFont from "next/font/local";
import { Playfair_Display } from "next/font/google";
import BottomNav from "@/components/BottomNav";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "CineBook — Movie Ticket Booking",
  description: "Browse movies, pick showtimes, and select seats.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} antialiased`}
      >
        <div className="fixed inset-0 -z-10 bg-[#0b0b0d]">
          <div className="absolute -top-24 right-[-10%] h-72 w-72 rounded-full bg-brand/25 blur-[100px]" />
          <div className="absolute top-1/3 -left-24 h-80 w-80 rounded-full bg-brand/15 blur-[110px]" />
        </div>
        <div className="pb-20 lg:pb-0">{children}</div>
        <BottomNav />
      </body>
    </html>
  );
}
