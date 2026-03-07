# VC Icebreaker

A real-time multiplayer icebreaker game for video calls. Built with Express, Socket.io, and vanilla JS/CSS for a native-like PWA experience.

## ✨ Features

- 🎮 Real-time room synchronization
- 🎯 20+ distinct question categories (Chill, Deep, Spicy, Work, etc.)
- ⏱️ Configurable in-game timer
- 😊 Emoji reactions with live floating particles
- 🌈 Interactive WebGL parallax background
- 📱 Mobile-first, installable Progressive Web App (PWA)
- 🔒 Room locking and host controls
- 👥 Multi-language support (English, Hindi, Hinglish)
- 🏆 Real-time leaderboards and voting

## 🚀 Quick Start

### Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd vc-icebreaker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment configuration:
   ```bash
   cp .env.example .env
   ```

4. Configure your environment variables in `.env`:
   ```env
   PORT=3000
   NODE_ENV=development
   ALLOWED_ORIGINS=*
   MAX_PLAYERS_PER_ROOM=50
   LOG_LEVEL=info
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## 📦 Available Scripts

- `npm start` - Start the server in production mode
- `npm run dev` - Start the server in development mode with detailed logging
- `npm run prod` - Start the server in production mode
- `npm test` - Run tests
- `npm run lint` - Check code quality
- `npm run lint:fix` - Fix code quality issues automatically

## ⚙️ Configuration

The server is configured via environment variables in `.env`:

### Core Settings

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment: development, production, test
- `ALLOWED_ORIGINS` - Comma-separated list of allowed CORS origins, or `*` for testing
  - **⚠️ Important**: Change this to your actual domain in production!
  - Example: `https://myicebreaker.com,https://www.myicebreaker.com`

### Room Configuration

- `MAX_PLAYERS_PER_ROOM` - Maximum players per room (default: 50, max: 200)
- `ROOM_CLEANUP_INTERVAL_MS` - How often to check for inactive rooms (default: 300000 = 5 minutes)
- `ROOM_INACTIVITY_TTL_MS` - Time before inactive rooms are deleted (default: 1800000 = 30 minutes)

### Security & Performance

- `RATE_LIMIT_WINDOW_MS` - Rate limit time window (default: 60000 = 1 minute)
- `RATE_LIMIT_MAX_REQUESTS` - Max requests per window (default: 100)
- `LOG_LEVEL` - Logging level: trace, debug, info, warn, error (default: info)

### Feature Flags

- `ENABLE_ANALYTICS` - Enable analytics tracking (default: false)
- `ENABLE_ADVANCED_METRICS` - Enable `/metrics` endpoint (default: false)

### Future: Redis (Horizontal Scaling)

