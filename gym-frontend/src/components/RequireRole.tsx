import React from "react";
import { useAuth } from "../features/auth/AuthContext";

type Role = "ADMIN" | "RECEPTION" | "TRAINER" | "MEMBER";

export function RequireRole({
  roles,
  children,
}: {
  roles?: Role[];
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  if (!user) return null;
  const role = String(user.role || "").toUpperCase() as Role;

  // If no roles specified -> visible to all authenticated users
  if (!roles || roles.length === 0) return <>{children}</>;

  // ADMIN can do anything
  if (role === "ADMIN") return <>{children}</>;

  return roles.includes(role) ? <>{children}</> : (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div className="text-2xl font-semibold">Access Denied</div>
      <p className="text-slate-500">You need admin privileges to access this page.</p>
    </div>
  );
}

export default RequireRole;
