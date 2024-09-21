"use client"

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { Progress } from '@/components/ui/progress'

export function LoadingBar() {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleStart = () => {
      setLoading(true)
      setProgress(0)
    }

    const handleComplete = () => {
      setLoading(false)
      setProgress(100)
    }

    let interval: NodeJS.Timeout

    if (loading) {
      interval = setInterval(() => {
        setProgress((oldProgress) => {
          const newProgress = Math.min(oldProgress + Math.random() * 10, 90)
          return newProgress
        })
      }, 200)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [loading])

  useEffect(() => {
    setLoading(false)
    setProgress(100)
  }, [pathname, searchParams])

  if (!loading && progress === 100) return null

  return (
    <Progress 
      value={progress} 
      className="fixed top-0 left-0 right-0 z-50 h-1 w-full bg-transparent bg-primary transition-all duration-300 ease-in-out"
      // indicatorClassName="bg-primary transition-all duration-300 ease-in-out"
    />
  )
}