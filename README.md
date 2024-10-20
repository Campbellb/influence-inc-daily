# Influence Inc. - Corporate Ladder Climbing Simulator

[![Try](https://img.shields.io/badge/try_it-here-blue)](https://influence-inc-daily.vercel.app/)

Influence Inc. is an immersive corporate simulation game powered by [Daily Bots](https://bots.daily.co). Navigate office politics, impress your superiors, and climb the corporate ladder in this unique AI-driven experience.

## Game Overview

In Influence Inc., you start as an intern and work your way up through the corporate ranks. Engage in conversations with AI-powered characters, each with their own quirks and secrets. Your goal is to impress them and earn promotions by uncovering their hidden weaknesses and demonstrating your skills.

## Key Features

- AI-powered characters with unique personalities and challenges
- Dynamic conversations that adapt to your choices
- Multiple levels of corporate hierarchy to climb
- Voice-based interaction for an immersive experience

## How to Play

1. Start as an intern and engage in conversations with your AI colleagues.
2. Uncover each character's secret weakness and use it to your advantage.
3. Impress your superiors to earn promotions and climb the corporate ladder.
4. Reach the top of the company by outsmarting the Executive and potentially even higher positions.

## Run it locally

### Prerequisites

1. Grab a Daily Bots API key by signing up at [https://bots.daily.co](https://bots.daily.co)
2. Configure your local environment
```
cp env.example .env.local
```

### Install dependencies
```
yarn
```

### Run the project
```
yarn run dev
```


## How does this work?

Daily Bots is built on two open-source technologies:

- [Pipecat](https://www.pipecat.ai) - Python library for building real-time agent
- [RTVI](https://github.com/rtvi-ai) - Open-standard for Real-Time Voice [and Video] Inference

This project makes use of [`realtime-ai`](https://www.npmjs.com/package/realtime-ai), [`realtime-ai-react`](https://www.npmjs.com/package/realtime-ai-react) and [`realtime-ai-daily`](https://www.npmjs.com/package/realtime-ai-daily) to interact with the Daily Bot.

Learn more about the RTVI web client libraries [on the docs](https://docs.rtvi.ai).

### Configuration

All Voice Client configuration can be found in the [rtvi.config.ts](/rtvi.config.ts) file. You can edit any prompts, services of config settings in this file.

### API routes

This project exposes three server-side routes:

- [api/route.ts](app/api/route.ts)
- optional: [api/dialin/route.ts](app/api/dialin/route.ts)
- optional: [api/dialout/route.ts](app/api/dialout/route.ts)

The routes project a secure way to pass any required secrets or configuration directly to the Daily Bots API. Your `NEXT_PUBLIC_BASE_URL` must point to your `/api` route and passed to the `VoiceClient`. 