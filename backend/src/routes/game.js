const express = require('express');
const axios = require('axios');

const router = express.Router();

// Tonight's Super Bowl only
const SUPER_BOWL_DATE_YYYYMMDD = '20260208';
const SUPER_BOWL_KICKOFF = new Date('2026-02-08T18:30:00-05:00');
const SUPER_BOWL_TEAMS = {
  homeAbbr: 'NE',
  awayAbbr: 'SEA'
};

// ESPN endpoints
const ESPN_SCOREBOARD = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard';
const ESPN_SUMMARY = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary';
const ESPN_PBP = 'https://cdn.espn.com/core/nfl/playbyplay';

const ESPN_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};

const countdownToKickoff = () => {
  const now = new Date();
  const diff = SUPER_BOWL_KICKOFF.getTime() - now.getTime();
  const safe = Math.max(0, diff);

  const days = Math.floor(safe / (1000 * 60 * 60 * 24));
  const hours = Math.floor((safe / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((safe / 1000 / 60) % 60);
  const seconds = Math.floor((safe / 1000) % 60);

  return { days, hours, minutes, seconds };
};

const isSuperBowlTeamPair = (competition) => {
  const competitors = competition?.competitors || [];
  const abbrs = competitors
    .map((c) => c?.team?.abbreviation)
    .filter(Boolean);

  return abbrs.includes(SUPER_BOWL_TEAMS.homeAbbr) && abbrs.includes(SUPER_BOWL_TEAMS.awayAbbr);
};

const findSuperBowlEventId = async () => {
  const { data } = await axios.get(ESPN_SCOREBOARD, {
    params: {
      dates: SUPER_BOWL_DATE_YYYYMMDD,
      seasontype: 3
    },
    headers: ESPN_HEADERS,
    timeout: 10000
  });

  const events = data?.events || [];
  const event = events.find((e) => isSuperBowlTeamPair(e?.competitions?.[0]));
  return event?.id || null;
};

const pickTeam = (competitors, abbr) => {
  return competitors.find((c) => c?.team?.abbreviation === abbr) || null;
};

const mapSummaryToDashboard = (eventId, summaryJson, pbpJson) => {
  const header = summaryJson?.header;
  const competition = summaryJson?.header?.competitions?.[0];
  const competitors = competition?.competitors || [];

  const ne = pickTeam(competitors, SUPER_BOWL_TEAMS.homeAbbr);
  const sea = pickTeam(competitors, SUPER_BOWL_TEAMS.awayAbbr);

  const situation = summaryJson?.situation;
  const possessionAbbr = situation?.possession || situation?.possessionText;

  const drives = summaryJson?.drives;
  const currentDrive = drives?.current;
  const lastPlayText = currentDrive?.plays?.[0]?.text || summaryJson?.lastPlay?.text;

  const recentPlays = pbpJson?.gamepackageJSON?.plays || [];
  const timeline = recentPlays.slice(0, 12).map((p) => ({
    id: p?.id,
    text: p?.text,
    period: p?.period?.number,
    clock: p?.clock?.displayValue,
    homeScore: p?.homeScore,
    awayScore: p?.awayScore
  }));

  const status = header?.competitions?.[0]?.status?.type?.state;
  const statusText = header?.competitions?.[0]?.status?.type?.shortDetail;
  const period = header?.competitions?.[0]?.status?.period;
  const clock = header?.competitions?.[0]?.status?.displayClock;

  // Extract team statistics
  const getTeamStats = (team) => {
    const stats = team?.statistics || [];
    const statMap = {};
    stats.forEach(stat => {
      statMap[stat.name] = stat.value;
    });
    return statMap;
  };

  // Extract player statistics
  const getPlayerStats = (team) => {
    const players = team?.roster?.players || [];
    return players.map(player => ({
      id: player?.id,
      name: player?.displayName,
      position: player?.position?.abbreviation,
      jersey: player?.jersey,
      stats: player?.statistics || [],
      headshot: player?.headshot?.href
    })).filter(p => p.stats.length > 0); // Only include players with stats
  };

  // Extract scoring plays
  const getScoringPlays = () => {
    const scoringPlays = summaryJson?.scoringPlays || [];
    return scoringPlays.map(play => ({
      id: play?.id,
      text: play?.text,
      period: play?.period?.number,
      clock: play?.clock?.displayValue,
      scoringTeam: play?.team?.abbreviation,
      type: play?.type?.text,
      points: play?.points
    }));
  };

  const gameStarted = new Date() >= SUPER_BOWL_KICKOFF;

  return {
    gameStarted,
    eventId,
    status: status === 'in' ? 'LIVE' : status === 'post' ? 'FINAL' : 'PREGAME',
    quarter: typeof period === 'number' ? period : undefined,
    timeRemaining: clock || statusText || undefined,
    teams: {
      patriots: {
        name: ne?.team?.displayName,
        abbreviation: ne?.team?.abbreviation,
        score: Number(ne?.score ?? 0),
        timeouts: ne?.timeouts,
        possession: possessionAbbr === SUPER_BOWL_TEAMS.homeAbbr,
        record: ne?.team?.record,
        logo: ne?.team?.logo,
        stats: getTeamStats(ne),
        players: getPlayerStats(ne)
      },
      seahawks: {
        name: sea?.team?.displayName,
        abbreviation: sea?.team?.abbreviation,
        score: Number(sea?.score ?? 0),
        timeouts: sea?.timeouts,
        possession: possessionAbbr === SUPER_BOWL_TEAMS.awayAbbr,
        record: sea?.team?.record,
        logo: sea?.team?.logo,
        stats: getTeamStats(sea),
        players: getPlayerStats(sea)
      }
    },
    fieldPosition: situation?.yardLine ? {
      team: (situation?.possession === SUPER_BOWL_TEAMS.homeAbbr || possessionAbbr === SUPER_BOWL_TEAMS.homeAbbr) ? 'patriots' : 'seahawks',
      yardLine: Number(situation?.yardLine)
    } : undefined,
    down: situation?.down,
    yardsToGo: situation?.distance,
    lastPlay: lastPlayText,
    winProbability: summaryJson?.winprobability?.[0] || null,
    plays: timeline,
    scoringPlays: getScoringPlays(),
    drives: {
      current: currentDrive ? {
        team: currentDrive?.team?.abbreviation,
        plays: currentDrive?.plays?.length || 0,
        yards: currentDrive?.yards,
        result: currentDrive?.result
      } : null,
      all: drives?.previous?.map(drive => ({
        team: drive?.team?.abbreviation,
        plays: drive?.plays?.length || 0,
        yards: drive?.yards,
        result: drive?.result,
        startTime: drive?.startTime,
        endTime: drive?.endTime
      })) || []
    },
    leaders: summaryJson?.leaders || null,
    weather: competition?.weather || null,
    venue: {
      name: competition?.venue?.fullName,
      city: competition?.venue?.address?.city,
      state: competition?.venue?.address?.state,
      capacity: competition?.venue?.capacity
    }
  };
};

const fetchTonightSuperBowlData = async () => {
  const now = new Date();
  const gameStarted = now >= SUPER_BOWL_KICKOFF;

  if (!gameStarted) {
    return {
      gameStarted: false,
      status: 'PREGAME',
      countdown: countdownToKickoff()
    };
  }

  // Use the specific Super Bowl game ID
  const eventId = '401772988';

  const [summaryRes, pbpRes] = await Promise.all([
    axios.get(ESPN_SUMMARY, {
      params: { event: eventId },
      headers: ESPN_HEADERS,
      timeout: 10000
    }),
    axios.get(ESPN_PBP, {
      params: { xhr: 1, gameId: eventId },
      headers: ESPN_HEADERS,
      timeout: 10000
    })
  ]);

  return mapSummaryToDashboard(eventId, summaryRes.data, pbpRes.data);
};

// GET /api/game - Get current game data
router.get('/game', async (req, res) => {
  try {
    const gameData = await fetchTonightSuperBowlData();
    res.json(gameData);
  } catch (error) {
    console.error('Error fetching game data:', error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: 'Failed to fetch game data' });
  }
});

// GET /api/game/test - Test endpoint to verify game data structure
router.get('/game/test', async (req, res) => {
  try {
    const eventId = '401772988';
    
    const [summaryRes, pbpRes] = await Promise.all([
      axios.get(ESPN_SUMMARY, {
        params: { event: eventId },
        headers: ESPN_HEADERS,
        timeout: 10000
      }),
      axios.get(ESPN_PBP, {
        params: { xhr: 1, gameId: eventId },
        headers: ESPN_HEADERS,
        timeout: 10000
      })
    ]);

    const gameData = mapSummaryToDashboard(eventId, summaryRes.data, pbpRes.data);
    
    // Return a summary of what data is available
    res.json({
      success: true,
      eventId,
      dataStructure: {
        hasTeams: !!(gameData.teams.patriots && gameData.teams.seahawks),
        hasPatriotsStats: !!gameData.teams.patriots.stats,
        hasSeahawksStats: !!gameData.teams.seahawks.stats,
        patriotsPlayerCount: gameData.teams.patriots.players?.length || 0,
        seahawksPlayerCount: gameData.teams.seahawks.players?.length || 0,
        hasScoringPlays: !!(gameData.scoringPlays && gameData.scoringPlays.length > 0),
        scoringPlayCount: gameData.scoringPlays?.length || 0,
        hasPlays: !!(gameData.plays && gameData.plays.length > 0),
        playCount: gameData.plays?.length || 0,
        hasDrives: !!(gameData.drives),
        hasVenue: !!gameData.venue,
        hasWeather: !!gameData.weather,
        hasLeaders: !!gameData.leaders
      },
      sampleData: {
        patriots: {
          name: gameData.teams.patriots.name,
          score: gameData.teams.patriots.score,
          statsKeys: Object.keys(gameData.teams.patriots.stats || {}),
          samplePlayer: gameData.teams.patriots.players[0] || null
        },
        seahawks: {
          name: gameData.teams.seahawks.name,
          score: gameData.teams.seahawks.score,
          statsKeys: Object.keys(gameData.teams.seahawks.stats || {}),
          samplePlayer: gameData.teams.seahawks.players[0] || null
        }
      }
    });
  } catch (error) {
    console.error('Error in test endpoint:', error);
    res.status(500).json({ 
      error: 'Failed to fetch test game data', 
      details: error.message,
      eventId: '401772988'
    });
  }
});

module.exports = router;
