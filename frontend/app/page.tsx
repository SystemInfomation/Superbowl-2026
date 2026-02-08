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
  const [showShareDialog, setShowShareDialog] = useState(false)
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
        
        // Show share dialog after a short delay
        setTimeout(() => {
          setShowShareDialog(true)
        }, 2000)
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

  const shareUrl = typeof window !== 'undefined' ? window.location.origin : 'https://superbowl-2026.vercel.app'
  const shareText = "I just voted for Super Bowl LX 2026! 🏈 Who do you think will win - Patriots or Seahawks? Cast your vote now!"

  const handleShare = async (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl)
    const encodedText = encodeURIComponent(shareText)
    
    let url = ''
    
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`
        break
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        break
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
        break
      case 'copy':
        try {
          await navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
          toast.success('Link copied to clipboard! 📋')
          setShowShareDialog(false)
        } catch (error) {
          toast.error('Failed to copy link')
        }
        return
      default:
        return
    }
    
    window.open(url, '_blank', 'width=600,height=400')
    setShowShareDialog(false)
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
      </div>

      {/* Share Dialog */}
      <AnimatePresence>
        {showShareDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowShareDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-md w-full border border-white/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="font-bebas text-3xl text-white mb-2">Share Your Vote!</h2>
                <p className="font-montserrat text-gray-300">
                  Let your friends know who you're rooting for in Super Bowl LX 2026!
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={() => handleShare('twitter')}
                  className="flex items-center justify-center gap-2 bg-black/50 hover:bg-black/70 text-white py-3 px-4 rounded-lg transition-all hover:scale-105 border border-white/10"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  <span className="font-montserrat text-sm">Twitter</span>
                </button>

                <button
                  onClick={() => handleShare('facebook')}
                  className="flex items-center justify-center gap-2 bg-[#1877f2] hover:bg-[#166fe5] text-white py-3 px-4 rounded-lg transition-all hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="font-montserrat text-sm">Facebook</span>
                </button>

                <button
                  onClick={() => handleShare('linkedin')}
                  className="flex items-center justify-center gap-2 bg-[#0077b5] hover:bg-[#00669c] text-white py-3 px-4 rounded-lg transition-all hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span className="font-montserrat text-sm">LinkedIn</span>
                </button>

                <button
                  onClick={() => handleShare('copy')}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-patriots-red to-seahawks-green hover:from-patriots-navy hover:to-seahawks-navy text-white py-3 px-4 rounded-lg transition-all hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span className="font-montserrat text-sm">Copy Link</span>
                </button>
              </div>

              <button
                onClick={() => setShowShareDialog(false)}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-all font-montserrat"
              >
                Maybe Later
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