- `REDIS_URL` - Redis connection URL (e.g., redis://localhost:6379)
- `ENABLE_REDIS` - Use Redis for room storage instead of memory (default: false)

## 🏗️ Architecture

### In-Memory State

Currently, room state is stored entirely in memory (`rooms = {}` in `roomManager.js`).

**Advantages:**
- ⚡ Instant, zero-latency lookups
- 🎯 Simple implementation
- 💰 No external dependencies

**Limitations:**
- 🔄 Ephemeral - server restart loses all games
- 📊 Single instance - can't horizontally scale without sticky sessions
- 💾 Memory-bound - limited by server RAM

For most icebreaker usage, this is a perfectly acceptable tradeoff for simplicity and speed.

### Project Structure

```
vc-icebreaker/
├── config/              # Configuration management
│   └── index.js         # Centralized config with validation
├── middleware/          # Express middleware
│   └── errorHandler.js  # Error handling
├── rooms/               # Game logic
│   ├── roomManager.js   # Room state management
│   ├── playerManager.js # Player operations
│   └── questionEngine.js # Question selection logic
├── utils/               # Utility functions
│   ├── logger.js        # Logging configuration
│   └── validation.js    # Input validation
├── public/              # Static frontend assets
│   ├── index.html       # Main app shell
│   ├── script.js        # Client-side logic
│   ├── style.css        # Styling
│   └── sw.js            # Service worker (PWA)
├── server.js            # Express server entry point
├── socketHandler.js     # Socket.io event handlers
└── test.js              # Test suite
```

## 🔒 Security

### Production Checklist

- [ ] Set `ALLOWED_ORIGINS` to your actual domain(s)
- [ ] Set `NODE_ENV=production`
- [ ] Use HTTPS (required for PWA)
- [ ] Configure appropriate rate limits
- [ ] Review and adjust `MAX_PLAYERS_PER_ROOM`
- [ ] Enable security headers (Helmet is configured)
- [ ] Set up monitoring and logging
- [ ] Configure firewall rules
- [ ] Use environment variables for secrets (never commit `.env`)

### Security Features

- ✅ Input validation on all user inputs
- ✅ Rate limiting (configurable per endpoint)
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Request size limits (10kb)
- ✅ XSS protection
- ✅ IP-based rate limiting for sensitive operations

## 📊 Monitoring

### Health Check

```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2026-03-05T10:30:00.000Z",
  "uptime": 3600.5
}
```

### Metrics (Optional)

Enable with `ENABLE_ADVANCED_METRICS=true`:

```bash
curl http://localhost:3000/metrics
```

Response:
```json
{
  "uptime": 3600.5,
  "memory": {
    "rss": "150MB",
    "heapUsed": "80MB",
    "heapTotal": "120MB"
  },
  "nodeVersion": "v18.17.0"
}
```

## 🚀 Deployment

### Render.com (Recommended)

1. Connect your GitHub repository
2. Set environment variables in Render dashboard
3. Deploy!

Live demo: [https://vc-icebreaker.onrender.com/](https://vc-icebreaker.onrender.com/)

### Docker (Coming Soon)

```bash
docker build -t vc-icebreaker .
docker run -p 3000:3000 --env-file .env vc-icebreaker
```

### Manual Deployment

```bash
# On your server
git clone <repository-url>
cd vc-icebreaker
npm install
cp .env.example .env
# Edit .env with production values
npm run prod
```

### Using PM2 (Process Manager)

```bash
npm install -g pm2
pm2 start server.js --name vc-icebreaker
pm2 save
pm2 startup
```

## 🧪 Testing

```bash
npm test
```

Tests cover:
- Room creation and joining
- Player management
- Question engine
- Socket.io events
- Input validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run linting: `npm run lint:fix`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Style

- Use ESLint configuration provided
- Follow existing patterns
- Add comments for complex logic
- Update documentation

## 📝 License

ISC

## 🙏 Acknowledgments

- Built with [Socket.io](https://socket.io/)
- Styled with custom CSS and WebGL
- Logging with [Pino](https://getpino.io/)
- Security with [Helmet](https://helmetjs.github.io/)

## 📚 Documentation

- [Improvements Summary](./IMPROVEMENTS.md) - Detailed list of all improvements
- [API Documentation](./docs/API.md) - Socket.io events and REST endpoints (coming soon)
- [Deployment Guide](./docs/DEPLOYMENT.md) - Detailed deployment instructions (coming soon)

## 🐛 Known Issues

- Room state is lost on server restart (by design - see Architecture)
- No persistent storage (can be added with Redis)
- Single server instance (can scale with Redis + sticky sessions)

## 🗺️ Roadmap

- [ ] Redis integration for horizontal scaling
- [ ] Persistent room history
- [ ] Analytics dashboard
- [ ] Custom question sets
- [ ] Team/organization accounts
- [ ] API for integrations
- [ ] Mobile apps (iOS/Android)
- [ ] Video integration
- [ ] Screen sharing support

## 💬 Support

- Open an issue on GitHub
- Check existing issues for solutions
- Review documentation

---

Made with ❤️ for remote teams worldwide 🌍
