'use client'

import { ReactNode } from 'react'

interface SkeletonProps {
  className?: string
}

// Base skeleton with pulse animation
export function Skeleton({ className = 'w-full h-6' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      aria-hidden="true"
    />
  )
}

// Text skeleton with multiple lines
export function SkeletonText({ 
  lines = 3, 
  className = '',
  lastLineWidth = 'w-3/4',
}: { 
  lines?: number
  className?: string
  lastLineWidth?: string
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array(lines)
        .fill(0)
        .map((_, i) => (
          <Skeleton
            key={i}
            className={`h-4 ${i === lines - 1 && lastLineWidth ? lastLineWidth : 'w-full'}`}
          />
        ))}
    </div>
  )
}

// Card skeleton for dashboard widgets
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white p-5 rounded-lg shadow animate-pulse ${className}`}>
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-8 w-1/2 mb-4" />
      <SkeletonText lines={2} className="mt-4" />
    </div>
  )
}

// Table skeleton for data tables
export function SkeletonTable({ 
  rows = 5, 
  columns = 4,
  className = '' 
}: { 
  rows?: number
  columns?: number
  className?: string
}) {
  return (
    <div className={`rounded-lg overflow-hidden ${className}`}>
      {/* Table Header */}
      <div className="bg-gray-50 px-6 py-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array(columns)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-4" />
            ))}
        </div>
      </div>

      {/* Table Body */}
      <div className="bg-white divide-y divide-gray-200">
        {Array(rows)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array(columns)
                  .fill(0)
                  .map((_, j) => (
                    <Skeleton key={j} className="h-4" />
                  ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

// Chart skeleton for analytics
export function SkeletonChart({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white p-5 rounded-lg shadow ${className}`}>
      <Skeleton className="h-5 w-1/3 mb-6" /> 
      <div className="h-64 flex items-center justify-center">
        <div className="w-full h-40 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  )
}

// Avatar skeleton
export function SkeletonAvatar({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-14 w-14'
  }
  
  return <Skeleton className={`${sizeClasses[size]} rounded-full`} />
}

// Product card skeleton
export function SkeletonProductCard() {
  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden group relative flex flex-col">
      <Skeleton className="w-full h-48" />
      <div className="p-4 flex flex-col flex-grow justify-between">
        <Skeleton className="h-5 w-2/3 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-4" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>
    </div>
  )
}

// Client-side wrapper to prevent hydration issues
export function ClientOnly({ children }: { children: ReactNode }) {
  return <>{children}</>
}
