# API Documentation

## REST Endpoints

### Health Check

**GET** `/health`

Check if the server is running and healthy.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-03-05T10:30:00.000Z",
  "uptime": 3600.5
}
```

**Status Codes:**
- `200` - Server is healthy

---

### Metrics (Optional)

**GET** `/metrics`

Get server performance metrics. Requires `ENABLE_ADVANCED_METRICS=true`.

**Response:**
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

**Status Codes:**
- `200` - Metrics retrieved successfully
- `404` - Metrics endpoint disabled

---

## Socket.io Events

### Client → Server Events

#### joinRoom

Join an existing room or create a new one.

**Payload:**
```javascript
{
  roomId: "EPICTEAM42",  // Required: Room code (2-12 chars, alphanumeric)
  name: "Alice"          // Optional: Player name (max 20 chars)
}
```

**Validation:**
- `roomId`: Must be 2-12 alphanumeric characters
- `name`: Max 20 characters, sanitized

**Response Events:**
- `roomState` - Room joined successfully
- `roomLocked` - Room is locked or full
- `error` - Validation error

**Rate Limit:** 5 requests per second per IP

---

#### changeCategory

Change the question category (host only).

**Payload:**
```javascript
{
  roomId: "EPICTEAM42",
  category: "chill"  // Valid categories: see below
}
```

**Valid Categories:**
- `all`, `chill`, `funny`, `spicy`, `deep`, `chaos`, `work`
- `nostalgia`, `creative`, `movies`, `sports`, `travel`, `food`
- `music`, `gaming`, `romance`, `journey`, `mystery`, `tech`
- `party`, `soulful`, `dares`

**Authorization:** Host only

**Response Events:**
- `roomState` - Category changed
- `error` - Invalid category or not host

**Rate Limit:** 1 request per second

---

#### changeLanguage

Change the question language (host only).

**Payload:**
```javascript
{
  roomId: "EPICTEAM42",
  language: "en"  // Valid: "en", "hi", "hinglish"
}
```

**Authorization:** Host only

**Response Events:**
- `roomState` - Language changed
- `error` - Invalid language or not host

**Rate Limit:** 1 request per second

---

#### setTimer

Configure the question timer (host only).

**Payload:**
```javascript
{
  roomId: "EPICTEAM42",
  enabled: true,
  duration: 60  // Seconds (10-600)
}
```

**Validation:**
- `duration`: Must be between 10 and 600 seconds

**Authorization:** Host only

**Response Events:**
- `roomState` - Timer configured
- `error` - Invalid duration or not host

**Rate Limit:** 2 requests per second

---

#### nextQuestion

Get the next question.

**Payload:**
```javascript
{
  roomId: "EPICTEAM42"
}
```

**Authorization:** Host or current turn player

**Response Events:**
- `roomState` - New question served

**Rate Limit:** 2 requests per second per IP

---

#### skipQuestion

Skip the current question.

**Payload:**
```javascript
{
  roomId: "EPICTEAM42"
}
```

**Authorization:** Host or current turn player

**Response Events:**
- `roomState` - Question skipped

**Rate Limit:** 5 requests per second per IP

---

#### sendReaction

Send an emoji reaction.

**Payload:**
```javascript
{
  roomId: "EPICTEAM42",
  emoji: "🔥"  // Valid: 🔥, 😂, 😮, ❤️
}
```

**Response Events:**
- `reaction` - Broadcast to all players

**Rate Limit:** 1.25 requests per second

---

#### castVote

Vote for a player's answer.

**Payload:**
```javascript
{
  roomId: "EPICTEAM42",
  votedFor: "Alice"  // Player name
}
```

**Rules:**
- Can't vote for yourself
- One vote per question
- Player must exist in room

**Response Events:**
- `roomState` - Vote recorded

---

#### resetRoom

Reset the room to initial state (host only).

**Payload:**
```javascript
"EPICTEAM42"  // Room ID as string
```

**Authorization:** Host only

**Response Events:**
- `roomState` - Room reset

**Rate Limit:** 1 request per second per IP

---

#### transferHost

Transfer host privileges to another player (host only).

**Payload:**
```javascript
{
  roomId: "EPICTEAM42",
  targetId: "socket-id-123"  // Socket ID of new host
}
```

**Authorization:** Host only

**Response Events:**
- `roomState` - Host transferred
- `hostChanged` - Notification with new host name

---

#### toggleRoomLock

Lock or unlock the room (host only).

**Payload:**
```javascript
{
  roomId: "EPICTEAM42"
}
```

**Authorization:** Host only

**Response Events:**
- `roomState` - Lock status toggled

**Rate Limit:** 2 requests per second

---

#### setMood

Set player's mood preference.

**Payload:**
```javascript
{
  roomId: "EPICTEAM42",
  mood: "chill"  // Valid: chill, hype, chaotic, deep
}
```

**Response Events:**
- `roomState` - Mood updated, dominant mood recalculated

**Rate Limit:** 1 request per second

---

#### startGame

Start the game from category selection (host only).

**Payload:**
```javascript
{
  roomId: "EPICTEAM42"
}
```

**Requirements:**
- Room must be in `category_select` phase
- A category must be selected

**Authorization:** Host only

**Response Events:**
- `roomState` - Game started, phase changed to `playing`

---

### Server → Client Events

#### roomState

Full room state update.

**Payload:**
```javascript
{
  category: "chill",
  usedIndexes: [0, 5, 12],
  currentQuestion: "What's your comfort food?",
  participants: 5,
  currentTurn: 0,
  players: {
    "socket-id-1": "Alice",  // Legacy format
    "socket-id-2": "Bob"
  },
  playersV2: {
    "socket-id-1": {
      id: "socket-id-1",
      name: "Alice",
      isHost: true,
      joinedAt: 1234567890
    }
  },
  scores: {
    "Alice": 3,
    "Bob": 1
  },
  categoryScores: {
    "chill": {
      "Alice": 10,
      "Bob": 5
    }
  },
  votedThisRound: {},
  timerEnabled: true,
  timerDuration: 60,
  isLocked: false,
  dominantMood: "chill",
  playerMoods: {},
  gamePhase: "playing",
  total: 24,
  language: "en"
}
```

---

#### reaction

Emoji reaction broadcast.

**Payload:**
```javascript
{
  emoji: "🔥",
  name: "Alice"
}
```

---

#### error

Error message.

**Payload:**
```javascript
{
  message: "Invalid category"
}
```

---

#### roomLocked

Room is locked or full.

**Payload:**
```javascript
{
  reason: "Room is locked by host"
}
```

---

#### hostUpdated

Host changed (legacy event).

**Payload:**
```javascript
{
  id: "socket-id-123"
}
```

---

#### hostChanged

Host change notification.

**Payload:**
```javascript
{
  newHostName: "Bob"
}
```

---

## Rate Limiting

### Global Rate Limits

- **Window**: 1 minute (configurable)
- **Max Requests**: 100 per IP (configurable)

### Event-Specific Rate Limits

| Event | Limit | Window |
|-------|-------|--------|
| `joinRoom` | 5 | 200ms |
| `changeCategory` | 1 | 1000ms |
| `changeLanguage` | 1 | 1000ms |
| `setTimer` | 2 | 500ms |
| `nextQuestion` | 2 | 500ms |
| `skipQuestion` | 5 | 200ms |
| `sendReaction` | 1.25 | 800ms |
| `resetRoom` | 1 | 1000ms |
| `toggleRoomLock` | 2 | 500ms |
| `setMood` | 1 | 1000ms |

---

## Error Codes

### Validation Errors

- `"Room ID is required"`
- `"Invalid room code format"`
- `"Name is required"`
- `"Name must be at least 1 character"`
- `"Category is required"`
- `"Invalid category"`
- `"Language is required"`
- `"Invalid language"`
- `"Timer duration must be between 10 and 600 seconds"`
- `"Invalid emoji"`

### Authorization Errors

- `"Not authorized"` - Not host when host-only action
- `"Not your turn"` - Action requires current turn

### State Errors

- `"Room not found"`
- `"Room is full (max X)"`
- `"Room is locked by host"`
- `"Invalid game phase"`
- `"Category not selected"`

### Rate Limit Errors

- `"Too many requests, please try again later"`
- `"Too many join attempts, please slow down"`

---

## Data Types

### Room Code
- **Format**: 2-12 alphanumeric characters
- **Example**: `EPICTEAM42`
- **Case**: Uppercase

### Player Name
- **Max Length**: 20 characters
- **Sanitized**: HTML/script tags removed
- **Example**: `Alice`

### Category
- **Type**: String (lowercase)
- **Valid Values**: See `changeCategory` event

### Language
- **Type**: String (lowercase)
- **Valid Values**: `en`, `hi`, `hinglish`

### Timer Duration
- **Type**: Integer
- **Range**: 10-600 seconds
- **Default**: 60 seconds

### Emoji
- **Type**: String (Unicode emoji)
- **Valid Values**: 🔥, 😂, 😮, ❤️

### Game Phase
- **Type**: String
- **Valid Values**: `lobby`, `category_select`, `playing`

---

## Best Practices

### Client Implementation

1. **Handle Disconnections**
   ```javascript
   socket.on("disconnect", () => {
     // Show reconnecting UI
   });
   
   socket.on("connect", () => {
     // Rejoin room if needed
   });
   ```

2. **Validate Before Sending**
   ```javascript
   if (roomId && roomId.length >= 2) {
     socket.emit("joinRoom", { roomId, name });
   }
   ```

3. **Handle Errors**
   ```javascript
   socket.on("error", ({ message }) => {
     showToast(message);
   });
   ```

4. **Debounce Frequent Events**
   ```javascript
   const debouncedReaction = debounce((emoji) => {
     socket.emit("sendReaction", { roomId, emoji });
   }, 800);
   ```

### Server Implementation

1. **Always Validate Input**
2. **Check Authorization**
3. **Update Activity Timestamp**
4. **Broadcast State Changes**
5. **Log Important Events**

---

## Examples

### Complete Room Flow

```javascript
// 1. Connect
const socket = io();

// 2. Join room
socket.emit("joinRoom", {
  roomId: "EPICTEAM42",
  name: "Alice"
});

// 3. Listen for state
socket.on("roomState", (state) => {
  console.log("Room state:", state);
  updateUI(state);
});

// 4. Change category (if host)
socket.emit("changeCategory", {
  roomId: "EPICTEAM42",
  category: "chill"
});

// 5. Get next question
socket.emit("nextQuestion", {
  roomId: "EPICTEAM42"
});

// 6. Send reaction
socket.emit("sendReaction", {
  roomId: "EPICTEAM42",
  emoji: "🔥"
});

// 7. Vote for player
socket.emit("castVote", {
  roomId: "EPICTEAM42",
  votedFor: "Bob"
});
```

---

**Last Updated**: 2026-03-05  
**Version**: 1.1.0
