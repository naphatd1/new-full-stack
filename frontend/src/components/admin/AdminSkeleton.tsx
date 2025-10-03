"use client";

import React from "react";

export default function AdminSkeleton() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Desktop Sidebar Skeleton */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
          <div className="p-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-6"></div>
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header Skeleton */}
        <div className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center px-6">
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="ml-auto flex space-x-3">
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Content Skeleton */}
        <main className="flex-1 overflow-y-auto bg-background p-6">
          <div className="space-y-6">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          </div>
        </main>
      </div>
    </div>
  );
}