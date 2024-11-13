'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'

// Define the type for circle properties
type Circle = {
  left: string
  top: string
  size: number
}

export default function Component() {
  const router = useRouter()
  const [circles, setCircles] = useState<Circle[]>([])

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('./auth')
    }, 3000)

    // Generate circle properties on the client side
    setCircles(Array.from({ length: 20 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 80 + 20,
    })))

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-300 to-pink-400">
      {/* Animated background circles */}
      {circles.map((circle, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/10"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.5, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
          style={{
            left: circle.left,
            top: circle.top,
            width: `${circle.size}px`,
            height: `${circle.size}px`,
          }}
        />
      ))}

      {/* Content container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 1,
          ease: "easeOut",
        }}
        className="relative z-10 flex flex-col items-center gap-6 text-center px-8"
      >
        {/* Logo */}
        <motion.div 
          className="w-24 h-24 md:w-32 md:h-32 relative"
          animate={{ rotate: 360 }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo%201-hd72eYXJKGC3U18c5jQ2QNb2tRTynF.svg"
            alt="Logo"
            fill
            className="object-contain"
            priority
          />
        </motion.div>

        {/* CHAD text with subtle animation */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="text-white text-4xl md:text-6xl font-bold tracking-wider"
          style={{
            textShadow: '0 0 20px rgba(255,255,255,0.3), 0 0 30px rgba(255,255,255,0.2)'
          }}
        >
          CHAD
        </motion.h1>
      </motion.div>
    </div>
  )
}
