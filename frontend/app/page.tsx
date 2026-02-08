'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { fetchGameData } from '@/lib/espn-api'
import ScoreboardHeader from '@/components/ScoreboardHeader'
import CountdownOrClock from '@/components/CountdownOrClock'
import LiveScoreBox from '@/components/LiveScoreBox'
import WinProbabilityGauge from '@/components/WinProbabilityGauge'
import WinProbabilityChart from '@/components/WinProbabilityChart'
import PlayByPlayFeed from '@/components/PlayByPlayFeed'
import ScoringSummary from '@/components/ScoringSummary'
import BoxScoreTables from '@/components/BoxScoreTables'
import PlayerLeaders from '@/components/PlayerLeaders'
import GameStateOverlay from '@/components/GameStateOverlay'
import TabsNavigation from '@/components/TabsNavigation'

/**
 * Super Bowl LX Live Dashboard - Main Page
 * Real-time game tracker with ESPN API integration
 */
export default function Home() {
  // Fetch game data with TanStack Query (auto-refetch every 10 seconds)
  const { data: gameData, error, isLoading } = useQuery({
    queryKey: ['gameData'],
    queryFn: fetchGameData,
    refetchInterval: 10 * 1000, // Poll every 10 seconds
    refetchOnWindowFocus: true,
    retry: 3,
  })

  // Show error toast if there's an error
  if (error) {
    toast.error('Failed to fetch game data')
    console.error('Game data error:', error)
  }

  // Loading state
  if (isLoading || !gameData) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animated-grid-bg" />
        <div className="text-center relative z-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-t-patriots-red border-r-seahawks-green border-b-patriots-red border-l-seahawks-green rounded-full mx-auto mb-6"
          />
          <h2 className="font-orbitron text-2xl text-white mb-2">
            Loading Super Bowl LX
          </h2>
          <p className="font-montserrat text-gray-400">
            Connecting to live game data...
          </p>
        </div>
      </main>
    )
  }

  // Error state
  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animated-grid-bg" />
        <div className="text-center relative z-10 max-w-2xl mx-auto px-4">
          <div className="text-6xl mb-6">⚠️</div>
          <h2 className="font-orbitron text-3xl text-white mb-4">
            Unable to Load Game Data
          </h2>
          <p className="font-montserrat text-gray-400 mb-6">
            {error instanceof Error ? error.message : 'An error occurred while fetching game data'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-patriots-red to-seahawks-green text-white px-6 py-3 rounded-lg font-bebas text-lg hover:scale-105 transition-transform"
          >
            Retry
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen relative">
      {/* Animated Grid Background */}
      <div className="animated-grid-bg" />

      {/* Split Gradient Background */}
      <div className="fixed inset-0 z-[-1] opacity-30">
        <div
          className="absolute inset-0 gradient-patriots"
          style={{ clipPath: 'polygon(0 0, 50% 0, 45% 100%, 0 100%)' }}
        />
        <div
          className="absolute inset-0 gradient-seahawks"
          style={{ clipPath: 'polygon(55% 0, 100% 0, 100% 100%, 50% 100%)' }}
        />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 lg:py-12 relative z-10">
        {/* Hero Header */}
        <ScoreboardHeader />

        {/* Countdown or Game Clock */}
        <CountdownOrClock gameData={gameData} />

        {/* Live Scoreboard (only show if game started) */}
        {gameData.gameStarted && gameData.teams && (
          <>
            <LiveScoreBox gameData={gameData} />

            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Win Probability */}
              {gameData.winProbability && (
                <WinProbabilityGauge gameData={gameData} />
              )}

              {/* Scoring Summary */}
              <ScoringSummary gameData={gameData} />
            </div>

            {/* Tabbed Content */}
            <div className="mb-8">
              <TabsNavigation
                tabs={[
                  {
                    id: 'plays',
                    label: 'PLAY-BY-PLAY',
                    icon: '🏈',
                    content: <PlayByPlayFeed gameData={gameData} />,
                  },
                  {
                    id: 'stats',
                    label: 'BOX SCORE',
                    icon: '📊',
                    content: <BoxScoreTables gameData={gameData} />,
                  },
                  {
                    id: 'leaders',
                    label: 'LEADERS',
                    icon: '⭐',
                    content: <PlayerLeaders gameData={gameData} />,
                  },
                  {
                    id: 'winprob',
                    label: 'WIN PROB',
                    icon: '📈',
                    content: <WinProbabilityChart gameData={gameData} />,
                  },
                ]}
              />
            </div>
          </>
        )}

        {/* Pre-game message */}
        {!gameData.gameStarted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-black/50 backdrop-blur-md rounded-2xl p-8 border border-white/10 text-center">
              <div className="text-6xl mb-4">🏈</div>
              <h2 className="font-bebas text-4xl md:text-5xl bg-gradient-to-r from-patriots-red via-white to-seahawks-green bg-clip-text text-transparent mb-4">
                GET READY FOR KICKOFF!
              </h2>
              <p className="font-montserrat text-lg text-gray-300 mb-6">
                The biggest game of the year is almost here. The dashboard will automatically
                update with live scores, stats, and play-by-play action once the game begins.
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div className="bg-black/40 rounded-xl p-4 border border-white/10">
                  <h3 className="font-orbitron text-white mb-2">📺 Broadcast</h3>
                  <p className="font-montserrat text-sm text-gray-400">NBC / Peacock</p>
                </div>
                <div className="bg-black/40 rounded-xl p-4 border border-white/10">
                  <h3 className="font-orbitron text-white mb-2">📍 Venue</h3>
                  <p className="font-montserrat text-sm text-gray-400">
                    Levi's Stadium, Santa Clara, CA
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Auto-refresh indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-montserrat text-xs text-gray-400">
              Auto-updating every 10 seconds
            </span>
          </div>
        </motion.div>
      </div>

      {/* Game State Overlays (Halftime, Final) */}
      <GameStateOverlay gameData={gameData} />
    </main>
  )
}
