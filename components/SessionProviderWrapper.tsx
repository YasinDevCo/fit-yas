"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import type { ReactNode } from "react";
import { ReduxProvider } from "@/app/provider";

export default function SessionProviderWrapper({
  children,
  session,
}: {
  children: ReactNode;
  session?: Session | null;
}) {
  return (
    <ReduxProvider>
      <SessionProvider session={session}>{children}</SessionProvider>
    </ReduxProvider>
  );
}
