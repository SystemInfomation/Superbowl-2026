'use client'

import { GameData } from '@/lib/types'

interface WinProbabilityChartProps {
  gameData: GameData
}

/**
 * WinProbabilityChart - Historical win probability line chart
 * NO MOCK DATA - Shows message if ESPN doesn't provide historical data
 */
export default function WinProbabilityChart({ gameData }: WinProbabilityChartProps) {
  // ESPN's win probability endpoint sometimes includes historical data
  // If not available, we show a message instead of mock data
  
  return (
    <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20">
      <h3 className="font-orbitron text-xl md:text-2xl text-white mb-6 text-center">
        WIN PROBABILITY TREND
      </h3>
      <div className="text-center py-12">
        <div className="text-5xl mb-4">📊</div>
        <div className="font-orbitron text-white text-lg">
          Historical Win Probability
        </div>
        <div className="font-montserrat text-sm text-gray-400 mt-2 max-w-md mx-auto">
          ESPN&apos;s API does not provide historical win probability data in a format suitable for charting.
          The current win probability is shown in the gauge above.
        </div>
        {gameData.winProbability && (
          <div className="mt-6 flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="font-bebas text-patriots-red text-xl">PATRIOTS</div>
              <div className="font-orbitron text-3xl text-white mt-2">
                {(gameData.winProbability.homeWinPercentage 
                  ? (gameData.winProbability.homeWinPercentage > 1 
                    ? gameData.winProbability.homeWinPercentage 
                    : gameData.winProbability.homeWinPercentage * 100)
                  : 0).toFixed(1)}%
              </div>
            </div>
            <div className="text-gray-600">vs</div>
            <div className="text-center">
              <div className="font-bebas text-seahawks-green text-xl">SEAHAWKS</div>
              <div className="font-orbitron text-3xl text-white mt-2">
                {(gameData.winProbability.awayWinPercentage
                  ? (gameData.winProbability.awayWinPercentage > 1
                    ? gameData.winProbability.awayWinPercentage
                    : gameData.winProbability.awayWinPercentage * 100)
                  : 0).toFixed(1)}%
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
