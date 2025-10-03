'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'

interface LayoutWrapperProps {
  children: React.ReactNode
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()
  
  // ซ่อน Header และ Footer ในหน้าเหล่านี้
  const hideHeaderFooter = pathname?.startsWith('/admin') || 
                          pathname === '/login' || 
                          pathname === '/register' ||
                          pathname === '/login-simple' ||
                          pathname === '/register-simple'
  
  if (hideHeaderFooter) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        {children}
      </div>
    )
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}