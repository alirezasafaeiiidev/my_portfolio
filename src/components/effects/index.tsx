'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function ParallaxBackground({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const scrolled = window.scrollY
        const rate = scrolled * 0.05
        const yPosition = -scrolled * 0.5
        if (ref.current.style.transform !== `translateY(${yPosition}px)`) {
          ref.current.style.transform = `translateY(${yPosition}px)`
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      {children}
    </div>
  )
}

export function MouseTrail() {
  const [points, setPoints] = useState<Array<{ x: number; y: number }>>([])
  const mouseRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mouseRef.current) {
      const rect = mouseRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      setPoints((prev) => [
        ...prev.slice(-8), // Keep last 8 points
        { x, y },
      ])
    }
  }

  return (
    <div
      ref={mouseRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPoints([])}
      className="relative overflow-hidden"
    >
      {points.map((point, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className="absolute h-4 w-4 rounded-full bg-primary/30 pointer-events-none"
          style={{ left: point.x - 8, top: point.y - 8 }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  )
}

export function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Circle 1 */}
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-primary/10 blur-3xl"
        style={{ top: '10%', left: '5%' }}
        animate={{
          y: [0, -100, 0],
          x: [0, 50, 0, -50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.5, 0.5, 0],
        }}
      />

      {/* Circle 2 */}
      <motion.div
        className="absolute w-64 h-64 rounded-full bg-accent/10 blur-2xl"
        style={{ top: '60%', right: '10%' }}
        animate={{
          x: [0, 100, 0, -100, 0],
          y: [0, -50, 50, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.5, 0.5, 0],
        }}
      />

      {/* Square */}
      <motion.div
        className="absolute w-32 h-32 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 blur-xl"
        style={{ bottom: '20%', left: '8%' }}
        animate={{
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
          times: [0, 0.5, 0.5, 0],
        }}
      />

      {/* Triangle */}
      <motion.div
        className="absolute w-16 h-16"
        style={{ bottom: '40%', right: '15%' }}
        style={{
          clipPath: 'polygon(50% 0%, 100% 100%, 50% 50%, 0% 0%)',
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        className="bg-gradient-to-br from-accent/20 to-primary/20"
      />
    </div>
  )
}

export function GlowEffect({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('relative group', className)}>
      {children}
      <motion.div
        className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-20 transition-opacity"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
        }}
      />
    </div>
  )
}
