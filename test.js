const { io } = require("socket.io-client");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const socketHandler = require("./socketHandler");

const URL = "http://127.0.0.1:3000";
const ROOM = "TESTROOM";
const TIMEOUT_MS = 4000;

function startTestServer() {
  return new Promise((resolve) => {
    const app = express();
    const server = http.createServer(app);
    const ioServer = new Server(server, { cors: { origin: "*" } });

    // Mock logger for tests
    const mockLogger = {
      info: () => { },
      error: () => { },
      warn: () => { },
      debug: () => { }
    };

    socketHandler(ioServer, mockLogger);
    server.listen(3000, "127.0.0.1", () => resolve(server));
  });
}

function waitForState(socket, predicate, label) {
  let lastSeenState = null;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      cleanup();
      console.log(`[TIMEOUT] ${label || "roomState"}. Last seen state:`, JSON.stringify(lastSeenState));
      reject(new Error(label || "Timed out waiting for roomState"));
    }, TIMEOUT_MS);

    function handler(state) {
      lastSeenState = state;
      try {
        if (predicate(state)) {
          cleanup();
          resolve(state);
        }
      } catch (err) {
        cleanup();
        console.error("waitForState Error:", err, "State:", JSON.stringify(state));
        reject(err);
      }
    }

    function cleanup() {
      clearTimeout(timer);
      socket.off("roomState", handler);
    }

    socket.on("roomState", handler);
  });
}

function waitForStateWithTimeout(socket, predicate, timeoutMs, label) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error(label || "Timed out waiting for roomState"));
    }, timeoutMs);

    function handler(state) {
      try {
        if (predicate(state)) {
          cleanup();
          resolve(state);
        }
      } catch (err) {
        cleanup();
        reject(err);
      }
    }

    function cleanup() {
      clearTimeout(timer);
      socket.off("roomState", handler);
    }

    socket.on("roomState", handler);
  });
}

function waitForTurnState(socket, expectedTurn) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error("Turn cycling failed"));
    }, TIMEOUT_MS);

    function handler(state) {
      if (state.currentTurn === expectedTurn) {
        cleanup();
        resolve(state);
      }
    }

    function cleanup() {
      clearTimeout(timer);
      socket.off("roomState", handler);
    }

    socket.on("roomState", handler);
  });
}

function waitForReaction(socket, predicate, timeoutMs, label) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error(label || "Timed out waiting for reaction"));
    }, timeoutMs);

    function handler(payload) {
      try {
        if (predicate(payload)) {
          cleanup();
          resolve(payload);
        }
      } catch (err) {
        cleanup();
        reject(err);
      }
    }

    function cleanup() {
      clearTimeout(timer);
      socket.off("reaction", handler);
    }

    socket.on("reaction", handler);
  });
}

