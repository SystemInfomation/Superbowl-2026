/**
 * ESPN API client for Super Bowl LX Live Dashboard
 * Fetches real-time game data from backend which connects to ESPN
 * Enhanced with retry logic and comprehensive error handling
 */

import { GameData } from './types'

// Backend API URL - use environment variable or fallback to production
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://superbowl-2026.onrender.com'

// Retry configuration
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

/**
 * Sleep utility for retry delays
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Fetch with retry logic
 */
async function fetchWithRetry(url: string, options: RequestInit, retries = MAX_RETRIES): Promise<Response> {
  try {
    const response = await fetch(url, options)
    
    // If response is ok, return it
    if (response.ok) {
      return response
    }
    
    // If it's a client error (4xx), don't retry
    if (response.status >= 400 && response.status < 500) {
      return response
    }
    
    // For server errors (5xx), retry
    if (retries > 0) {
      console.warn(`API request failed with status ${response.status}, retrying... (${retries} retries left)`)
      await sleep(RETRY_DELAY)
      return fetchWithRetry(url, options, retries - 1)
    }
    
    return response
  } catch (error) {
    // Network errors - retry if retries left
    if (retries > 0) {
      console.warn(`Network error, retrying... (${retries} retries left)`, error)
      await sleep(RETRY_DELAY)
      return fetchWithRetry(url, options, retries - 1)
    }
    
    throw error
  }
}

/**
 * Fetch current game data from backend
 * Backend handles ESPN API calls and parsing
 * NO MOCK DATA - all real ESPN data
 */
export async function fetchGameData(): Promise<GameData> {
  try {
    const response = await fetchWithRetry(`${API_URL}/api/game`, {
      headers: {
        'Content-Type': 'application/json',
      },
      // Don't cache on client side - we want fresh data
      cache: 'no-store',
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ 
        error: `HTTP ${response.status}: Failed to fetch game data` 
      }))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    const data = await response.json()
    
    // Validate response structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format from API')
    }
    
    return data as GameData
  } catch (error) {
    console.error('Error fetching game data:', error)
    
    // Enhance error message for better user experience
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the game server. Please check your internet connection.')
    }
    
    throw error
  }
}

/**
 * Helper to format time remaining in game clock
 */
export function formatGameClock(timeRemaining?: string): string {
  if (!timeRemaining) return '0:00'
  return timeRemaining
}

/**
 * Helper to get possession indicator
 */
export function getPossessionTeam(gameData: GameData): 'patriots' | 'seahawks' | null {
  if (!gameData.teams) return null
  if (gameData.teams.patriots.possession) return 'patriots'
  if (gameData.teams.seahawks.possession) return 'seahawks'
  return null
}

/**
 * Helper to format down and distance
 */
export function formatDownAndDistance(down?: number, yardsToGo?: number): string {
  if (!down || !yardsToGo) return ''
  
  const downText = 
    down === 1 ? '1st' :
    down === 2 ? '2nd' :
    down === 3 ? '3rd' :
    down === 4 ? '4th' : `${down}th`
  
  return `${downText} & ${yardsToGo}`
}

/**
 * Helper to get field position string
 */
export function formatFieldPosition(fieldPosition?: { team: string; yardLine: number }): string {
  if (!fieldPosition) return ''
  
  const teamAbbr = fieldPosition.team === 'patriots' ? 'NE' : 'SEA'
  return `${teamAbbr} ${fieldPosition.yardLine}`
}

/**
 * Helper to determine if game is in red zone
 */
export function isInRedZone(fieldPosition?: { team: string; yardLine: number }): boolean {
  if (!fieldPosition) return false
  // Red zone is inside opponent's 20-yard line
  // This is a simplified check - real implementation would need more context
  return fieldPosition.yardLine >= 80 || fieldPosition.yardLine <= 20
}

/**
 * Helper to get quarter display string
 */
export function getQuarterDisplay(quarter?: number, status?: string): string {
  if (status === 'HALFTIME') return 'Halftime'
  if (status === 'FINAL') return 'Final'
  if (status === 'PREGAME') return 'Pre-game'
  if (!quarter) return ''
  
  if (quarter === 5) return 'OT'
  if (quarter > 5) return `OT ${quarter - 4}`
  
  return `Q${quarter}`
}

/**
 * Helper to determine game phase
 */
export function getGamePhase(gameData: GameData): 'pregame' | 'live' | 'halftime' | 'final' {
  if (!gameData.gameStarted) return 'pregame'
  if (gameData.status === 'FINAL') return 'final'
  if (gameData.status === 'HALFTIME') return 'halftime'
  return 'live'
}

/**
 * Helper to get winning team
 */
export function getWinningTeam(gameData: GameData): 'patriots' | 'seahawks' | 'tie' | null {
  if (!gameData.teams) return null
  
  const patriotsScore = gameData.teams.patriots.score
  const seahawksScore = gameData.teams.seahawks.score
  
  if (patriotsScore > seahawksScore) return 'patriots'
  if (seahawksScore > patriotsScore) return 'seahawks'
  if (patriotsScore === seahawksScore && gameData.status === 'FINAL') return 'tie'
  
  return null
}
