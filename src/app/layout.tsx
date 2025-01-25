import type { Metadata } from "next";
import { Poppins } from 'next/font/google';
import "./globals.css";
import { Header } from "./(components)/header";
import { Toaster } from "@/components/ui/toaster";

const poppins = Poppins({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Speed Boletos",
  description: "Speed boletos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`bg-gradient-to-b from-gray-50 to-gray-150 ${poppins.className}`}>
        <Header />
        <Toaster />
        {children}
      </body>
    </html>
  );
}
