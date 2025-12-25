"use client";

import useAuthGuard from "../hooks/useAuthGuard";
import FullScreenLoader from "../UI/fullScreenLoader";

export default function ProtectedLayout({ children }) {
  const { checking } = useAuthGuard();

  if (checking) {
    return <FullScreenLoader />;
  }

  return <>{children}</>;
}
