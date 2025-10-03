"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HouseCreateRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to admin create page
    router.replace("/admin/houses/create");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">กำลังเปลี่ยนเส้นทาง...</p>
      </div>
    </div>
  );
}