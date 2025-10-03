'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { ImageIcon } from 'lucide-react'

interface ImageWithFallbackProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fallbackClassName?: string
  priority?: boolean
  fill?: boolean
}

export function ImageWithFallback({
  src,
  alt,
  width,
  height,
  className,
  fallbackClassName,
  priority = false,
  fill = false,
  ...props
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  if (hasError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground rounded-md",
          fallbackClassName,
          className
        )}
        style={!fill ? { width, height } : undefined}
      >
        <ImageIcon className="h-8 w-8" />
      </div>
    )
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {isLoading && (
        <div
          className={cn(
            "absolute inset-0 bg-muted animate-pulse rounded-md",
            "flex items-center justify-center"
          )}
        >
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          fill ? "object-cover" : ""
        )}
        onError={() => setHasError(true)}
        onLoad={() => setIsLoading(false)}
        {...props}
      />
    </div>
  )
}