# Architecture Documentation

## System Overview

VC Icebreaker is a real-time multiplayer web application built with a client-server architecture using WebSockets for bidirectional communication.

## Technology Stack

### Backend
- **Node.js** (>=16.0.0) - Runtime environment
- **Express** - Web framework
- **Socket.io** - Real-time bidirectional communication
- **Pino** - High-performance logging
- **Helmet** - Security headers
- **Compression** - Response compression

### Frontend
- **Vanilla JavaScript** - No framework dependencies
- **WebGL** - Animated background effects
- **Service Worker** - PWA functionality
- **CSS3** - Modern styling with animations

## Architecture Patterns

### 1. Layered Architecture

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│    (HTML, CSS, Client JS, PWA)      │
└─────────────────────────────────────┘
                 ↕ Socket.io
┌─────────────────────────────────────┐
│        Application Layer            │
│   (Express, Socket Handlers)        │
└─────────────────────────────────────┘
                 ↕
┌─────────────────────────────────────┐
│         Business Logic              │
│  (Room Manager, Player Manager,     │
│   Question Engine)                  │
└─────────────────────────────────────┘
                 ↕
┌─────────────────────────────────────┐
│          Data Layer                 │
│      (In-Memory Storage)            │
└─────────────────────────────────────┘
```

### 2. Event-Driven Architecture

The application uses Socket.io for event-driven communication:

**Client → Server Events:**
- `joinRoom` - Join or create a room
- `changeCategory` - Change question category (host only)
- `changeLanguage` - Change language (host only)
- `setTimer` - Configure timer (host only)
- `nextQuestion` - Get next question
- `skipQuestion` - Skip current question
- `sendReaction` - Send emoji reaction
- `castVote` - Vote for a player
- `resetRoom` - Reset room state (host only)
- `transferHost` - Transfer host privileges
- `toggleRoomLock` - Lock/unlock room (host only)
- `startGame` - Start game from category selection

**Server → Client Events:**
- `roomState` - Full room state update
- `reaction` - Emoji reaction broadcast
- `error` - Error message
- `roomLocked` - Room is locked/full
- `hostUpdated` - Host changed
- `hostChanged` - Host change notification

### 3. Module Organization

```
vc-icebreaker/
├── config/                 # Configuration management
│   └── index.js           # Centralized config
├── middleware/            # Express middleware
│   └── errorHandler.js   # Error handling
├── rooms/                 # Core game logic
│   ├── roomManager.js    # Room CRUD operations
│   ├── playerManager.js  # Player operations
│   └── questionEngine.js # Question selection
├── utils/                 # Utility functions
│   ├── logger.js         # Logging setup
│   ├── validation.js     # Input validation
│   ├── sanitize.js       # Data sanitization
│   └── roomCodeGenerator.js # Room code generation
├── public/                # Static assets
│   ├── index.html        # SPA shell
│   ├── script.js         # Client logic
│   ├── style.css         # Styles
│   └── sw.js             # Service worker
├── server.js              # Express app setup
└── socketHandler.js       # Socket.io handlers
```

## Data Flow

### Room Creation Flow

```
1. Client clicks "Host Room"
   ↓
2. Client generates room code
   ↓
3. Client emits "joinRoom" with code
   ↓
4. Server validates input
   ↓
5. Server creates room in memory
   ↓
6. Server assigns host privileges
   ↓
7. Server emits "roomState" to client
   ↓
8. Client updates UI
```

### Question Flow

```
1. Host/Current player clicks "Next"
   ↓
2. Client emits "nextQuestion"
   ↓
3. Server validates permissions
   ↓
4. Server selects question from pool
   ↓
5. Server updates room state
   ↓
6. Server broadcasts "roomState" to all
   ↓
7. All clients update question display
   ↓
