"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import AdminSkeleton from "./AdminSkeleton";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  // Reset redirect flag when user changes
  useEffect(() => {
    setHasRedirected(false);
  }, [user?.id, isAuthenticated]);

  // Handle initial load state
  useEffect(() => {
    if (!loading) {
      setIsInitialLoad(false);
    }
  }, [loading]);

  useEffect(() => {
    console.log("AdminLayout useEffect:", {
      loading,
      isAuthenticated,
      user: user ? { role: user.role, email: user.email } : null,
      hasRedirected,
      isInitialLoad,
    });

    // Don't redirect if already redirected or still loading
    if (loading || hasRedirected) {
      return;
    }

    if (!isAuthenticated || !user) {
      console.log("Not authenticated or no user, redirecting to login");
      setHasRedirected(true);
      router.replace("/login");
      return;
    }

    if (user.role !== "ADMIN") {
      console.log("Not admin user, role:", user.role, "redirecting to home");
      setHasRedirected(true);
      router.replace("/");
      return;
    }

    console.log("Admin access granted for user:", user?.email || "no user");
  }, [user, loading, isAuthenticated, router, hasRedirected, isInitialLoad]);

  // Show skeleton loading while checking authentication (only on initial load)
  if (loading && isInitialLoad) {
    return <AdminSkeleton />;
  }

  // Show loading if redirecting
  if (hasRedirected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">กำลังเปลี่ยนหน้า...</p>
        </div>
      </div>
    );
  }

  // Show loading if not authenticated or not admin (but not on subsequent loads)
  if ((!isAuthenticated || !user || user.role !== "ADMIN") && isInitialLoad) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">กำลังตรวจสอบสิทธิ์...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative flex w-full max-w-xs sm:max-w-sm flex-1 flex-col">
            <AdminSidebar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto bg-background p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
