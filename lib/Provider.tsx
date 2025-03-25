"use client";
import { SessionProvider } from "next-auth/react";
import { Toaster } from 'react-hot-toast';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={5 * 60}>
      {children}
      <Toaster position="top-center" />
    </SessionProvider>
  );
}