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
  const boxscore = summaryJson?.boxscore;

  const ne = pickTeam(competitors, SUPER_BOWL_TEAMS.homeAbbr);
  const sea = pickTeam(competitors, SUPER_BOWL_TEAMS.awayAbbr);

  const situation = summaryJson?.situation;
  const possessionAbbr = situation?.possession || situation?.possessionText;

  // Extract leaders and injuries for player data (available pre-game)
  const leadersData = summaryJson?.leaders || [];
  const injuriesData = summaryJson?.injuries || [];

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

  // Extract team statistics from both competitor and boxscore
  const getTeamStats = (team, boxscore, teamAbbr) => {
    const statMap = {};
    
    // First, get stats from competitor (live game stats)
    const competitorStats = team?.statistics || [];
    competitorStats.forEach(stat => {
      statMap[stat.name] = stat.displayValue || stat.value;
    });
    
    // Then, get stats from boxscore (more comprehensive stats)
    if (boxscore?.teams) {
      const boxscoreTeam = boxscore.teams.find(t => t?.team?.abbreviation === teamAbbr);
      if (boxscoreTeam?.statistics) {
        boxscoreTeam.statistics.forEach(stat => {
          // Don't override live stats with season averages
          if (!statMap[stat.name]) {
            statMap[stat.name] = stat.displayValue || stat.value;
          }
        });
      }
    }
    
    return statMap;
  };

  // Extract comprehensive player data from multiple sources
  // 1. Boxscore (during live game - has live stats)
  // 2. Leaders (available pre-game and during game - season leaders)
  // 3. Injuries (available pre-game - injured players)
  const getPlayerStats = (boxscore, teamAbbr, leadersData, injuriesData) => {
    const playersMap = new Map();
    
    // SOURCE 1: Get players from leaders (available even before game starts)
    if (leadersData) {
      const teamLeaders = leadersData.find(t => t.team?.abbreviation === teamAbbr);
      if (teamLeaders?.leaders) {
        teamLeaders.leaders.forEach(category => {
          const categoryName = category.name;
          (category.leaders || []).forEach(leader => {
            const athlete = leader.athlete || {};
            const playerId = athlete.id;
            
            if (playerId) {
              if (!playersMap.has(playerId)) {
                playersMap.set(playerId, {
                  id: playerId,
                  name: athlete.displayName,
                  shortName: athlete.shortName,
                  position: athlete.position?.abbreviation,
                  jersey: athlete.jersey,
                  headshot: athlete.headshot?.href,
                  statCategories: {}
                });
              }
              // Add leader stats
              playersMap.get(playerId).statCategories[categoryName] = {
                displayValue: leader.displayValue,
                value: leader.value
              };
            }
          });
        });
      }
    }
    
    // SOURCE 2: Get players from injuries (available before game starts)
    if (injuriesData) {
      const teamInjuries = injuriesData.find(t => t.team?.abbreviation === teamAbbr);
      if (teamInjuries?.injuries) {
        teamInjuries.injuries.forEach(injury => {
          const athlete = injury.athlete || {};
          const playerId = athlete.id;
          
          if (playerId && !playersMap.has(playerId)) {
            playersMap.set(playerId, {
              id: playerId,
              name: athlete.displayName,
              shortName: athlete.shortName,
              position: athlete.position?.abbreviation,
              jersey: athlete.jersey,
              headshot: athlete.headshot?.href,
              statCategories: {},
              injury: {
                status: injury.status,
                details: injury.details?.type
              }
            });
          }
        });
      }
    }
    
    // SOURCE 3: Get players from boxscore (available during live game - priority data)
    if (boxscore?.players) {
      const teamPlayers = boxscore.players.find(
        t => t.team?.abbreviation === teamAbbr
      );
      
      if (teamPlayers?.statistics) {
        // Process each stat category (passing, rushing, receiving, defense, etc.)
        teamPlayers.statistics.forEach(statCategory => {
          const categoryName = statCategory.name;
          const categoryLabels = statCategory.labels || [];
          
          (statCategory.athletes || []).forEach(athlete => {
            const playerId = athlete.athlete?.id;
            const athleteInfo = athlete.athlete || {};
            
            const playerStats = {};
            (athlete.stats || []).forEach((statValue, index) => {
              const label = categoryLabels[index] || `stat${index}`;
              playerStats[label] = statValue;
            });
            
            if (playersMap.has(playerId)) {
              // Update existing player with live stats (priority)
              playersMap.get(playerId).statCategories[categoryName] = playerStats;
              // Update headshot and other info if available
              if (athleteInfo.headshot?.href) {
                playersMap.get(playerId).headshot = athleteInfo.headshot.href;
              }
            } else {
              // Create new player entry from boxscore data
              playersMap.set(playerId, {
                id: playerId,
                name: athleteInfo.displayName,
                shortName: athleteInfo.shortName,
                position: athleteInfo.position?.abbreviation,
                jersey: athleteInfo.jersey,
                headshot: athleteInfo.headshot?.href,
                statCategories: {
                  [categoryName]: playerStats
                }
              });
            }
          });
        });
      }
    }
    
    return Array.from(playersMap.values());
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
        stats: getTeamStats(ne, boxscore, SUPER_BOWL_TEAMS.homeAbbr),
        players: getPlayerStats(boxscore, SUPER_BOWL_TEAMS.homeAbbr, leadersData, injuriesData)
      },
      seahawks: {
        name: sea?.team?.displayName,
        abbreviation: sea?.team?.abbreviation,
        score: Number(sea?.score ?? 0),
        timeouts: sea?.timeouts,
        possession: possessionAbbr === SUPER_BOWL_TEAMS.awayAbbr,
        record: sea?.team?.record,
        logo: sea?.team?.logo,
        stats: getTeamStats(sea, boxscore, SUPER_BOWL_TEAMS.awayAbbr),
        players: getPlayerStats(boxscore, SUPER_BOWL_TEAMS.awayAbbr, leadersData, injuriesData)
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

  // Use the specific Super Bowl game ID - event 401772988
  const eventId = '401772988';

  // Only fetch from summary and play-by-play endpoints
  // NO separate roster calls - all player data comes from boxscore
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

  return mapSummaryToDashboard(
    eventId, 
    summaryRes.data, 
    pbpRes.data
  );
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
    
    // Only fetch from summary and play-by-play - NO roster calls
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
