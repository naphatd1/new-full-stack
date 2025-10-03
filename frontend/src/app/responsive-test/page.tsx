'use client';

import ResponsiveExample from '@/components/examples/ResponsiveExample';

export default function ResponsiveTestPage() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Responsive Design Test
          </h1>
          <p className="text-muted-foreground text-lg">
            ทดสอบการแสดงผลแบบ responsive บนอุปกรณ์ต่างๆ
          </p>
        </div>
        
        <ResponsiveExample />
      </div>
    </div>
  );
}