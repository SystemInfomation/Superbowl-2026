'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { GameData } from '@/lib/types'
import { formatDownAndDistance, formatFieldPosition } from '@/lib/espn-api'

interface LiveScoreBoxProps {
  gameData: GameData
}

/**
 * LiveScoreBox - Central scoreboard showing scores, possession, down & distance
 */
export default function LiveScoreBox({ gameData }: LiveScoreBoxProps) {
  if (!gameData.teams) return null

  const { patriots, seahawks } = gameData.teams

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="max-w-6xl mx-auto mb-8"
    >
      <div className="bg-black/60 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl">
        {/* Main Scoreboard */}
        <div className="grid grid-cols-3 gap-4 md:gap-6 items-center mb-6">
          {/* Seahawks (Away) */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`text-center p-4 md:p-6 rounded-2xl transition-all ${
              seahawks.possession
                ? 'bg-seahawks-green/20 border-2 border-seahawks-green neon-glow-seahawks'
                : 'bg-black/40 border-2 border-white/10'
            }`}
          >
            <img
              src="https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/sea.png"
              alt="Seattle Seahawks"
              className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-3"
            />
            <h3 className="font-bebas text-xl md:text-2xl text-seahawks-green mb-2">
              SEAHAWKS
            </h3>
            <motion.div
              key={`seahawks-${seahawks.score}`}
              initial={{ scale: 1.3, color: '#69be28' }}
              animate={{ scale: 1, color: '#ffffff' }}
              transition={{ duration: 0.5 }}
              className="font-orbitron text-4xl md:text-6xl font-bold text-white"
            >
              {seahawks.score}
            </motion.div>

            {/* Possession Indicator */}
            <AnimatePresence>
              {seahawks.possession && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-3"
                >
                  <div className="inline-flex items-center gap-2 bg-seahawks-green text-white px-3 py-1 rounded-full text-sm font-bold">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    BALL
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Timeouts */}
            {typeof seahawks.timeouts === 'number' && (
              <div className="mt-2 text-xs text-gray-400">
                Timeouts: {seahawks.timeouts}
              </div>
            )}
          </motion.div>

          {/* Center Info */}
          <div className="text-center space-y-3">
            {/* Down & Distance */}
            {gameData.down && gameData.yardsToGo && (
              <div className="bg-black/40 rounded-xl p-3 border border-white/10">
                <div className="font-orbitron text-lg md:text-xl text-white">
                  {formatDownAndDistance(gameData.down, gameData.yardsToGo)}
                </div>
              </div>
            )}

            {/* Field Position */}
            {gameData.fieldPosition && (
              <div className="bg-black/40 rounded-xl p-3 border border-white/10">
                <div className="text-xs text-gray-400 mb-1">Ball On</div>
                <div className="font-orbitron text-white">
                  {formatFieldPosition(gameData.fieldPosition)}
                </div>
              </div>
            )}

            {/* Red Zone Indicator */}
            {gameData.fieldPosition && 
             (gameData.fieldPosition.yardLine >= 80 || gameData.fieldPosition.yardLine <= 20) && (
              <div className="bg-red-500/20 border border-red-500 rounded-lg px-3 py-1">
                <div className="font-bebas text-red-500 text-sm animate-pulse">
                  RED ZONE
                </div>
              </div>
            )}
          </div>

          {/* Patriots (Home) */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`text-center p-4 md:p-6 rounded-2xl transition-all ${
              patriots.possession
                ? 'bg-patriots-red/20 border-2 border-patriots-red neon-glow-patriots'
                : 'bg-black/40 border-2 border-white/10'
            }`}
          >
            <img
              src="https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/ne.png"
              alt="New England Patriots"
              className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-3"
            />
            <h3 className="font-bebas text-xl md:text-2xl text-patriots-red mb-2">
              PATRIOTS
            </h3>
            <motion.div
              key={`patriots-${patriots.score}`}
              initial={{ scale: 1.3, color: '#c60c30' }}
              animate={{ scale: 1, color: '#ffffff' }}
              transition={{ duration: 0.5 }}
              className="font-orbitron text-4xl md:text-6xl font-bold text-white"
            >
              {patriots.score}
            </motion.div>

            {/* Possession Indicator */}
            <AnimatePresence>
              {patriots.possession && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-3"
                >
                  <div className="inline-flex items-center gap-2 bg-patriots-red text-white px-3 py-1 rounded-full text-sm font-bold">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    BALL
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Timeouts */}
            {typeof patriots.timeouts === 'number' && (
              <div className="mt-2 text-xs text-gray-400">
                Timeouts: {patriots.timeouts}
              </div>
            )}
          </motion.div>
        </div>

        {/* Last Play */}
        {gameData.lastPlay && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-patriots-red/10 to-seahawks-green/10 rounded-xl p-4 border border-white/10"
          >
            <div className="flex items-center gap-3">
              <span className="font-montserrat text-sm text-gray-400 flex-shrink-0">
                Last Play:
              </span>
              <span className="font-montserrat text-white text-sm md:text-base">
                {gameData.lastPlay}
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
