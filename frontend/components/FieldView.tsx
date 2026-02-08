'use client'

import { motion } from 'framer-motion'
import { GameData } from '@/lib/types'

interface FieldViewProps {
  gameData: GameData
}

/**
 * FieldView - Visual football field showing current players with possession indicator
 */
export default function FieldView({ gameData }: FieldViewProps) {
  if (!gameData.teams) return null

  const { patriots, seahawks } = gameData.teams
  const possessingTeam = patriots.possession ? 'patriots' : seahawks.possession ? 'seahawks' : null

  // Get active players (those with stats in current game)
  const getActivePlayers = (players: any[] | undefined, maxCount = 11) => {
    if (!players || players.length === 0) return []
    
    // Filter players with stat categories (active in game)
    const activePlayers = players.filter(p => 
      p.statCategories && Object.keys(p.statCategories).length > 0
    )
    
    // If we have active players, return them, otherwise show some from roster
    return (activePlayers.length > 0 ? activePlayers : players).slice(0, maxCount)
  }

  const activePatriots = getActivePlayers(patriots.players)
  const activeSeahawks = getActivePlayers(seahawks.players)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-black/60 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20"
    >
      <h3 className="font-orbitron text-xl md:text-2xl text-white mb-6 text-center">
        PLAYERS ON FIELD
      </h3>

      {/* Football Field Visual */}
      <div className="relative bg-gradient-to-b from-green-800 via-green-700 to-green-800 rounded-xl overflow-hidden border-4 border-white/20">
        {/* Field Lines */}
        <div className="absolute inset-0">
          {/* Horizontal yard lines */}
          {[...Array(11)].map((_, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 border-t border-white/30"
              style={{ top: `${(i + 1) * 9.09}%` }}
            />
          ))}
          
          {/* 50-yard line */}
          <div className="absolute left-0 right-0 top-1/2 border-t-2 border-white/50 transform -translate-y-1/2" />
        </div>

        {/* Field Content */}
        <div className="relative grid grid-cols-2 gap-4 p-6 min-h-[500px]">
          {/* Seahawks Side (Top/Left) */}
          <div className="space-y-2">
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 bg-seahawks-green/20 border border-seahawks-green px-4 py-2 rounded-full">
                <img
                  src="https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/sea.png"
                  alt="Seahawks"
                  className="w-6 h-6"
                />
                <span className="font-bebas text-seahawks-green text-lg">
                  SEAHAWKS
                  {possessingTeam === 'seahawks' && ' 🏈'}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {activeSeahawks.map((player, index) => (
                <motion.div
                  key={player.id || index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-black/40 rounded-lg p-2 border ${
                    possessingTeam === 'seahawks' 
                      ? 'border-seahawks-green bg-seahawks-green/10' 
                      : 'border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {player.headshot && (
                      <img
                        src={player.headshot}
                        alt={player.shortName || player.name}
                        className="w-8 h-8 rounded-full border border-white/20"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-montserrat text-white text-xs truncate flex items-center gap-1">
                        {player.jersey && (
                          <span className="text-seahawks-green font-bold">#{player.jersey}</span>
                        )}
                        <span className="truncate">{player.shortName || player.name}</span>
                      </div>
                      <div className="font-montserrat text-xs text-gray-400">
                        {player.position}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Patriots Side (Bottom/Right) */}
          <div className="space-y-2">
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 bg-patriots-red/20 border border-patriots-red px-4 py-2 rounded-full">
                <img
                  src="https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/ne.png"
                  alt="Patriots"
                  className="w-6 h-6"
                />
                <span className="font-bebas text-patriots-red text-lg">
                  PATRIOTS
                  {possessingTeam === 'patriots' && ' 🏈'}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {activePatriots.map((player, index) => (
                <motion.div
                  key={player.id || index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-black/40 rounded-lg p-2 border ${
                    possessingTeam === 'patriots' 
                      ? 'border-patriots-red bg-patriots-red/10' 
                      : 'border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {player.headshot && (
                      <img
                        src={player.headshot}
                        alt={player.shortName || player.name}
                        className="w-8 h-8 rounded-full border border-white/20"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-montserrat text-white text-xs truncate flex items-center gap-1">
                        {player.jersey && (
                          <span className="text-patriots-red font-bold">#{player.jersey}</span>
                        )}
                        <span className="truncate">{player.shortName || player.name}</span>
                      </div>
                      <div className="font-montserrat text-xs text-gray-400">
                        {player.position}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Field Position Indicator */}
        {gameData.fieldPosition && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
          >
            <div className="bg-yellow-500 text-black px-4 py-2 rounded-full font-bebas text-sm shadow-lg">
              🏈 BALL ON {gameData.fieldPosition.team === 'patriots' ? 'NE' : 'SEA'} {gameData.fieldPosition.yardLine}
            </div>
          </motion.div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 text-center">
        <p className="font-montserrat text-xs text-gray-500">
          🏈 indicates team with possession • Showing active players from ESPN roster data
        </p>
      </div>
    </motion.div>
  )
}
