'use client'

import { motion } from 'framer-motion'
import { GameData, Play } from '@/lib/types'

interface PlayByPlayFeedProps {
  gameData: GameData
}

/**
 * PlayByPlayFeed - Auto-scrolling list of recent plays
 */
export default function PlayByPlayFeed({ gameData }: PlayByPlayFeedProps) {
  const plays = gameData.plays || []

  if (plays.length === 0) {
    return (
      <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20">
        <h3 className="font-orbitron text-xl md:text-2xl text-white mb-6">
          PLAY-BY-PLAY
        </h3>
        <div className="text-center py-12">
          <div className="text-5xl mb-4">📡</div>
          <div className="font-orbitron text-white text-lg">Waiting for plays...</div>
          <div className="font-montserrat text-sm text-gray-400 mt-2">
            Play-by-play data will appear here once the game starts
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="bg-black/60 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-orbitron text-xl md:text-2xl text-white">
          PLAY-BY-PLAY
        </h3>
        <div className="font-montserrat text-xs text-gray-400">
          Latest {plays.length} plays
        </div>
      </div>

      {/* Plays List */}
      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
        {plays.map((play, index) => (
          <motion.div
            key={play.id || index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-black/40 rounded-xl p-4 border border-white/10 hover:border-white/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              {/* Play Description */}
              <div className="flex-1 min-w-0">
                <div className="font-montserrat text-white text-sm md:text-base mb-2">
                  {play.text || 'Play description unavailable'}
                </div>
                
                {/* Play Metadata */}
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  {typeof play.period === 'number' && (
                    <span className="font-orbitron">
                      Q{play.period}
                    </span>
                  )}
                  {play.clock && (
                    <>
                      <span>•</span>
                      <span className="font-orbitron">{play.clock}</span>
                    </>
                  )}
                  {play.scoringPlay && (
                    <>
                      <span>•</span>
                      <span className="text-yellow-500 font-bold">⭐ SCORE</span>
                    </>
                  )}
                </div>
              </div>

              {/* Score at time of play */}
              {(typeof play.homeScore === 'number' || typeof play.awayScore === 'number') && (
                <div className="flex-shrink-0 text-right">
                  <div className="font-orbitron text-xs text-gray-500 mb-1">SCORE</div>
                  <div className="font-orbitron text-white text-sm">
                    {typeof play.awayScore === 'number' ? play.awayScore : '—'}
                    {' - '}
                    {typeof play.homeScore === 'number' ? play.homeScore : '—'}
                  </div>
                  <div className="font-montserrat text-xs text-gray-500 mt-1">
                    SEA - NE
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
