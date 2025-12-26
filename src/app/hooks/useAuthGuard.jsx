"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { verifyToken } from "../../../lib/user/verifyToken";
import { clearToken, getToken } from "../../../lib/getToken";

export default function useAuthGuard(options) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const res = await verifyToken();

        if (!res.valid) {
          throw new Error("Invalid token");
        }

        // 🔐 admin-only
        if (options?.requireAdmin && !res.is_admin) {
          router.replace("/login");
          return;
        }
      } catch (err) {
        clearToken();
        router.replace("/login");
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, [router, options]);

  return { checking };
}
