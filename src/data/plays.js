// Each play has steps: array of animation keyframes
// Positions on a 500x480 diamond SVG
// Ball path: array of {x,y,t} waypoints
// Runners: array of {from, to, startT, endT, color, label}

export const PLAYS = [
  {
    id: 'grounder-ss-1b',
    title: 'Ground Ball to Shortstop',
    emoji: '🏃',
    difficulty: 'Easy',
    description: "The batter hits a ground ball to the shortstop (SS). The shortstop fields it and throws to first base to get the runner out!",
    steps: [
      { label: "Batter hits the ball!", note: "CRACK! The ball rolls toward the shortstop." },
      { label: "Shortstop fields it", note: "The shortstop charges in and scoops up the grounder." },
      { label: "Throw to first!", note: "Quick throw to first base... OUT! The runner is out by a step!" },
    ],
    animation: {
      ball: [
        { x: 250, y: 390, t: 0 },
        { x: 185, y: 220, t: 0.8 },
        { x: 185, y: 210, t: 1.2 },
        { x: 360, y: 285, t: 2.2 },
      ],
      runners: [
        { from: { x: 250, y: 390 }, to: { x: 360, y: 285 }, startT: 0.8, endT: 2.5, color: '#f59e0b', label: 'Batter' }
      ]
    }
  },
  {
    id: 'double-play-643',
    title: '6-4-3 Double Play',
    emoji: '💥',
    difficulty: 'Medium',
    description: "Two outs in one play! The shortstop (6) fields it, throws to second base (4), who throws to first base (3). Two runners out!",
    steps: [
      { label: "Ground ball to shortstop!", note: "Runner on first — shortstop grabs it fast!" },
      { label: "To second for out #1!", note: "Second baseman catches it, steps on the bag — RUNNER OUT!" },
      { label: "Relay to first — out #2!", note: "Quick throw to first... DOUBLE PLAY! The crowd goes wild!" },
    ],
    animation: {
      ball: [
        { x: 250, y: 390, t: 0 },
        { x: 185, y: 210, t: 0.7 },
        { x: 250, y: 175, t: 1.4 },
        { x: 360, y: 285, t: 2.3 },
      ],
      runners: [
        { from: { x: 360, y: 285 }, to: { x: 250, y: 175 }, startT: 0.7, endT: 1.6, color: '#f59e0b', label: 'Runner 1B' },
        { from: { x: 250, y: 390 }, to: { x: 360, y: 285 }, startT: 0.7, endT: 2.5, color: '#60a5fa', label: 'Batter' }
      ]
    }
  },
  {
    id: 'steal-second',
    title: 'Steal of Second Base',
    emoji: '💨',
    difficulty: 'Easy',
    description: "A runner on first base takes off running to second base before the pitcher throws! The catcher has to catch the pitch and make a quick throw to second.",
    steps: [
      { label: "Runner takes off!", note: "The runner on first sprints toward second base!" },
      { label: "Pitcher throws home", note: "The ball goes to the catcher..." },
      { label: "Catcher fires to second!", note: "Quick throw to second... SAFE! The runner steals second!" },
    ],
    animation: {
      ball: [
        { x: 250, y: 240, t: 0 },
        { x: 250, y: 395, t: 0.8 },
        { x: 250, y: 175, t: 1.8 },
      ],
      runners: [
        { from: { x: 360, y: 285 }, to: { x: 250, y: 175 }, startT: 0, endT: 1.7, color: '#f59e0b', label: 'Runner' }
      ]
    }
  },
  {
    id: 'tag-play-home',
    title: 'Tag Play at Home',
    emoji: '🏠',
    difficulty: 'Medium',
    description: "A runner is trying to score! The outfielder throws home and the catcher has to catch it and tag the runner before they touch home plate.",
    steps: [
      { label: "Ball hit to outfield!", note: "Long fly ball — the runner on third tags up and runs home!" },
      { label: "Outfielder throws home", note: "Strong throw from center field coming in..." },
      { label: "Tag! You're out!", note: "The catcher catches it and makes the tag — OUT at home!" },
    ],
    animation: {
      ball: [
        { x: 250, y: 390, t: 0 },
        { x: 250, y: 70, t: 0.5 },
        { x: 250, y: 70, t: 1.0 },
        { x: 250, y: 395, t: 2.5 },
      ],
      runners: [
        { from: { x: 140, y: 285 }, to: { x: 250, y: 395 }, startT: 1.0, endT: 2.6, color: '#f59e0b', label: 'Runner 3B' }
      ]
    }
  },
  {
    id: 'infield-fly',
    title: 'Infield Fly Rule',
    emoji: '☁️',
    difficulty: 'Hard',
    description: "When runners are on first and second with less than 2 outs, and the batter pops it up in the infield — the umpire calls INFIELD FLY and the batter is automatically out! This protects the runners.",
    steps: [
      { label: "Runners on 1st and 2nd!", note: "Less than 2 outs — this is the perfect setup..." },
      { label: "Batter pops it up!", note: "High pop fly to the shortstop..." },
      { label: "INFIELD FLY!", note: "Umpire calls it! Batter is automatically out. Runners can stay or go!" },
    ],
    animation: {
      ball: [
        { x: 250, y: 390, t: 0 },
        { x: 200, y: 150, t: 0.6 },
        { x: 185, y: 210, t: 1.8 },
      ],
      runners: [
        { from: { x: 360, y: 285 }, to: { x: 362, y: 280 }, startT: 1.0, endT: 1.5, color: '#f59e0b', label: 'Runner 1B' },
        { from: { x: 250, y: 175 }, to: { x: 252, y: 173 }, startT: 1.0, endT: 1.5, color: '#a78bfa', label: 'Runner 2B' }
      ]
    }
  },
  {
    id: 'squeeze-bunt',
    title: 'Squeeze Bunt',
    emoji: '🤫',
    difficulty: 'Medium',
    description: "Secret play! Runner on third — as the pitcher throws, the runner takes off for home and the batter bunts the ball. If done right, the runner scores!",
    steps: [
      { label: "Runner breaks for home!", note: "The runner on third starts sprinting home as the pitcher winds up!" },
      { label: "Batter bunts it!", note: "Tiny tap — the ball rolls slowly in front of home plate!" },
      { label: "Runner scores!", note: "The play is too close to make a throw — RUN SCORES! Brilliant!" },
    ],
    animation: {
      ball: [
        { x: 250, y: 240, t: 0 },
        { x: 250, y: 395, t: 0.7 },
        { x: 260, y: 370, t: 1.1 },
        { x: 255, y: 365, t: 1.5 },
      ],
      runners: [
        { from: { x: 140, y: 285 }, to: { x: 250, y: 395 }, startT: 0, endT: 1.4, color: '#f59e0b', label: 'Runner 3B' }
      ]
    }
  },
  {
    id: 'hit-and-run',
    title: 'Hit and Run',
    emoji: '🏃‍♂️',
    difficulty: 'Medium',
    description: "The runner on first takes off as the pitcher throws — and the batter MUST swing! Even if it's a bad pitch! This opens up holes in the infield for a hit.",
    steps: [
      { label: "Runner goes on the pitch!", note: "The runner on first takes off — they're running no matter what!" },
      { label: "Batter swings!", note: "The batter swings and makes contact — line drive into the gap!" },
      { label: "Runner scores from first!", note: "Runner was already moving — they score all the way from first!" },
    ],
    animation: {
      ball: [
        { x: 250, y: 390, t: 0 },
        { x: 130, y: 115, t: 1.0 },
      ],
      runners: [
        { from: { x: 360, y: 285 }, to: { x: 250, y: 175 }, startT: 0, endT: 0.9, color: '#f59e0b', label: 'Runner 1B' },
        { from: { x: 250, y: 175 }, to: { x: 140, y: 285 }, startT: 0.9, endT: 1.8, color: '#f59e0b', label: 'Runner 1B' },
        { from: { x: 250, y: 390 }, to: { x: 360, y: 285 }, startT: 0.8, endT: 1.9, color: '#60a5fa', label: 'Batter' }
      ]
    }
  },
  {
    id: 'rundown',
    title: 'Rundown (Pickle!)',
    emoji: '🥒',
    difficulty: 'Hard',
    description: "A runner is caught between two bases! Fielders throw the ball back and forth while chasing the runner. The goal is to tag them out before they reach a base safely. Kids call it a PICKLE!",
    steps: [
      { label: "Runner caught in a pickle!", note: "The runner is trapped between first and second base!" },
      { label: "Fielders chase and throw!", note: "The ball goes back and forth — run, throw, run, throw..." },
      { label: "TAG! You're out!", note: "The fielder finally makes the tag — out in the rundown!" },
    ],
    animation: {
      ball: [
        { x: 360, y: 285, t: 0 },
        { x: 250, y: 175, t: 0.5 },
        { x: 360, y: 285, t: 1.0 },
        { x: 250, y: 175, t: 1.5 },
        { x: 310, y: 232, t: 2.0 },
      ],
      runners: [
        { from: { x: 360, y: 285 }, to: { x: 290, y: 228 }, startT: 0, endT: 0.6, color: '#f59e0b', label: 'Runner' },
        { from: { x: 290, y: 228 }, to: { x: 340, y: 265 }, startT: 0.6, endT: 1.2, color: '#f59e0b', label: 'Runner' },
        { from: { x: 340, y: 265 }, to: { x: 310, y: 232 }, startT: 1.2, endT: 2.0, color: '#f59e0b', label: 'Runner' },
      ]
    }
  },
]
