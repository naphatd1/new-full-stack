'use client';

import React from 'react';

interface AdminDashboardOnlyLayoutProps {
  children: React.ReactNode;
}

export default function AdminDashboardOnlyLayout({ children }: AdminDashboardOnlyLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <main className="w-full">
        {children}
      </main>
    </div>
  );
}