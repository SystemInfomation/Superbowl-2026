'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import confetti from 'canvas-confetti'
import useSWR from 'swr'

const API_URL = 'https://superbowl-2026.onrender.com'
const KICKOFF_DATE = new Date('2026-02-08T18:30:00-05:00')
const STORAGE_KEY = 'sb2026-voted'

interface VoteData {
  patriots: number
  seahawks: number
  total: number
  percentages: {
    patriots: number
    seahawks: number
  }
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Home() {
  const [hasVoted, setHasVoted] = useState(false)
  const [isVotingClosed, setIsVotingClosed] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  const { data: voteData, mutate } = useSWR<VoteData>(
    `${API_URL}/api/votes`,
    fetcher,
    {
      refreshInterval: 5000, // Poll every 5 seconds
      fallbackData: {
        patriots: 0,
        seahawks: 0,
        total: 0,
        percentages: { patriots: 0, seahawks: 0 },
      },
    }
  )

  useEffect(() => {
    // Check if user has already voted
    const voted = localStorage.getItem(STORAGE_KEY)
    if (voted === 'true') {
      setHasVoted(true)
    }

    // Update countdown timer
    const interval = setInterval(() => {
      const now = new Date()
      const difference = KICKOFF_DATE.getTime() - now.getTime()

      if (difference <= 0) {
        setIsVotingClosed(true)
        clearInterval(interval)
        triggerConfetti()
        return
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((difference / 1000 / 60) % 60)
      const seconds = Math.floor((difference / 1000) % 60)

      setTimeRemaining({ days, hours, minutes, seconds })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const triggerConfetti = () => {
    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    }, 250)
  }

  const handleVote = async (team: 'patriots' | 'seahawks') => {
    if (hasVoted) {
      toast.error("You've already voted!")
      return
    }

    if (isVotingClosed) {
      toast.error('Voting is closed!')
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/votes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ team }),
      })

      const data = await response.json()

      if (response.ok) {
        setHasVoted(true)
        localStorage.setItem(STORAGE_KEY, 'true')
        toast.success('Vote confirmed! 🎉')
        triggerConfetti()
        mutate() // Refresh vote data
      } else {
        toast.error(data.error || 'Failed to record vote')
      }
    } catch (error) {
      console.error('Error voting:', error)
      toast.error('Failed to submit vote. Please try again.')
    }
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  const canVote = !hasVoted && !isVotingClosed

  return (
    <main className="min-h-screen relative">
      {/* Animated Grid Background */}
      <div className="animated-grid-bg" />

      {/* Split Gradient Background */}
      <div className="fixed inset-0 z-[-1] opacity-30">
        <div className="absolute inset-0 gradient-patriots" style={{ clipPath: 'polygon(0 0, 50% 0, 45% 100%, 0 100%)' }} />
        <div className="absolute inset-0 gradient-seahawks" style={{ clipPath: 'polygon(55% 0, 100% 0, 100% 100%, 50% 100%)' }} />
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-12 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="font-bebas text-5xl md:text-7xl lg:text-8xl xl:text-9xl mb-4 tracking-wider">
            <span className="block text-glow-patriots">WHO WILL WIN</span>
            <span className="block bg-gradient-to-r from-patriots-red via-white to-seahawks-green bg-clip-text text-transparent">
              SUPER BOWL LX?
            </span>
          </h1>
          <p className="font-montserrat text-lg md:text-xl lg:text-2xl text-gray-300">
            New England Patriots vs. Seattle Seahawks
          </p>
          <p className="font-montserrat text-md md:text-lg text-gray-400 mt-2">
            February 8, 2026
          </p>
        </motion.div>

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="max-w-4xl mx-auto bg-black/50 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/10">
            <h2 className="font-orbitron text-2xl md:text-3xl text-center mb-6 text-glow-seahawks">
              ⏱️ KICKOFF COUNTDOWN
            </h2>
            <div className="grid grid-cols-4 gap-4 md:gap-8">
              {[
                { label: 'DAYS', value: timeRemaining.days },
                { label: 'HOURS', value: timeRemaining.hours },
                { label: 'MINUTES', value: timeRemaining.minutes },
                { label: 'SECONDS', value: timeRemaining.seconds },
              ].map((item, index) => (
                <div key={item.label} className="text-center">
                  <motion.div
                    key={`${item.label}-${item.value}`}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="font-orbitron text-4xl md:text-5xl lg:text-6xl font-bold mb-2 bg-gradient-to-br from-patriots-red to-seahawks-green bg-clip-text text-transparent"
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

        {/* Voting Closed Banner */}
        <AnimatePresence>
          {isVotingClosed && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto mb-8"
            >
              <div className="bg-gradient-to-r from-patriots-red to-seahawks-green p-1 rounded-2xl">
                <div className="bg-black rounded-2xl p-6 text-center">
                  <h3 className="font-bebas text-3xl md:text-4xl mb-2">
                    🏈 VOTING LOCKED
                  </h3>
                  <p className="font-montserrat text-lg">
                    The game has started! Final results below.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Team Cards */}
        {!isVotingClosed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12 max-w-6xl mx-auto"
          >
            {/* Patriots Card */}
            <motion.button
              onClick={() => handleVote('patriots')}
              disabled={!canVote}
              whileHover={canVote ? { scale: 1.05, y: -10 } : {}}
              whileTap={canVote ? { scale: 0.98 } : {}}
              className={`relative group ${
                canVote ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
              }`}
            >
              <div className="bg-gradient-to-br from-patriots-navy to-patriots-red/20 border-2 border-patriots-red/30 rounded-3xl p-8 md:p-12 transition-all duration-300 group-hover:border-patriots-red group-hover:neon-glow-patriots">
                <div className="flex flex-col items-center">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/en/b/b9/New_England_Patriots_logo.svg"
                    alt="New England Patriots"
                    className="w-32 h-32 md:w-48 md:h-48 mb-6 animate-float"
                  />
                  <h3 className="font-bebas text-4xl md:text-5xl text-patriots-red text-glow-patriots mb-2">
                    NEW ENGLAND
                  </h3>
                  <h3 className="font-bebas text-4xl md:text-5xl text-patriots-red text-glow-patriots">
                    PATRIOTS
                  </h3>
                  {canVote && (
                    <p className="font-montserrat text-sm md:text-base text-white/80 mt-4">
                      Click to vote
                    </p>
                  )}
                </div>
              </div>
            </motion.button>

            {/* Seahawks Card */}
            <motion.button
              onClick={() => handleVote('seahawks')}
              disabled={!canVote}
              whileHover={canVote ? { scale: 1.05, y: -10 } : {}}
              whileTap={canVote ? { scale: 0.98 } : {}}
              className={`relative group ${
                canVote ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
              }`}
            >
              <div className="bg-gradient-to-br from-seahawks-navy to-seahawks-green/20 border-2 border-seahawks-green/30 rounded-3xl p-8 md:p-12 transition-all duration-300 group-hover:border-seahawks-green group-hover:neon-glow-seahawks">
                <div className="flex flex-col items-center">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/en/8/8e/Seattle_Seahawks_logo.svg"
                    alt="Seattle Seahawks"
                    className="w-32 h-32 md:w-48 md:h-48 mb-6 animate-float"
                  />
                  <h3 className="font-bebas text-4xl md:text-5xl text-seahawks-green text-glow-seahawks mb-2">
                    SEATTLE
                  </h3>
                  <h3 className="font-bebas text-4xl md:text-5xl text-seahawks-green text-glow-seahawks">
                    SEAHAWKS
                  </h3>
                  {canVote && (
                    <p className="font-montserrat text-sm md:text-base text-white/80 mt-4">
                      Click to vote
                    </p>
                  )}
                </div>
              </div>
            </motion.button>
          </motion.div>
        )}

        {/* Live Results */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <div className="bg-black/50 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/10">
            <h2 className="font-orbitron text-2xl md:text-3xl text-center mb-6">
              📊 LIVE RESULTS
            </h2>

            {/* Vote Counts */}
            <div className="grid md:grid-cols-3 gap-4 mb-6 text-center">
              <div>
                <div className="font-bebas text-3xl md:text-4xl text-patriots-red">
                  {formatNumber(voteData?.patriots || 0)}
                </div>
                <div className="font-montserrat text-sm text-gray-400">Patriots Votes</div>
              </div>
              <div>
                <div className="font-bebas text-3xl md:text-4xl text-white">
                  {formatNumber(voteData?.total || 0)}
                </div>
                <div className="font-montserrat text-sm text-gray-400">Total Votes</div>
              </div>
              <div>
                <div className="font-bebas text-3xl md:text-4xl text-seahawks-green">
                  {formatNumber(voteData?.seahawks || 0)}
                </div>
                <div className="font-montserrat text-sm text-gray-400">Seahawks Votes</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-16 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${voteData?.percentages.patriots || 0}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-patriots-red to-patriots-navy flex items-center justify-start pl-4"
              >
                <span className="font-bebas text-xl md:text-2xl text-white">
                  {voteData?.percentages.patriots || 0}%
                </span>
              </motion.div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${voteData?.percentages.seahawks || 0}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="absolute right-0 top-0 h-full bg-gradient-to-l from-seahawks-green to-seahawks-navy flex items-center justify-end pr-4"
              >
                <span className="font-bebas text-xl md:text-2xl text-white">
                  {voteData?.percentages.seahawks || 0}%
                </span>
              </motion.div>
            </div>

            {/* Labels */}
            <div className="flex justify-between mt-4">
              <div className="font-montserrat text-sm md:text-base text-patriots-red font-semibold">
                Patriots
              </div>
              <div className="font-montserrat text-sm md:text-base text-seahawks-green font-semibold">
                Seahawks
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-12 text-gray-500 font-montserrat text-sm"
        >
          <p>Super Bowl LX (2026) - Voting Application</p>
          <p className="mt-2">Built with Next.js, Express, MongoDB & ❤️</p>
        </motion.div>
      </div>
    </main>
  )
}
