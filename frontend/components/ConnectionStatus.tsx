'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface ConnectionStatusProps {
  isError: boolean
  isFetching: boolean
  lastUpdateTime?: Date
}

/**
 * ConnectionStatus - Shows live connection status and last update time
 */
export default function ConnectionStatus({ isError, isFetching, lastUpdateTime }: ConnectionStatusProps) {
  const [timeSinceUpdate, setTimeSinceUpdate] = useState<string>('Just now')

  useEffect(() => {
    if (!lastUpdateTime) return

    const interval = setInterval(() => {
      const now = new Date()
      const diff = Math.floor((now.getTime() - lastUpdateTime.getTime()) / 1000)
      
      if (diff < 10) {
        setTimeSinceUpdate('Just now')
      } else if (diff < 60) {
        setTimeSinceUpdate(`${diff}s ago`)
      } else {
        setTimeSinceUpdate(`${Math.floor(diff / 60)}m ago`)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [lastUpdateTime])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="mt-8 text-center"
    >
      <div className="inline-flex items-center gap-3 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          <AnimatePresence mode="wait">
            {isError ? (
              <motion.div
                key="error"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="w-2 h-2 bg-red-500 rounded-full"
              />
            ) : isFetching ? (
              <motion.div
                key="fetching"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"
              />
            ) : (
              <motion.div
                key="connected"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
              />
            )}
          </AnimatePresence>

          <span className="font-montserrat text-xs text-gray-400">
            {isError ? (
              'Connection Error'
            ) : isFetching ? (
              'Updating...'
            ) : (
              <>
                Live • Updates every 5s
                {lastUpdateTime && (
                  <span className="ml-2 text-gray-500">
                    • {timeSinceUpdate}
                  </span>
                )}
              </>
            )}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
