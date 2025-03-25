import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "@/lib/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QuickShip - Your One-Stop Shop",
  description: "QuickShip is your one-stop shop for all your shopping needs. Find the best deals on products from trusted sellers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
