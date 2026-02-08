'use client'

import { motion } from 'framer-motion'
import { GameData } from '@/lib/types'
import { getQuarterDisplay } from '@/lib/espn-api'

interface CountdownOrClockProps {
  gameData: GameData
}

/**
 * CountdownOrClock - Shows countdown before game or live clock during game
 */
export default function CountdownOrClock({ gameData }: CountdownOrClockProps) {
  // Pre-game countdown
  if (!gameData.gameStarted && gameData.countdown) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-8 md:mb-12"
      >
        <div className="max-w-4xl mx-auto bg-black/50 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/10">
          <h2 className="font-orbitron text-2xl md:text-3xl text-center mb-6 text-glow-seahawks">
            ⏱️ KICKOFF COUNTDOWN
          </h2>
          <div className="grid grid-cols-4 gap-4 md:gap-8">
            {[
              { label: 'DAYS', value: gameData.countdown.days },
              { label: 'HOURS', value: gameData.countdown.hours },
              { label: 'MINUTES', value: gameData.countdown.minutes },
              { label: 'SECONDS', value: gameData.countdown.seconds },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <motion.div
                  key={`${item.label}-${item.value}`}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="font-orbitron text-4xl md:text-5xl lg:text-6xl font-bold mb-2 bg-gradient-to-br from-patriots-red to-seahawks-green bg-clip-text text-transparent"
                >
                  {String(item.value).padStart(2, '0')}
                </motion.div>
                <div className="font-montserrat text-xs md:text-sm text-gray-400 uppercase tracking-wider">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    )
  }

  // Live game clock
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mb-6 md:mb-8"
    >
      <div className="max-w-2xl mx-auto bg-black/50 backdrop-blur-md rounded-xl p-4 md:p-6 border border-white/10">
        <div className="flex items-center justify-center gap-4">
          {/* Live indicator */}
          {gameData.status === 'LIVE' && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="font-orbitron text-sm text-red-500">LIVE</span>
            </div>
          )}

          {/* Quarter/Status */}
          <div className="font-orbitron text-xl md:text-2xl text-white">
            {getQuarterDisplay(gameData.quarter, gameData.status)}
          </div>

          {/* Clock */}
          {gameData.timeRemaining && gameData.status !== 'FINAL' && (
            <>
              <div className="w-px h-6 bg-white/20"></div>
              <motion.div
                key={gameData.timeRemaining}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
                className="font-orbitron text-2xl md:text-3xl font-bold text-white"
              >
                {gameData.timeRemaining}
              </motion.div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}
