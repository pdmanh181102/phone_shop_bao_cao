"use client";

import { AuthStorage } from "@/uitl/auth_storage";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const userId = AuthStorage.getAccountUid();
    if (!userId) {
      router.replace("/login");
    }
  }, [router]);

  return <>{children}</>;
}
