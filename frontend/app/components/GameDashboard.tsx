'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useSWR from 'swr'

const API_URL = 'https://superbowl-2026.onrender.com'

interface GameData {
  gameStarted: boolean
  status: string
  eventId?: string
  quarter?: number
  timeRemaining?: string
  teams?: {
    patriots: {
      name: string
      abbreviation: string
      score: number
      timeouts: number
      possession: boolean
    }
    seahawks: {
      name: string
      abbreviation: string
      score: number
      timeouts: number
      possession: boolean
    }
  }
  fieldPosition?: {
    team: string
    yardLine: number
  }
  down?: number
  yardsToGo?: number
  lastPlay?: string
  winProbability?: any
  plays?: Array<{
    id?: string
    text?: string
    period?: number
    clock?: string
    homeScore?: number
    awayScore?: number
  }>
  gameStats?: {
    totalYards: {
      patriots: number
      seahawks: number
    }
    passingYards: {
      patriots: number
      seahawks: number
    }
    rushingYards: {
      patriots: number
      seahawks: number
    }
    turnovers: {
      patriots: number
      seahawks: number
    }
  }
  countdown?: {
    days: number
    hours: number
    minutes: number
    seconds: number
  }
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err: any = new Error(data?.error || 'Request failed')
    err.status = res.status
    err.body = data
    throw err
  }
  return data
}

