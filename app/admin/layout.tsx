"use client";

import AdminSidebar from "@/app/component/AdminSidebar";
import { useEffect } from "react";
import { getCookie } from "cookies-next";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/admin") return;
    const token = getCookie("session");
    if (!token) {
      router.push("/admin");
    }
  }, [pathname]);

  if (pathname === "/admin") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen">
      <div className="hidden md:block">
        <AdminSidebar />
      </div>
      <div className="md:hidden">
        <AdminSidebar />
      </div>
      <div className="md:ml-[280px] flex-1 mt-15 md:mt-0 p-4 md:p-8">
        {children}
      </div>
    </div>
  );
} 