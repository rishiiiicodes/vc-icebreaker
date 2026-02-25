# VC Icebreaker

A real-time multiplayer icebreaker game for video calls. Built with Express, Socket.io, and vanilla JS/CSS for a native-like PWA experience.

## Features
- Real-time room synchronization
- 14 distinct question categories (Chill, Deep, Spicy, Work, etc.)
- In-game timer configuration
- Emoji reactions with live floating particles
- Interactive WebGL parallax background
- Mobile-first, installable Progressive Web App (PWA)

## Running Locally

1. Clone and install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

3. Start the server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## Configuration
The server is configured via `.env` variables:

- `PORT`: The port the server binds to (default 3000).
- `ALLOWED_ORIGINS`: A comma-separated list of allowed origins, or `*` for testing. **Change this to your actual domain in production!** (e.g. `https://myicebreaker.com,https://www.myicebreaker.com`)
- `MAX_PLAYERS_PER_ROOM`: Maximum number of connections allowed in a single room (default 50).
- `LOG_LEVEL`: Pino logger level (e.g. `trace`, `debug`, `info`, `warn`, `error`). Defaults to `info`.

## Architecture Note: In-Memory State
Currently, room state is stored entirely in memory (`rooms = {}` in `roomManager.js`). 
This means:
1. **Instant, Zero-Latency Lookups**: Extremely fast.
2. **Ephemeral**: If the Node server restarts or crashes, all active games are lost.
3. **Single Instance**: You cannot horizontally scale this across multiple servers (e.g., using a load balancer) without enabling sticky sessions or migrating the state to Redis.

For most icebreaker usage, this is a perfectly acceptable tradeoff for simplicity and speed.