function waitForNoReaction(socket, timeoutMs) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      cleanup();
      resolve(true);
    }, timeoutMs);

    function handler(payload) {
      cleanup();
      reject(new Error(`Unexpected reaction: ${JSON.stringify(payload)}`));
    }

    function cleanup() {
      clearTimeout(timer);
      socket.off("reaction", handler);
    }

    socket.on("reaction", handler);
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function connectSocket() {
  return new Promise((resolve, reject) => {
    const socket = io(URL, { transports: ["websocket"], reconnection: false });
    const timer = setTimeout(() => {
      socket.disconnect();
      reject(new Error("Timed out connecting"));
    }, TIMEOUT_MS);
    socket.on("connect", () => {
      clearTimeout(timer);
      resolve(socket);
    });
    socket.on("connect_error", err => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

async function run() {
  const httpServer = await startTestServer();
  const results = [];
  const sockets = [];

  const pass = (msg) => results.push({ ok: true, msg });
  const fail = (msg) => results.push({ ok: false, msg });

  try {
    const s1 = await connectSocket();
    sockets.push(s1);
    let lastState = null;
    s1.on("roomState", s => { lastState = s; });

    // 1. Room creation
    console.log("Starting test: Room creation");
    s1.emit("joinRoom", { roomId: ROOM, name: "Alice" });
    await waitForState(s1, s => Object.values(s.players || {}).includes("Alice"), "Room creation failed");
    pass("Room creation");

    // 2. Second player joins
    console.log("Starting test: Second player joins");
    await sleep(250); // wait for rate limit window to expire
    const s2 = await connectSocket();
    sockets.push(s2);
    s2.emit("joinRoom", { roomId: ROOM, name: "Bob" });
    await waitForState(s1, s => s.participants === 2 && Object.values(s.players || {}).includes("Alice") && Object.values(s.players || {}).includes("Bob"), "Second player join failed");
    pass("Second player joins");

    // 3. Duplicate name handling
    console.log("Starting test: Duplicate name handling");
    const s3 = await connectSocket();
    sockets.push(s3);
    s3.emit("joinRoom", { roomId: ROOM, name: "Alice" });
    await waitForState(s1, s => Object.values(s.players || {}).includes("Alice 2"), "Duplicate name handling failed");
    pass("Duplicate name handling");

    // 4. Category change
    console.log("Starting test: Category change");
    s1.emit("changeCategory", { roomId: ROOM, category: "funny" });
    await waitForState(s1, s => s.category === "funny" && (s.usedIndexes || []).length === 0, "Category change failed");
    pass("Category change");

    // 5. Next question
    console.log("Starting test: Next question");
    s1.emit("nextQuestion", { roomId: ROOM });
    let state = await waitForState(s1, s => typeof s.currentQuestion === "string" && s.currentQuestion.length > 0 && (s.usedIndexes || []).length === 1, "Next question failed");
    pass("Next question");

    // 6. Skip question (ensure question changes; retry if same)
    console.log("Starting test: Skip question");
    let changed = false;
    let attempt = 0;
    let prevQuestion = state.currentQuestion;
    while (!changed && attempt < 5) {
      if (attempt > 0) {
        await sleep(600);
      }
      s1.emit("skipQuestion", { roomId: ROOM });
      state = await waitForState(s1, s => typeof s.currentQuestion === "string" && (s.usedIndexes || []).length === 1, "Skip question failed");
      changed = state.currentQuestion !== prevQuestion;
      prevQuestion = state.currentQuestion;
      attempt += 1;
    }
    if (!changed) throw new Error("Skip question did not change the question after 3 attempts");
    pass("Skip question");

    // 7. Turn cycling
    console.log("Starting test: Turn cycling");
    const turns = [];
    const totalPlayers = state.participants;
    const startTurn = state.currentTurn;
    const expected = [];
    for (let i = 0; i < 3; i += 1) {
      expected.push((startTurn + 1 + i) % totalPlayers);
    }
    for (let i = 0; i < expected.length; i += 1) {
      await sleep(600);
      s1.emit("nextQuestion", { roomId: ROOM });
      const st = await waitForTurnState(s1, expected[i]);
      turns.push(st.currentTurn);
    }
    if (turns.join(",") !== expected.join(",")) {
      throw new Error(`Turn cycling wrong: got [${turns.join(",")}], expected [${expected.join(",")}]`);
    }
    pass("Turn cycling");

    // 8. Emoji reactions
    console.log("Starting test: Emoji reactions");
    await sleep(800);
    const reactionDebug = (r) => {
      console.log(`REACTION event: ${JSON.stringify(r)}`);
    };
    s2.on("reaction", reactionDebug);
    s1.emit("sendReaction", { roomId: ROOM, emoji: "🔥" });
    await waitForReaction(s2, r => r.emoji === "🔥" && r.name === "Alice", 2500, "Emoji reaction failed");
    s2.off("reaction", reactionDebug);
    await sleep(900);
    s1.emit("sendReaction", { roomId: ROOM, emoji: "💀" });
    await waitForNoReaction(s2, 1200);
    pass("Emoji reactions");

    // 9. Timer settings
    console.log("Starting test: Timer settings");
    await sleep(1100);
    s1.emit("setTimer", { roomId: ROOM, enabled: true, duration: 30 });
    s1.on("roomState", state => {
      console.log("Timer test roomState:", JSON.stringify({ timerEnabled: state.timerEnabled, timerDuration: state.timerDuration }));
    });
    await waitForState(s1, s => {
      console.log("Timer state received:", JSON.stringify({ timerEnabled: s.timerEnabled, timerDuration: s.timerDuration }));
      return s.timerEnabled === true && s.timerDuration === 30;
    }, "Timer settings failed");
    await sleep(1100);
    s1.emit("setTimer", { roomId: ROOM, enabled: true, duration: 999 });
    await sleep(600);
    if ((lastState?.timerDuration || 0) !== 30) {
      throw new Error("Timer invalid duration not rejected");
    }
    pass("Timer settings");

    // 10. Scoreboard voting
    console.log("Starting test: Scoreboard voting");
    s1.emit("castVote", { roomId: ROOM, votedFor: "Bob" });
    await waitForState(s1, s => (s.scores && s.scores["Bob"] === 1), "Scoreboard vote failed");
    s1.emit("castVote", { roomId: ROOM, votedFor: "Bob" });
    await sleep(600);
    if ((lastState?.scores?.["Bob"] || 0) !== 1) {
      throw new Error("Scoreboard double vote not blocked");
    }
    s1.emit("castVote", { roomId: ROOM, votedFor: "Alice" });
    await sleep(600);
    if ((lastState?.scores?.["Alice"] || 0) !== 0) {
      throw new Error("Scoreboard self vote not blocked");
    }
    pass("Scoreboard voting");

    // 11. Persistent Category Scoring
    console.log("Starting test: Persistent Category Scoring");
    s1.emit("changeCategory", { roomId: ROOM, category: "chill" });
    await waitForState(s1, s => s.category === "chill", "Switch to chill failed");
    s2.emit("castVote", { roomId: ROOM, votedFor: "Alice" });
    await waitForState(s1, s => (s.categoryScores?.chill?.["Alice"] === 1), "Category vote failed");

    s1.emit("changeCategory", { roomId: ROOM, category: "funny" });
    await waitForState(s1, s => s.category === "funny", "Switch to funny failed");
    if (lastState.categoryScores?.funny?.["Alice"] === 1) {
      throw new Error("Score leaked into wrong category");
    }

    s1.emit("changeCategory", { roomId: ROOM, category: "chill" });
    await waitForState(s1, s => s.category === "chill", "Switch back to chill failed");
    if (lastState.categoryScores?.chill?.["Alice"] !== 1) {
      throw new Error("Category score was not persistent");
    }
    pass("Persistent Category Scoring");

    // 12. Reset room
    console.log("Starting test: Reset room");
    s1.emit("resetRoom", ROOM);
    await waitForState(s1, s => (s.usedIndexes || []).length === 0 && s.currentQuestion === null && s.currentTurn === 0, "Reset room failed");
    pass("Reset room");

    // 13. Disconnect updates player list
    console.log("Starting test: Disconnect updates player list");
    s2.disconnect();
    let lastPlayers = [];
    try {
      await waitForStateWithTimeout(s1, s => {
        lastPlayers = Object.values(s.players || {});
        return !lastPlayers.includes("Bob");
      }, 3000, "Disconnect update failed");
      pass("Disconnect updates player list");
    } catch (err) {
      fail(`Disconnect update failed (players: ${JSON.stringify(lastPlayers)})`);
    }

    // 14. Host Ownership Transfer
    console.log("Starting test: Host Ownership Transfer");
    const s2_new = await connectSocket();
    sockets.push(s2_new);
    await sleep(500);
    s2_new.emit("joinRoom", { roomId: ROOM, name: "Charlie" });
    await waitForState(s1, s => !!(s.playersV2 && s.playersV2[s2_new.id]), "Charlie join failed");

    // s1 is host. Transfer to Charlie (s2_new)
    s1.emit("transferHost", { roomId: ROOM, targetId: s2_new.id });
    await waitForState(s2_new, s => s.playersV2[s2_new.id]?.isHost === true, "Transfer failed");

    // Verify Charlie can now change category
    s2_new.emit("changeCategory", { roomId: ROOM, category: "spicy" });
    await waitForState(s2_new, s => s.category === "spicy", "New host category change failed");

    // Transfer back to s1 for remaining tests
    s2_new.emit("transferHost", { roomId: ROOM, targetId: s1.id });
    await waitForState(s1, s => s.playersV2[s1.id]?.isHost === true, "Transfer back failed");

    pass("Host Ownership Transfer");

    // 15. Shared Turn Control
    console.log("Starting test: Shared Turn Control");
    s1.emit("nextQuestion", { roomId: ROOM });
    const stateStart = await waitForState(s1, s => !!s.currentQuestion, "Failed to start question for turn test");
    console.log(`Current Turn: ${stateStart.currentTurn}, Players:`, Object.values(stateStart.players || {}));

    // Names might be { [id]: name } or { [id]: { name } } depending on normalize
    // Actually state.players is usually { [id]: name } in the simple broadcast logic
    const names = Object.values(stateStart.players || {});

    // Advance until it's Charlie's turn
    let attempts = 0;
    let currentState = stateStart;
    while (attempts < 5) {
      const idx = ((currentState.currentTurn % names.length) + names.length) % names.length;
      console.log(`Attempt ${attempts}: idx=${idx}, names[idx]=${names[idx]}, CharlieId=${s2_new.id}`);
      if (names[idx] === "Charlie") break;
      s1.emit("nextQuestion", { roomId: ROOM });
      currentState = await waitForState(s1, s => s.currentTurn !== currentState.currentTurn, "Turn failed to advance");
      attempts++;
    }

    const prevQ = currentState.currentQuestion;
    console.log("Charlie now emitting nextQuestion...");
    s2_new.emit("nextQuestion", { roomId: ROOM });
    await waitForState(s1, s => s.currentQuestion !== prevQ, "Charlie (non-host) failed to advance turn");
    pass("Shared Turn Control");

    // 16. All categories valid
    console.log("Starting test: All categories valid");
    const categories = ["chill", "funny", "spicy", "deep", "chaos", "work", "nostalgia", "creative"];
    for (const cat of categories) {
      await sleep(600);
      s1.emit("changeCategory", { roomId: ROOM, category: cat });
      await waitForState(s1, s => s.category === cat, `Category ${cat} failed`);
    }
    pass("All categories valid");

    // 17. Hinglish Language Support
    console.log("Starting test: Hinglish Language Support");
    s1.emit("changeLanguage", { roomId: ROOM, language: "hinglish" });
    await waitForState(s1, s => s.language === "hinglish", "Hinglish language change failed");
    s1.emit("nextQuestion", { roomId: ROOM });
    const hState = await waitForState(s1, s => !!s.currentQuestion, "Hinglish question failed to load");
    // Hinglish should use Roman characters
    if (!/[a-zA-Z]/.test(hState.currentQuestion)) {
      throw new Error(`Expected Hinglish question to contain Roman characters: ${hState.currentQuestion}`);
    }
    pass("Hinglish Language Support");

  } catch (err) {
    fail(err.message || String(err));
  } finally {
    sockets.forEach(s => {
      try { s.disconnect(); } catch (_) { }
    });
    await new Promise(resolve => httpServer.close(resolve));
  }

  results.forEach(r => {
    if (r.ok) {
      console.log(`PASS: ${r.msg}`);
    } else {
      console.log(`FAIL: ${r.msg}`);
    }
  });

  const failed = results.some(r => !r.ok);
  process.exit(failed ? 1 : 0);
}

run();