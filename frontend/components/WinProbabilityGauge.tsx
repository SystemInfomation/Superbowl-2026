'use client'

import { motion } from 'framer-motion'
import { GameData } from '@/lib/types'

interface WinProbabilityGaugeProps {
  gameData: GameData
}

/**
 * WinProbabilityGauge - Animated gauge showing current win probability
 */
export default function WinProbabilityGauge({ gameData }: WinProbabilityGaugeProps) {
  if (!gameData.winProbability) return null

  const { homeWinPercentage, awayWinPercentage, tiePercentage } = gameData.winProbability

  // Convert to percentages (ESPN returns as decimals 0-1 or already as percentages)
  const patriotsWin = typeof homeWinPercentage === 'number' 
    ? (homeWinPercentage > 1 ? homeWinPercentage : homeWinPercentage * 100)
    : 50
  const seahawksWin = typeof awayWinPercentage === 'number'
    ? (awayWinPercentage > 1 ? awayWinPercentage : awayWinPercentage * 100)
    : 50

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="glass-strong rounded-2xl p-6 shadow-2xl hover-3d"
    >
      <h3 className="font-orbitron text-xl md:text-2xl text-white mb-6 text-center">
        WIN PROBABILITY
      </h3>

      {/* Visual Bar */}
      <div className="relative h-16 md:h-20 bg-gray-900/50 rounded-full overflow-hidden mb-6 border border-white/10">
        {/* Patriots side */}
        <motion.div
          initial={{ width: '50%' }}
          animate={{ width: `${patriotsWin}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-patriots-red via-patriots-navy to-patriots-red flex items-center justify-start pl-4 md:pl-6 neon-glow-patriots"
        >
          <span className="font-bebas text-xl md:text-3xl text-white drop-shadow-lg text-glow-patriots">
            {patriotsWin.toFixed(1)}%
          </span>
        </motion.div>

        {/* Seahawks side */}
        <motion.div
          initial={{ width: '50%' }}
          animate={{ width: `${seahawksWin}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="absolute right-0 top-0 h-full bg-gradient-to-l from-seahawks-green to-seahawks-navy flex items-center justify-end pr-4 md:pr-6"
        >
          <span className="font-bebas text-xl md:text-3xl text-white drop-shadow-lg">
            {seahawksWin.toFixed(1)}%
          </span>
        </motion.div>

        {/* Center divider */}
        <div className="absolute left-1/2 top-0 h-full w-0.5 bg-white/30 transform -translate-x-1/2 z-10"></div>
      </div>

      {/* Team Labels */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img
            src="https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/ne.png"
            alt="Patriots"
            className="w-8 h-8"
          />
          <span className="font-bebas text-lg text-patriots-red">PATRIOTS</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bebas text-lg text-seahawks-green">SEAHAWKS</span>
          <img
            src="https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/sea.png"
            alt="Seahawks"
            className="w-8 h-8"
          />
        </div>
      </div>

      {/* Tie Percentage if applicable */}
      {tiePercentage && tiePercentage > 0 && (
        <div className="mt-4 text-center">
          <span className="font-montserrat text-sm text-gray-400">
            Tie: {typeof tiePercentage === 'number' 
              ? (tiePercentage > 1 ? tiePercentage : tiePercentage * 100).toFixed(1)
              : 0}%
          </span>
        </div>
      )}
    </motion.div>
  )
}