export default function GameDashboard() {
  const { data: gameData, error } = useSWR<GameData>(
    `${API_URL}/api/game`,
    fetcher,
    {
      refreshInterval: 5000, // Poll every 5 seconds
      revalidateOnFocus: true,
    }
  )

  const waitingForEspn = (error as any)?.status === 503

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">{waitingForEspn ? '⏳' : '⚠️'}</div>
          <h2 className="font-orbitron text-2xl text-white mb-2">
            {waitingForEspn ? "Waiting for ESPN's Live Feed" : 'Game Data Unavailable'}
          </h2>
          <p className="font-montserrat text-gray-400">
            {waitingForEspn
              ? 'The Super Bowl is live, but ESPN has not published the event feed yet. Auto-refreshing every 5 seconds.'
              : 'Unable to fetch real-time game information'}
          </p>
        </div>
      </div>
    )
  }

  if (!gameData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="font-montserrat text-gray-400">Loading game data...</p>
        </div>
      </div>
    )
  }

  // Show countdown if game hasn't started
  if (!gameData.gameStarted && gameData.countdown) {
    return (
      <main className="min-h-screen relative">
        <div className="animated-grid-bg" />
        <div className="fixed inset-0 z-[-1] opacity-30">
          <div className="absolute inset-0 gradient-patriots" style={{ clipPath: 'polygon(0 0, 50% 0, 45% 100%, 0 100%)' }} />
          <div className="absolute inset-0 gradient-seahawks" style={{ clipPath: 'polygon(55% 0, 100% 0, 100% 100%, 50% 100%)' }} />
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="font-bebas text-5xl md:text-7xl lg:text-8xl mb-4 tracking-wider">
              <span className="block text-glow-patriots">GAME STARTING</span>
              <span className="block bg-gradient-to-r from-patriots-red via-white to-seahawks-green bg-clip-text text-transparent">
                SOON
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-black/50 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/10">
              <h2 className="font-orbitron text-3xl md:text-4xl text-center mb-8 text-glow-seahawks">
                ⏱️ KICKOFF COUNTDOWN
              </h2>
              <div className="grid grid-cols-4 gap-4 md:gap-8">
                {[
                  { label: 'DAYS', value: gameData.countdown.days },
                  { label: 'HOURS', value: gameData.countdown.hours },
                  { label: 'MINUTES', value: gameData.countdown.minutes },
                  { label: 'SECONDS', value: gameData.countdown.seconds },
                ].map((item, index) => (
                  <div key={item.label} className="text-center">
                    <motion.div
                      key={`${item.label}-${item.value}`}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="font-orbitron text-4xl md:text-6xl lg:text-7xl font-bold mb-2 bg-gradient-to-br from-patriots-red to-seahawks-green bg-clip-text text-transparent"
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
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen relative">
      <div className="animated-grid-bg" />
      <div className="fixed inset-0 z-[-1] opacity-30">
        <div className="absolute inset-0 gradient-patriots" style={{ clipPath: 'polygon(0 0, 50% 0, 45% 100%, 0 100%)' }} />
        <div className="absolute inset-0 gradient-seahawks" style={{ clipPath: 'polygon(55% 0, 100% 0, 100% 100%, 50% 100%)' }} />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="font-bebas text-4xl md:text-6xl lg:text-7xl mb-2 tracking-wider">
            <span className="block bg-gradient-to-r from-patriots-red via-white to-seahawks-green bg-clip-text text-transparent">
              LIVE GAME DASHBOARD
            </span>
          </h1>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="font-orbitron text-sm text-gray-300">LIVE</span>
          </div>

          {gameData.eventId && (
            <div className="mt-2 font-montserrat text-xs text-gray-500">
              Event: {gameData.eventId}
            </div>
          )}
        </motion.div>

        {/* Score Board */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-6xl mx-auto mb-8"
        >
          <div className="bg-black/60 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl">
            {/* Teams and Scores */}
            <div className="grid grid-cols-3 gap-4 mb-6 items-center">
              {/* Patriots */}
              <div className="text-center">
                <div className={`p-4 rounded-2xl ${gameData.teams?.patriots.possession ? 'bg-patriots-red/20 border-2 border-patriots-red' : 'bg-black/40 border-2 border-white/10'}`}>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/en/b/b9/New_England_Patriots_logo.svg"
                    alt="New England Patriots"
                    className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-2"
                  />
                  <h3 className="font-bebas text-xl md:text-2xl text-patriots-red">PATRIOTS</h3>
                  <div className="font-orbitron text-3xl md:text-4xl font-bold text-white mt-2">
                    {gameData.teams?.patriots.score || 0}
                  </div>
                  {gameData.teams?.patriots.possession && (
                    <div className="mt-2">
                      <div className="inline-flex items-center gap-1 bg-patriots-red text-white px-2 py-1 rounded-full text-xs font-bold">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        BALL
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Game Info */}
              <div className="text-center">
                <div className="bg-black/40 rounded-2xl p-4 border border-white/10">
                  <div className="font-orbitron text-lg md:text-xl text-white mb-2">
                    {gameData.status === 'HALFTIME' ? 'HALFTIME' : `QUARTER ${gameData.quarter}`}
                  </div>
                  <div className="font-orbitron text-2xl md:text-3xl font-bold text-white">
                    {gameData.timeRemaining}
                  </div>
                  {gameData.down && gameData.yardsToGo && (
                    <div className="mt-2 text-sm text-gray-300">
                      {gameData.down} & {gameData.yardsToGo}
                    </div>
                  )}
                </div>
              </div>

              {/* Seahawks */}
              <div className="text-center">
                <div className={`p-4 rounded-2xl ${gameData.teams?.seahawks.possession ? 'bg-seahawks-green/20 border-2 border-seahawks-green' : 'bg-black/40 border-2 border-white/10'}`}>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/en/8/8e/Seattle_Seahawks_logo.svg"
                    alt="Seattle Seahawks"
                    className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-2"
                  />
                  <h3 className="font-bebas text-xl md:text-2xl text-seahawks-green">SEAHAWKS</h3>
                  <div className="font-orbitron text-3xl md:text-4xl font-bold text-white mt-2">
                    {gameData.teams?.seahawks.score || 0}
                  </div>
                  {gameData.teams?.seahawks.possession && (
                    <div className="mt-2">
                      <div className="inline-flex items-center gap-1 bg-seahawks-green text-white px-2 py-1 rounded-full text-xs font-bold">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        BALL
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Field Position */}
            {gameData.fieldPosition && (
              <div className="bg-black/40 rounded-xl p-3 mb-4 border border-white/10">
                <div className="flex items-center justify-between">
                  <span className="font-montserrat text-sm text-gray-400">Field Position:</span>
                  <span className="font-orbitron text-white">
                    {gameData.fieldPosition.team === 'patriots' ? 'NE' : 'SEA'} {gameData.fieldPosition.yardLine}
                  </span>
                </div>
              </div>
            )}

            {/* Last Play */}
            {gameData.lastPlay && (
              <div className="bg-gradient-to-r from-patriots-red/10 to-seahawks-green/10 rounded-xl p-3 border border-white/10">
                <div className="flex items-center gap-2">
                  <span className="font-montserrat text-sm text-gray-400">Last Play:</span>
                  <span className="font-montserrat text-white">{gameData.lastPlay}</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Game Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6"
        >
          {/* Team Stats */}
          <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h3 className="font-orbitron text-xl text-white mb-4 text-center">TEAM STATISTICS</h3>
            <div className="space-y-3">
              {[
                { label: 'Total Yards', patriots: gameData.gameStats?.totalYards.patriots || 0, seahawks: gameData.gameStats?.totalYards.seahawks || 0 },
                { label: 'Passing Yards', patriots: gameData.gameStats?.passingYards.patriots || 0, seahawks: gameData.gameStats?.passingYards.seahawks || 0 },
                { label: 'Rushing Yards', patriots: gameData.gameStats?.rushingYards.patriots || 0, seahawks: gameData.gameStats?.rushingYards.seahawks || 0 },
                { label: 'Turnovers', patriots: gameData.gameStats?.turnovers.patriots || 0, seahawks: gameData.gameStats?.turnovers.seahawks || 0 },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between">
                  <span className="font-montserrat text-sm text-gray-400 w-24">{stat.label}</span>
                  <div className="flex items-center gap-4 flex-1">
                    <span className="font-orbitron text-patriots-red text-sm w-12 text-right">{stat.patriots}</span>
                    <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-patriots-red to-patriots-navy"
                        style={{ width: `${(stat.patriots / Math.max(stat.patriots, stat.seahawks, 1)) * 50}%` }}
                      />
                    </div>
                    <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-l from-seahawks-green to-seahawks-navy"
                        style={{ width: `${(stat.seahawks / Math.max(stat.patriots, stat.seahawks, 1)) * 50}%` }}
                      />
                    </div>
                    <span className="font-orbitron text-seahawks-green text-sm w-12">{stat.seahawks}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Game Info Panel */}
          <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h3 className="font-orbitron text-xl text-white mb-4 text-center">GAME INFORMATION</h3>
            <div className="space-y-4">
              <div className="bg-black/40 rounded-xl p-4 border border-white/10">
                <h4 className="font-montserrat text-sm text-gray-400 mb-2">Super Bowl LX</h4>
                <p className="font-orbitron text-white">February 8, 2026</p>
                <p className="font-montserrat text-gray-300">6:30 PM EST</p>
              </div>
              <div className="bg-black/40 rounded-xl p-4 border border-white/10">
                <h4 className="font-montserrat text-sm text-gray-400 mb-2">Venue</h4>
                <p className="font-orbitron text-white">Levi's Stadium</p>
                <p className="font-montserrat text-gray-300">Santa Clara, California</p>
              </div>
              <div className="bg-gradient-to-r from-patriots-red/10 to-seahawks-green/10 rounded-xl p-4 border border-white/10">
                <p className="font-montserrat text-xs text-gray-400 text-center">
                  Data refreshes every 5 seconds
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Play-by-Play */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="max-w-6xl mx-auto mt-6"
        >
          <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-orbitron text-xl text-white">PLAY-BY-PLAY</h3>
              <div className="font-montserrat text-xs text-gray-400">
                Latest 12 plays
              </div>
            </div>

            {(!gameData.plays || gameData.plays.length === 0) ? (
              <div className="text-center py-10">
                <div className="text-5xl mb-3">📡</div>
                <div className="font-orbitron text-white">Waiting for play-by-play…</div>
                <div className="font-montserrat text-sm text-gray-400 mt-1">
                  This will populate as soon as ESPN publishes drives/plays.
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {gameData.plays.map((p, idx) => (
                  <div
                    key={p.id || idx}
                    className="bg-black/40 rounded-xl p-4 border border-white/10"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="font-montserrat text-white text-sm md:text-base truncate">
                          {p.text || '—'}
                        </div>
                        <div className="font-montserrat text-xs text-gray-400 mt-1">
                          {typeof p.period === 'number' ? `Q${p.period}` : '—'}
                          {' · '}
                          {p.clock || '—'}
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <div className="font-orbitron text-xs text-gray-400">SCORE</div>
                        <div className="font-orbitron text-white">
                          {(typeof p.homeScore === 'number' ? p.homeScore : '—')}
                          {' - '}
                          {(typeof p.awayScore === 'number' ? p.awayScore : '—')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  )
}
