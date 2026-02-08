'use client'

import { motion } from 'framer-motion'
import { GameData } from '@/lib/types'

interface PlayerLeadersProps {
  gameData: GameData
}

/**
 * PlayerLeaders - Top performers in key categories
 */
export default function PlayerLeaders({ gameData }: PlayerLeadersProps) {
  const leaders = gameData.leaders

  if (!leaders || leaders.length === 0) {
    return (
      <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20">
        <h3 className="font-orbitron text-xl md:text-2xl text-white mb-6 text-center">
          PLAYER LEADERS
        </h3>
        <div className="text-center py-12">
          <div className="text-5xl mb-4">👥</div>
          <div className="font-orbitron text-white text-lg">No leader data available</div>
          <div className="font-montserrat text-sm text-gray-400 mt-2">
            Player leaders will appear here during the game
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-strong rounded-2xl p-6 md:p-8 shadow-2xl hover-3d"
    >
      <h3 className="font-orbitron text-xl md:text-2xl text-white mb-6 text-center">
        PLAYER LEADERS
      </h3>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {leaders.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-xl p-4 border border-white/10 hover-3d"
          >
            {/* Category Name */}
            <h4 className="font-bebas text-lg text-white mb-4 text-center border-b border-white/10 pb-2">
              {category.displayName}
            </h4>

            {/* Leaders */}
            <div className="space-y-3">
              {category.leaders.slice(0, 3).map((leader, leaderIndex) => (
                <div
                  key={leader.athlete.id}
                  className={`flex items-center gap-3 ${
                    leaderIndex === 0 ? 'bg-gradient-to-r from-yellow-500/10 to-transparent rounded-lg p-2' : ''
                  }`}
                >
                  {/* Rank */}
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    leaderIndex === 0
                      ? 'bg-yellow-500 text-black'
                      : leaderIndex === 1
                      ? 'bg-gray-400 text-black'
                      : 'bg-gray-600 text-white'
                  }`}>
                    {leaderIndex + 1}
                  </div>

                  {/* Player Photo */}
                  {leader.athlete.headshot && (
                    <img
                      src={leader.athlete.headshot}
                      alt={leader.athlete.displayName}
                      className="w-10 h-10 rounded-full border-2 border-white/20"
                    />
                  )}

                  {/* Player Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-montserrat text-white text-sm truncate">
                      {leader.athlete.shortName || leader.athlete.displayName}
                    </div>
                    <div className="font-orbitron text-xs text-gray-400">
                      {leader.displayValue}
                    </div>
                  </div>

                  {/* Value */}
                  <div className="flex-shrink-0">
                    <div className="font-orbitron text-lg text-white">
                      {leader.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
