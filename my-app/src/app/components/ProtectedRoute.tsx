// src/app/components/ProtectedRoute.tsx
"use client";

import React, { ReactNode, useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles = [],
}: ProtectedRouteProps) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (
      !user ||
      (allowedRoles.length > 0 && !allowedRoles.includes(user.role))
    ) {
      router.push("/unauthorized");
    }
  }, [user, allowedRoles, router]);

  if (!user || (allowedRoles.length > 0 && !allowedRoles.includes(user.role))) {
    return <div>Unauthorized</div>;
  }
  return <>{children}</>;
}
