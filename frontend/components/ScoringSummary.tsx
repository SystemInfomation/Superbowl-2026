'use client'

import { motion } from 'framer-motion'
import { GameData } from '@/lib/types'

interface ScoringSummaryProps {
  gameData: GameData
}

/**
 * ScoringSummary - Chronological list of all scoring plays
 */
export default function ScoringSummary({ gameData }: ScoringSummaryProps) {
  const scoringPlays = gameData.scoringPlays || []

  if (scoringPlays.length === 0) {
    return (
      <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20">
        <h3 className="font-orbitron text-xl md:text-2xl text-white mb-6">
          SCORING SUMMARY
        </h3>
        <div className="text-center py-12">
          <div className="text-5xl mb-4">🏈</div>
          <div className="font-orbitron text-white text-lg">No scores yet</div>
          <div className="font-montserrat text-sm text-gray-400 mt-2">
            Scoring plays will appear here as they happen
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
      className="bg-black/60 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-orbitron text-xl md:text-2xl text-white">
          SCORING SUMMARY
        </h3>
        <div className="font-montserrat text-xs text-gray-400">
          {scoringPlays.length} {scoringPlays.length === 1 ? 'score' : 'scores'}
        </div>
      </div>

      {/* Scoring Plays Timeline */}
      <div className="space-y-4">
        {scoringPlays.map((play, index) => {
          const isPatriots = play.scoringTeam === 'NE'
          const isSeahawks = play.scoringTeam === 'SEA'
          
          return (
            <motion.div
              key={play.id || index}
              initial={{ opacity: 0, x: isPatriots ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`relative rounded-xl p-4 border-2 ${
                isPatriots
                  ? 'bg-patriots-red/10 border-patriots-red/50'
                  : isSeahawks
                  ? 'bg-seahawks-green/10 border-seahawks-green/50'
                  : 'bg-gray-800/50 border-white/20'
              }`}
            >
              {/* Score indicator badge */}
              <div className="absolute -top-3 left-4 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold">
                ⭐ {play.type || 'SCORE'}
              </div>

              <div className="flex items-start gap-4 mt-2">
                {/* Team Logo */}
                <div className="flex-shrink-0">
                  {isPatriots && (
                    <img
                      src="https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/ne.png"
                      alt="Patriots"
                      className="w-12 h-12"
                    />
                  )}
                  {isSeahawks && (
                    <img
                      src="https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/sea.png"
                      alt="Seahawks"
                      className="w-12 h-12"
                    />
                  )}
                </div>

                {/* Play Details */}
                <div className="flex-1">
                  <div className="font-montserrat text-white text-sm md:text-base mb-2">
                    {play.text}
                  </div>
                  
                  {/* Metadata */}
                  <div className="flex items-center gap-3 text-xs">
                    {typeof play.period === 'number' && (
                      <span className="font-orbitron text-gray-400">
                        Q{play.period}
                      </span>
                    )}
                    {play.clock && (
                      <>
                        <span className="text-gray-600">•</span>
                        <span className="font-orbitron text-gray-400">{play.clock}</span>
                      </>
                    )}
                    {play.scoringTeam && (
                      <>
                        <span className="text-gray-600">•</span>
                        <span className={`font-bebas ${
                          isPatriots ? 'text-patriots-red' : isSeahawks ? 'text-seahawks-green' : 'text-gray-400'
                        }`}>
                          {play.scoringTeam}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Points */}
                {typeof play.points === 'number' && (
                  <div className="flex-shrink-0 text-right">
                    <div className={`font-orbitron text-3xl font-bold ${
                      isPatriots ? 'text-patriots-red' : isSeahawks ? 'text-seahawks-green' : 'text-white'
                    }`}>
                      {play.points}
                    </div>
                    <div className="font-montserrat text-xs text-gray-400">
                      {play.points === 1 ? 'point' : 'points'}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
