'use client';

import React from 'react';
import { ResponsiveContainer, ResponsiveGrid, ResponsiveText } from '@/components/ui/responsive-container';
import { useResponsive, useIsMobile, useIsTablet, useIsDesktop } from '@/hooks/useResponsive';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ResponsiveExample() {
  const { screenSize, isMobile, isTablet } = useResponsive();
  const isMobileQuery = useIsMobile();
  const isTabletQuery = useIsTablet();
  const isDesktopQuery = useIsDesktop();

  return (
    <ResponsiveContainer maxWidth="7xl" padding="md">
      <div className="space-y-8">
        {/* Screen Size Info */}
        <Card>
          <CardHeader>
            <CardTitle>Screen Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Screen Size</p>
                <p className="font-semibold">{screenSize.width} x {screenSize.height}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Device Type</p>
                <p className="font-semibold">
                  {isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'}
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Media Query</p>
                <p className="font-semibold">
                  {isMobileQuery ? 'Mobile' : isTabletQuery ? 'Tablet' : isDesktopQuery ? 'Desktop' : 'Unknown'}
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Breakpoint</p>
                <p className="font-semibold">
                  {screenSize.width < 640 ? 'XS' : 
                   screenSize.width < 768 ? 'SM' :
                   screenSize.width < 1024 ? 'MD' :
                   screenSize.width < 1280 ? 'LG' :
                   screenSize.width < 1536 ? 'XL' : '2XL'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Responsive Text Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Responsive Typography</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ResponsiveText 
              as="h1" 
              size={{ default: '2xl', sm: '3xl', lg: '4xl' }}
              className="font-bold text-primary"
            >
              Responsive Heading
            </ResponsiveText>
            
            <ResponsiveText 
              as="p" 
              size={{ default: 'sm', sm: 'base', lg: 'lg' }}
              className="text-muted-foreground"
            >
              This text changes size based on screen width. On mobile it&apos;s smaller, 
              on tablet it&apos;s medium, and on desktop it&apos;s larger.
            </ResponsiveText>
          </CardContent>
        </Card>

        {/* Responsive Grid Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Responsive Grid Layouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* Basic Grid */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Basic Responsive Grid</h3>
                <ResponsiveGrid 
                  cols={{ default: 1, sm: 2, lg: 3, xl: 4 }}
                  gap="md"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                    <div key={item} className="p-4 bg-primary/10 rounded-lg text-center">
                      <p className="font-semibold">Item {item}</p>
                    </div>
                  ))}
                </ResponsiveGrid>
              </div>

              {/* Card Grid */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Card Grid</h3>
                <ResponsiveGrid 
                  cols={{ default: 1, md: 2, xl: 3 }}
                  gap="lg"
                >
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <Card key={item}>
                      <CardHeader>
                        <CardTitle className="text-lg">Card {item}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          This is a responsive card that adapts to different screen sizes.
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </ResponsiveGrid>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Responsive Visibility */}
        <Card>
          <CardHeader>
            <CardTitle>Responsive Visibility</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg block sm:hidden">
                <p className="text-blue-700 dark:text-blue-300 font-semibold">
                  📱 This is only visible on mobile (XS screens)
                </p>
              </div>
              
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hidden sm:block md:hidden">
                <p className="text-green-700 dark:text-green-300 font-semibold">
                  📱 This is only visible on small tablets (SM screens)
                </p>
              </div>
              
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hidden md:block lg:hidden">
                <p className="text-yellow-700 dark:text-yellow-300 font-semibold">
                  📱 This is only visible on tablets (MD screens)
                </p>
              </div>
              
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hidden lg:block">
                <p className="text-purple-700 dark:text-purple-300 font-semibold">
                  🖥️ This is only visible on desktop (LG+ screens)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Responsive Spacing */}
        <Card>
          <CardHeader>
            <CardTitle>Responsive Spacing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 sm:space-y-4 lg:space-y-6">
              <div className="p-2 sm:p-4 lg:p-6 bg-muted rounded-lg">
                <p className="text-sm sm:text-base lg:text-lg">
                  This container has responsive padding and the spacing between elements changes.
                </p>
              </div>
              <div className="p-2 sm:p-4 lg:p-6 bg-muted rounded-lg">
                <p className="text-sm sm:text-base lg:text-lg">
                  Notice how the padding and spacing adapts to screen size.
                </p>
              </div>
              <div className="p-2 sm:p-4 lg:p-6 bg-muted rounded-lg">
                <p className="text-sm sm:text-base lg:text-lg">
                  This creates a better user experience across all devices.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ResponsiveContainer>
  );
}