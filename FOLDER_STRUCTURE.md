# VC Icebreaker - Complete Folder Structure

## 📁 Project Overview
Real-time multiplayer icebreaker game for video calls built with Express, Socket.io, and vanilla JavaScript.

---

## 🗂️ Root Directory Structure

```
vc-icebreaker/
├── 📁 .git/                    # Git version control
├── 📁 .npm-cache/              # NPM cache directory
├── 📁 config/                  # Configuration files
├── 📁 docs/                    # Documentation
├── 📁 middleware/              # Express middleware
├── 📁 node_modules/            # Dependencies (auto-generated)
├── 📁 public/                  # Static frontend assets
├── 📁 rooms/                   # Game room logic
├── 📁 utils/                   # Utility functions
├── 📄 .env.example             # Environment variables template
├── 📄 .eslintrc.js             # ESLint configuration (legacy)
├── 📄 .eslintrc.json           # ESLint configuration
├── 📄 .gitignore               # Git ignore rules
├── 📄 FOLDER_STRUCTURE.md      # This file
├── 📄 IMPROVEMENTS.md          # Feature improvements list
├── 📄 package.json             # Project dependencies & scripts
├── 📄 package-lock.json        # Locked dependency versions
├── 📄 README.md                # Project documentation
├── 📄 server.js                # Main server entry point
├── 📄 socketHandler.js         # WebSocket event handlers
└── 📄 test.js                  # Test suite
```

---

## 📂 Detailed Directory Breakdown

### `/config` - Configuration Management
```
config/
└── index.js                    # Centralized configuration loader
```
**Purpose:** Manages environment variables and application configuration.

---

### `/docs` - Documentation
```
docs/
├── API.md                      # API endpoints documentation
├── ARCHITECTURE.md             # System architecture overview
└── DEPLOYMENT.md               # Deployment instructions
```
**Purpose:** Comprehensive project documentation for developers and deployment.

---

### `/middleware` - Express Middleware
```
middleware/
└── errorHandler.js             # Global error handling middleware
```
**Purpose:** Custom Express middleware for error handling and request processing.

---

### `/public` - Frontend Assets (Static Files)
```
public/
├── 📄 click.mp3                # Click sound effect
├── 📄 complete.mp3             # Completion sound effect
├── 📄 generate-icons.js        # PWA icon generator script
├── 🖼️ icon-192.png             # PWA icon (192x192)
├── 🖼️ icon-512.png             # PWA icon (512x512)
├── 📄 index.html               # Main HTML file
├── 📄 manifest.json            # PWA manifest
├── 📄 reset.mp3                # Reset sound effect
├── 📄 robots.txt               # SEO robots file
├── 📄 script.js                # Client-side JavaScript
├── 📄 sitemap.xml              # SEO sitemap
├── 📄 style.css                # Main stylesheet (premium design)
└── 📄 sw.js                    # Service worker for PWA
```

**Key Features:**
- **index.html**: Landing page with hero section, category showcase, and modals
- **script.js**: Socket.io client, game logic, parallax effects, micro-interactions
- **style.css**: Premium design with:
  - Gradient animations
  - Glass morphism effects
  - Micro-interactions
  - Responsive breakpoints
  - Custom scrollbar
  - 60fps animations
- **PWA Support**: Manifest, service worker, and icons for installable app

---

### `/rooms` - Game Room Logic
```
rooms/
├── playerManager.js            # Player state management
├── questionEngine.js           # Question selection & categories
└── roomManager.js              # Room creation & lifecycle
```

**Purpose:**
- **roomManager.js**: In-memory room state, join/leave logic
- **playerManager.js**: Player tracking, voting, scoring
- **questionEngine.js**: 20+ question categories, language support (EN/HI/Hinglish)

---

### `/utils` - Utility Functions
```
utils/
├── logger.js                   # Pino logger configuration
├── roomCodeGenerator.js        # Unique room code generation
├── sanitize.js                 # Input sanitization
└── validation.js               # Input validation helpers
```

**Purpose:** Reusable utility functions for logging, validation, and security.

---

## 🔧 Core Files

### Server Files

#### `server.js` - Main Entry Point
- Express server setup
- Socket.io initialization
- Middleware configuration (Helmet, CORS, rate limiting)
- Health check endpoint
- Graceful shutdown handling

#### `socketHandler.js` - WebSocket Logic
- Socket.io event handlers
- Room join/leave events
- Question serving
- Real-time synchronization
- Language switching
- Voting system

#### `test.js` - Test Suite
- Unit tests for core functionality
- Socket.io client tests
- Room management tests

---

## 📦 Dependencies (package.json)

### Production Dependencies
```json
{
  "compression": "^1.8.1",        // Response compression
  "cors": "^2.8.6",               // CORS middleware
  "dotenv": "^17.3.1",            // Environment variables
  "express": "^4.22.1",           // Web framework
  "express-rate-limit": "^8.2.1", // Rate limiting
  "helmet": "^8.1.0",             // Security headers
  "pino": "^10.3.1",              // Fast logger
  "pino-pretty": "^13.1.3",       // Pretty logs
  "socket.io": "^4.8.3"           // Real-time communication
}
```

