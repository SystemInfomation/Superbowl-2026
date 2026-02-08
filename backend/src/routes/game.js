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
        possession: possessionAbbr === SUPER_BOWL_TEAMS.homeAbbr
      },
      seahawks: {
        name: sea?.team?.displayName,
        abbreviation: sea?.team?.abbreviation,
        score: Number(sea?.score ?? 0),
        timeouts: sea?.timeouts,
        possession: possessionAbbr === SUPER_BOWL_TEAMS.awayAbbr
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
    plays: timeline
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

  const eventId = await findSuperBowlEventId();
  if (!eventId) {
    const err = new Error('Super Bowl eventId not found on ESPN for tonight');
    err.statusCode = 503;
    throw err;
  }

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

module.exports = router;
