'use client'

import { motion } from 'framer-motion'
import { GameData } from '@/lib/types'

interface BoxScoreTablesProps {
  gameData: GameData
}

/**
 * BoxScoreTables - Team and player statistics tables
 */
export default function BoxScoreTables({ gameData }: BoxScoreTablesProps) {
  if (!gameData.teams) return null

  const { patriots, seahawks } = gameData.teams

  // Extract common stats
  const getStatValue = (stats: Record<string, any> | undefined, key: string): string => {
    if (!stats) return '0'
    return stats[key]?.toString() || '0'
  }

  const commonStats = [
    { label: 'Total Yards', key: 'totalYards' },
    { label: 'Passing Yards', key: 'passingYards' },
    { label: 'Rushing Yards', key: 'rushingYards' },
    { label: 'First Downs', key: 'firstDowns' },
    { label: 'Third Down Conv', key: 'thirdDownEff' },
    { label: 'Turnovers', key: 'turnovers' },
    { label: 'Penalties', key: 'penalties' },
    { label: 'Time of Possession', key: 'possessionTime' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-black/60 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20"
    >
      <h3 className="font-orbitron text-xl md:text-2xl text-white mb-6 text-center">
        TEAM STATISTICS
      </h3>

      {/* Stats Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left font-bebas text-lg text-patriots-red py-3 px-2">
                PATRIOTS
              </th>
              <th className="text-center font-montserrat text-sm text-gray-400 py-3 px-2">
                STAT
              </th>
              <th className="text-right font-bebas text-lg text-seahawks-green py-3 px-2">
                SEAHAWKS
              </th>
            </tr>
          </thead>
          <tbody>
            {commonStats.map((stat, index) => {
              const patriotValue = getStatValue(patriots.stats, stat.key)
              const seahawkValue = getStatValue(seahawks.stats, stat.key)

              return (
                <motion.tr
                  key={stat.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="font-orbitron text-white py-3 px-2 text-left">
                    {patriotValue}
                  </td>
                  <td className="font-montserrat text-sm text-gray-400 py-3 px-2 text-center">
                    {stat.label}
                  </td>
                  <td className="font-orbitron text-white py-3 px-2 text-right">
                    {seahawkValue}
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Player Stats Section (if available) */}
      {(patriots.players && patriots.players.length > 0) || 
       (seahawks.players && seahawks.players.length > 0) ? (
        <div className="mt-8">
          <h4 className="font-orbitron text-lg text-white mb-4 text-center">
            TOP PERFORMERS
          </h4>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Patriots Players */}
            {patriots.players && patriots.players.length > 0 && (
              <div>
                <div className="font-bebas text-patriots-red text-sm mb-3">PATRIOTS</div>
                <div className="space-y-2">
                  {patriots.players.slice(0, 5).map((player, index) => (
                    <div
                      key={player.id || index}
                      className="bg-black/40 rounded-lg p-3 border border-white/10"
                    >
                      <div className="flex items-center gap-3">
                        {player.headshot && (
                          <img
                            src={player.headshot}
                            alt={player.name}
                            className="w-10 h-10 rounded-full"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-montserrat text-white text-sm truncate">
                            {player.name}
                          </div>
                          <div className="font-montserrat text-xs text-gray-400">
                            {player.position} {player.jersey && `• #${player.jersey}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Seahawks Players */}
            {seahawks.players && seahawks.players.length > 0 && (
              <div>
                <div className="font-bebas text-seahawks-green text-sm mb-3">SEAHAWKS</div>
                <div className="space-y-2">
                  {seahawks.players.slice(0, 5).map((player, index) => (
                    <div
                      key={player.id || index}
                      className="bg-black/40 rounded-lg p-3 border border-white/10"
                    >
                      <div className="flex items-center gap-3">
                        {player.headshot && (
                          <img
                            src={player.headshot}
                            alt={player.name}
                            className="w-10 h-10 rounded-full"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-montserrat text-white text-sm truncate">
                            {player.name}
                          </div>
                          <div className="font-montserrat text-xs text-gray-400">
                            {player.position} {player.jersey && `• #${player.jersey}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-8 text-center py-6">
          <div className="font-montserrat text-sm text-gray-500">
            Player statistics will be available once the game starts
          </div>
        </div>
      )}
    </motion.div>
  )
}
