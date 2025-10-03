'use client'

import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAppSelector } from '@/store/hooks'
import { useState } from 'react'

export default function DemoPage() {
  const { theme, isDark } = useAppSelector((state) => state.theme)
  const [counter, setCounter] = useState(0)

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Demo Page</h1>
          <p className="text-muted-foreground">
            ทดสอบ Redux Toolkit + React Query + Dark Mode
          </p>
        </div>
        <ThemeToggle />
      </div>

      {/* Theme Status */}
      <Card>
        <CardHeader>
          <CardTitle>Theme Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Badge variant="outline">
              Current Theme: {theme}
            </Badge>
            <Badge variant={isDark ? 'default' : 'secondary'}>
              {isDark ? 'Dark Mode' : 'Light Mode'}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            ลองเปลี่ยน theme ด้วยปุ่มด้านบนเพื่อดูการทำงาน
          </p>
        </CardContent>
      </Card>

      {/* Redux Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Redux State Demo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => setCounter(counter + 1)}
              variant="default"
            >
              เพิ่ม Counter
            </Button>
            <Badge variant="success">
              Count: {counter}
            </Badge>
            <Button 
              onClick={() => setCounter(0)}
              variant="outline"
            >
              รีเซ็ต
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            ทดสอบ local state management
          </p>
        </CardContent>
      </Card>

      {/* UI Components Demo */}
      <Card>
        <CardHeader>
          <CardTitle>UI Components Demo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">Badge Variants</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="info">Info</Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold">Button Variants</h4>
            <div className="flex flex-wrap gap-2">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>วิธีใช้งาน</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">Redux Toolkit (Theme Management)</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>ใช้ useAppSelector เพื่อดึงข้อมูล theme state</li>
              <li>ใช้ useAppDispatch เพื่อ dispatch actions</li>
              <li>Theme จะถูกเก็บใน localStorage อัตโนมัติ</li>
              <li>รองรับ system theme detection</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold">React Query (Data Fetching)</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>พร้อมใช้งาน API hooks ใน /hooks/api/</li>
              <li>มี loading states และ error handling</li>
              <li>Auto refetch เมื่อมีการเปลี่ยนแปลงข้อมูล</li>
              <li>React Query DevTools ที่มุมล่างขวา</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Dark Mode</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>รองรับ Light และ Dark mode</li>
              <li>ใช้ CSS variables สำหรับ theming</li>
              <li>Tailwind CSS dark: prefix</li>
              <li>Smooth transitions</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}