### Development Dependencies
```json
{
  "canvas": "^3.2.1",             // Canvas for testing
  "eslint": "^8.57.0",            // Code linting
  "socket.io-client": "^4.8.3"    // Socket.io client for tests
}
```

---

## 🎨 Frontend Architecture

### HTML Structure
```
Landing Page
├── Hero Section
│   ├── Animated emoji
│   ├── Gradient title with shimmer
│   ├── CTA buttons
│   └── Floating category pills
├── How It Works (3 steps)
├── Category Showcase (scrolling pills)
└── Footer

Game Screens
├── Category Selection
│   ├── Host view (category grid)
│   └── Player waiting view
└── Game Screen
    ├── Top bar (language, players, leave)
    ├── Host controls panel
    ├── Question display
    ├── Reaction bar
    ├── Voting panel
    └── Progress indicator
```

### CSS Architecture
```
style.css (4000+ lines)
├── CSS Variables (colors, spacing, transitions)
├── Base styles & resets
├── Background effects (orbs, gradients, noise)
├── Typography
├── Buttons & interactions
├── Category pills
├── Cards & modals
├── Game UI components
├── Animations & keyframes
├── Responsive breakpoints
└── Premium effects (glass, glow, parallax)
```

### JavaScript Architecture
```
script.js
├── DOM element references
├── Socket.io client setup
├── State management
├── UI update functions
├── Event handlers
├── Sound effects
├── Parallax effects
├── Micro-interactions
├── PWA install prompt
└── Utility functions
```

---

## 🌐 API Endpoints

### HTTP Endpoints
- `GET /` - Serve static files
- `GET /health` - Health check

### Socket.io Events

#### Client → Server
- `createRoom` - Create new room
- `joinRoom` - Join existing room
- `startGame` - Start game (host only)
- `nextQuestion` - Get next question
- `skipQuestion` - Skip current question
- `changeCategory` - Change question category
- `changeLanguage` - Switch language
- `sendReaction` - Send emoji reaction
- `vote` - Vote for best answer
- `lockRoom` - Lock room (host only)
- `transferHost` - Transfer host role
- `disconnect` - Handle disconnection

#### Server → Client
- `roomCreated` - Room creation confirmation
- `roomJoined` - Join confirmation
- `roomState` - Full room state update
- `questionServed` - New question
- `categoryChanged` - Category update
- `languageChanged` - Language update
- `reactionReceived` - Emoji reaction
- `voteUpdate` - Voting results
- `error` - Error messages

---

## 🔐 Environment Variables (.env)

```bash
PORT=3000                       # Server port
ALLOWED_ORIGINS=*               # CORS origins (comma-separated)
MAX_PLAYERS_PER_ROOM=50         # Max players per room
LOG_LEVEL=info                  # Pino log level
NODE_ENV=development            # Environment
```

---

## 🚀 NPM Scripts

```json
{
  "start": "node server.js",              // Production start
  "dev": "node server.js",                // Development start
  "test": "node test.js",                 // Run tests
  "lint": "eslint .",                     // Lint code
  "lint:fix": "eslint . --fix"            // Fix lint issues
}
```

---

## 📊 Key Features by Directory

### Backend (`/rooms`, `/utils`, `/middleware`)
- In-memory room state management
- Real-time synchronization via Socket.io
- 20+ question categories
- Multi-language support (EN/HI/Hinglish)
- Voting & scoring system
- Input validation & sanitization
- Rate limiting & security

### Frontend (`/public`)
- Progressive Web App (PWA)
- Responsive design (mobile-first)
- Premium animations (60fps)
- Glass morphism UI
- Parallax scrolling
- Micro-interactions
- Sound effects
- Real-time updates
- Emoji reactions
- Category selection
- Player management

---

## 🎯 Architecture Highlights

### State Management
- **Server**: In-memory (ephemeral, fast)
- **Client**: Local state + Socket.io sync

### Real-time Communication
- **Protocol**: WebSocket (Socket.io)
- **Events**: Bidirectional event-driven

### Security
- Helmet.js for security headers
- CORS configuration
- Rate limiting
- Input sanitization
- XSS protection

### Performance
- Compression middleware
- Static file caching
- Optimized animations (GPU-accelerated)
- Lazy loading
- Service worker caching

---

## 📝 Notes

1. **In-Memory State**: Room data is stored in memory (`rooms = {}` in roomManager.js)
   - Fast and simple
   - Ephemeral (lost on restart)
   - Not horizontally scalable without sticky sessions

2. **PWA Features**:
   - Installable on mobile/desktop
   - Offline support via service worker
   - App-like experience

3. **Premium Design**:
   - Custom animations and transitions
   - Glass morphism effects
   - Gradient backgrounds
   - Micro-interactions
   - Responsive across all devices

4. **Scalability Considerations**:
   - For production at scale, consider:
     - Redis for shared state
     - Load balancer with sticky sessions
     - Database for persistence
     - CDN for static assets

---

## 🔗 Related Files

- **README.md**: Project overview and setup instructions
- **IMPROVEMENTS.md**: Feature roadmap and enhancements
- **docs/**: Detailed technical documentation
- **.env.example**: Environment configuration template

---

**Last Updated**: 2026-03-07
**Version**: 1.1.0
**License**: ISC
