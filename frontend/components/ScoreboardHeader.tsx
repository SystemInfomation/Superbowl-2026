'use client'

import { motion } from 'framer-motion'

/**
 * ScoreboardHeader - Hero section with title, team logos, and game info
 */
export default function ScoreboardHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center mb-8 md:mb-12"
    >
      {/* Main Title */}
      <h1 className="font-bebas text-4xl md:text-6xl lg:text-8xl mb-4 tracking-wider animate-float">
        <span className="block bg-gradient-to-r from-patriots-red via-white to-seahawks-green bg-clip-text text-transparent drop-shadow-2xl">
          SUPER BOWL LX LIVE
        </span>
      </h1>

      {/* Subtitle */}
      <div className="font-montserrat text-sm md:text-base lg:text-lg text-gray-300 mb-6">
        <p className="mb-2">
          Seattle Seahawks vs. New England Patriots
        </p>
        <p className="text-gray-400">
          Levi's Stadium • Santa Clara, CA • February 8, 2026 • 6:30 PM EST
        </p>
        <p className="text-gray-500 text-xs mt-2">
          Broadcast: NBC / Peacock
        </p>
      </div>

      {/* Team Logos */}
      <div className="flex items-center justify-center gap-8 md:gap-16 mt-8">
        {/* Seahawks Logo (Away) */}
        <motion.div
          whileHover={{ scale: 1.15, rotateZ: 5 }}
          className="flex flex-col items-center hover-3d"
        >
          <div className="relative">
            <img
              src="https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/sea.png"
              alt="Seattle Seahawks"
              className="w-20 h-20 md:w-32 md:h-32 lg:w-40 lg:h-40 mb-3 drop-shadow-2xl"
            />
            <div className="absolute inset-0 bg-seahawks-green/20 rounded-full blur-3xl animate-pulse-glow"></div>
          </div>
          <div className="font-bebas text-xl md:text-2xl text-seahawks-green text-glow-seahawks">
            SEAHAWKS
          </div>
          <div className="font-montserrat text-xs text-gray-500">
            AWAY
          </div>
        </motion.div>

        {/* VS Divider */}
        <div className="flex flex-col items-center">
          <div className="font-bebas text-3xl md:text-5xl text-white opacity-50 animate-pulse">
            VS
          </div>
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-white to-transparent mt-2"></div>
        </div>

        {/* Patriots Logo (Home) */}
        <motion.div
          whileHover={{ scale: 1.15, rotateZ: -5 }}
          className="flex flex-col items-center hover-3d"
        >
          <div className="relative">
            <img
              src="https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/ne.png"
              alt="New England Patriots"
              className="w-20 h-20 md:w-32 md:h-32 lg:w-40 lg:h-40 mb-3 drop-shadow-2xl"
            />
            <div className="absolute inset-0 bg-patriots-red/20 rounded-full blur-3xl animate-pulse-glow"></div>
          </div>
          <div className="font-bebas text-xl md:text-2xl text-patriots-red text-glow-patriots">
            PATRIOTS
          </div>
          <div className="font-montserrat text-xs text-gray-500">
            HOME
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
