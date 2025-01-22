import type { Metadata } from "next";
import { Poppins } from 'next/font/google';
import "./globals.css";
import { Header } from "./components/header";

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
      <body className={`bg-gradient-to-b from-white to-gray-300 ${poppins.className}`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
