/**
 * TypeScript types for Super Bowl LX Live Dashboard
 * Based on ESPN API response structure
 */

export interface TeamData {
  name: string
  abbreviation: string
  score: number
  timeouts: number
  possession: boolean
  record?: any
  logo?: string
  stats?: Record<string, any>
  players?: PlayerData[]
}

export interface PlayerData {
  id?: string
  name?: string
  position?: string
  jersey?: string
  stats?: any[]
  headshot?: string
}

export interface FieldPosition {
  team: 'patriots' | 'seahawks'
  yardLine: number
}

export interface Play {
  id?: string
  text?: string
  period?: number
  clock?: string
  homeScore?: number
  awayScore?: number
  type?: {
    text?: string
  }
  scoringPlay?: boolean
}

export interface ScoringPlay {
  id?: string
  text?: string
  period?: number
  clock?: string
  scoringTeam?: string
  type?: string
  points?: number
}

export interface Drive {
  team?: string
  plays?: number
  yards?: number
  result?: string
  startTime?: string
  endTime?: string
}

export interface WinProbability {
  tiePercentage?: number
  homeWinPercentage?: number
  awayWinPercentage?: number
  playId?: string
}

export interface Leader {
  name: string
  displayName: string
  leaders: {
    displayValue: string
    value: number
    athlete: {
      id: string
      displayName: string
      shortName: string
      headshot?: string
    }
  }[]
}

export interface Venue {
  name?: string
  city?: string
  state?: string
  capacity?: number
}

export interface GameData {
  gameStarted: boolean
  eventId?: string
  status: 'PREGAME' | 'LIVE' | 'HALFTIME' | 'FINAL'
  quarter?: number
  timeRemaining?: string
  teams?: {
    patriots: TeamData
    seahawks: TeamData
  }
  fieldPosition?: FieldPosition
  down?: number
  yardsToGo?: number
  lastPlay?: string
  winProbability?: WinProbability | null
  plays?: Play[]
  scoringPlays?: ScoringPlay[]
  drives?: {
    current: Drive | null
    all: Drive[]
  }
  leaders?: Leader[] | null
  weather?: any
  venue?: Venue
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

export interface ESPNTeamStats {
  name: string
  displayValue: string
  value?: number | string
}

export interface ESPNPlayerStats {
  name: string
  displayValue: string
  value?: number | string
}