8. Timer starts (if enabled)
```

## State Management

### Server-Side State

**Room Object Structure:**
```javascript
{
  category: "chill",           // Current category
  usedIndexes: [0, 5, 12],    // Used question indexes
  currentQuestion: "...",      // Current question text
  participants: 5,             // Active connections
  currentTurn: 0,              // Turn index
  players: {                   // Player map
    "socketId": {
      id: "socketId",
      name: "Alice",
      isHost: true,
      joinedAt: 1234567890
    }
  },
  scores: {                    // Per-question scores
    "Alice": 3,
    "Bob": 1
  },
  categoryScores: {            // Persistent scores
    "chill": {
      "Alice": 10,
      "Bob": 5
    }
  },
  votedThisRound: {},         // Vote tracking
  timerEnabled: true,
  timerDuration: 60,
  isLocked: false,
  lastActivity: 1234567890,
  dominantMood: "chill",
  playerMoods: {},
  gamePhase: "playing"        // lobby | category_select | playing
}
```

### Client-Side State

```javascript
{
  currentRoom: "EPICTEAM42",
  currentName: "Alice",
  isHost: true,
  currentState: {...},        // Last room state
  lastQuestion: "...",
  timerSecondsLeft: 45,
  isMyTurn: false,
  selectedMood: "chill"
}
```

## Security Architecture

### Defense Layers

1. **Input Validation**
   - All user inputs validated before processing
   - Type checking and sanitization
   - Length limits enforced

2. **Rate Limiting**
   - Per-IP rate limits on sensitive operations
   - Per-socket rate limits on frequent events
   - Configurable thresholds

3. **Authentication & Authorization**
   - Host-only operations checked
   - Turn-based permissions enforced
   - Room lock mechanism

4. **Data Sanitization**
   - HTML/script injection prevention
   - Error message sanitization
   - Safe error responses

5. **Network Security**
   - CORS configuration
   - Helmet security headers
   - HTTPS enforcement (production)

## Performance Optimizations

### Server-Side

1. **Compression**
   - Gzip/Deflate for HTTP responses
   - ~70% size reduction

2. **Caching**
   - Static asset caching (1 day in production)
   - ETags for cache validation

3. **Memory Management**
   - Periodic cleanup of inactive rooms
   - Rate limit entry cleanup
   - Efficient data structures

4. **Socket.io Optimization**
   - WebSocket transport prioritized
   - Ping/pong configuration
   - Connection pooling

### Client-Side

1. **Asset Optimization**
   - Minified CSS/JS (production)
   - Lazy loading of sounds
   - Efficient DOM updates

2. **Animation Performance**
   - RequestAnimationFrame for smooth animations
   - CSS transforms for GPU acceleration
   - Debounced event handlers

3. **PWA Features**
   - Service worker caching
   - Offline fallback
   - Install prompt

## Scalability Considerations

### Current Limitations

- **Single Server**: In-memory state limits to one instance
- **Memory Bound**: Room count limited by available RAM
- **No Persistence**: State lost on restart

### Scaling Strategy (Future)

```
┌─────────────┐
│ Load        │
│ Balancer    │
└──────┬──────┘
       │
   ┌───┴───┐
   │       │
┌──▼──┐ ┌──▼──┐
│Node │ │Node │
│  1  │ │  2  │
└──┬──┘ └──┬──┘
   │       │
   └───┬───┘
       │
   ┌───▼───┐
   │ Redis │
   │ Pub/  │
   │ Sub   │
   └───────┘
```

**Redis Integration:**
- Shared room state across instances
- Pub/sub for real-time events
- Sticky sessions for Socket.io

## Monitoring & Observability

### Logging Strategy

**Log Levels:**
- `trace` - Detailed debugging
- `debug` - Development info
- `info` - Normal operations
- `warn` - Potential issues
- `error` - Errors requiring attention

**Structured Logging:**
```javascript
logger.info({
  room: "EPICTEAM42",
  participants: 5,
  category: "chill"
}, "Room state updated");
```

### Metrics

**Health Check:**
- Endpoint: `/health`
- Response time
- Uptime

**Advanced Metrics** (optional):
- Endpoint: `/metrics`
- Memory usage
- Active connections
- Room count

## Error Handling

### Error Flow

```
1. Error occurs in handler
   ↓
2. Try-catch or async wrapper catches
   ↓
3. Logger records error with context
   ↓
4. Error sanitized for client
   ↓
5. Client receives error event
   ↓
6. Client displays user-friendly message
```

### Error Categories

1. **Validation Errors** - Invalid input
2. **Permission Errors** - Unauthorized action
3. **State Errors** - Invalid state transition
4. **Network Errors** - Connection issues
5. **System Errors** - Server failures

## Testing Strategy

### Unit Tests
- Validation functions
- Room manager operations
- Player manager logic
- Question engine

### Integration Tests
- Socket.io event flows
- Room lifecycle
- Multi-player scenarios

### Load Tests
- Concurrent connections
- Message throughput
- Memory usage under load

## Deployment Architecture

### Production Setup

```
┌─────────────┐
│   CDN       │ (Static assets)
└──────┬──────┘
       │
┌──────▼──────┐
│   Nginx     │ (Reverse proxy)
│   + SSL     │
└──────┬──────┘
       │
┌──────▼──────┐
│   Node.js   │ (Application)
│   + PM2     │
└──────┬──────┘
       │
┌──────▼──────┐
│  Monitoring │ (Logs, metrics)
└─────────────┘
```

### Environment Separation

- **Development**: Local, verbose logging, hot reload
- **Staging**: Production-like, test data
- **Production**: Optimized, secure, monitored

## Future Enhancements

1. **Persistence Layer**
   - PostgreSQL for user accounts
   - Redis for session storage
   - S3 for media assets

2. **Microservices**
   - Auth service
   - Analytics service
   - Notification service

3. **Real-time Features**
   - Video integration
   - Screen sharing
   - Voice chat

4. **Advanced Features**
   - AI-generated questions
   - Custom question sets
   - Team analytics

---

**Last Updated**: 2026-03-05  
**Version**: 1.1.0
