'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'
import { GameData } from '@/lib/types'
import { getWinningTeam } from '@/lib/espn-api'

interface GameStateOverlayProps {
  gameData: GameData
}

/**
 * GameStateOverlay - Shows overlays for pre-game, halftime, and final states
 */
export default function GameStateOverlay({ gameData }: GameStateOverlayProps) {
  const [hasTriggeredConfetti, setHasTriggeredConfetti] = useState(false)

  // Trigger confetti on final
  useEffect(() => {
    if (gameData.status === 'FINAL' && !hasTriggeredConfetti) {
      triggerVictoryConfetti()
      setHasTriggeredConfetti(true)
    }
  }, [gameData.status, hasTriggeredConfetti])

  const triggerVictoryConfetti = () => {
    const duration = 5000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    }, 250)
  }

  // Halftime overlay
  if (gameData.status === 'HALFTIME') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-lg z-40 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="text-8xl md:text-9xl mb-6">🎭</div>
            <h2 className="font-bebas text-6xl md:text-8xl bg-gradient-to-r from-patriots-red via-white to-seahawks-green bg-clip-text text-transparent mb-4">
              HALFTIME
            </h2>
            <p className="font-orbitron text-xl md:text-2xl text-white">
              The show continues...
            </p>
            {gameData.teams && (
              <div className="mt-8 flex items-center justify-center gap-8">
                <div className="text-center">
                  <div className="font-bebas text-2xl text-seahawks-green mb-2">SEAHAWKS</div>
                  <div className="font-orbitron text-5xl text-white">{gameData.teams.seahawks.score}</div>
                </div>
                <div className="text-white text-3xl">-</div>
                <div className="text-center">
                  <div className="font-bebas text-2xl text-patriots-red mb-2">PATRIOTS</div>
                  <div className="font-orbitron text-5xl text-white">{gameData.teams.patriots.score}</div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
  }

  // Final overlay
  if (gameData.status === 'FINAL') {
    const winner = getWinningTeam(gameData)
    const isTie = winner === 'tie'
    const patriotsWon = winner === 'patriots'
    const seahawksWon = winner === 'seahawks'

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-lg z-40 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="text-center max-w-4xl mx-auto px-4"
          >
            {/* Trophy or Tie Icon */}
            <motion.div
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-9xl mb-6"
            >
              {isTie ? '🤝' : '🏆'}
            </motion.div>

            {/* Final Score Title */}
            <h2 className="font-bebas text-7xl md:text-9xl mb-8">
              <span className="block text-white mb-2">FINAL</span>
              <span className="block bg-gradient-to-r from-patriots-red via-white to-seahawks-green bg-clip-text text-transparent">
                SUPER BOWL LX
              </span>
            </h2>

            {/* Winner Announcement */}
            {!isTie && gameData.teams && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mb-8"
              >
                <div className={`font-bebas text-5xl md:text-6xl ${
                  patriotsWon ? 'text-patriots-red text-glow-patriots' : 'text-seahawks-green text-glow-seahawks'
                }`}>
                  {patriotsWon && 'PATRIOTS WIN!'}
                  {seahawksWon && 'SEAHAWKS WIN!'}
                </div>
              </motion.div>
            )}

            {/* Final Scores */}
            {gameData.teams && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-center justify-center gap-12 mb-8"
              >
                {/* Seahawks */}
                <div className={`text-center ${seahawksWon ? 'scale-110' : ''}`}>
                  <img
                    src="https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/sea.png"
                    alt="Seahawks"
                    className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-4"
                  />
                  <div className="font-bebas text-3xl text-seahawks-green mb-2">SEAHAWKS</div>
                  <div className={`font-orbitron text-6xl md:text-7xl ${
                    seahawksWon ? 'text-seahawks-green' : 'text-white'
                  }`}>
                    {gameData.teams.seahawks.score}
                  </div>
                </div>

                {/* VS */}
                <div className="font-bebas text-4xl text-gray-500">-</div>

                {/* Patriots */}
                <div className={`text-center ${patriotsWon ? 'scale-110' : ''}`}>
                  <img
                    src="https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/ne.png"
                    alt="Patriots"
                    className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-4"
                  />
                  <div className="font-bebas text-3xl text-patriots-red mb-2">PATRIOTS</div>
                  <div className={`font-orbitron text-6xl md:text-7xl ${
                    patriotsWon ? 'text-patriots-red' : 'text-white'
                  }`}>
                    {gameData.teams.patriots.score}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Venue Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="font-montserrat text-gray-400"
            >
              <p>Levi's Stadium, Santa Clara, CA</p>
              <p className="text-sm mt-2">February 8, 2026</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
  }

  return null
}
