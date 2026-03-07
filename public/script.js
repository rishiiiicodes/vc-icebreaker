// public/script.js — complete rewrite (clean, no broken syntax)

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("is-ready");

  /* ================= STORAGE SHIM ================= */
  const storage = {
    get(key) { try { return localStorage.getItem(key); } catch (_) { return null; } },
    set(key, val) { try { localStorage.setItem(key, val); } catch (_) {} }
  };

  /* ================= DOM ELEMENTS ================= */
  // Lobby / Modals
  const lobbyScreen       = document.getElementById("lobbyScreen");
  const lobbyHost         = document.getElementById("lobbyHost");
  const lobbyJoin         = document.getElementById("lobbyJoin");
  const lobbyHome         = document.getElementById("lobbyHome");
  const nameInputHost     = document.getElementById("nameInputHost");
  const nameInputJoin     = document.getElementById("nameInputJoin");
  const createBtn         = document.getElementById("createBtn");
  const joinBtn           = document.getElementById("joinBtn");
  const goHostBtn         = document.getElementById("goHostBtn");
  const goJoinBtn         = document.getElementById("goJoinBtn");
  const backToHomeHost    = document.getElementById("backToHomeHost");
  const backToHomeJoin    = document.getElementById("backToHomeJoin");
  const regenerateBtn     = document.getElementById("regenerateBtn");
  const hostRoomCode      = document.getElementById("hostRoomCode");
  const roomInput         = document.getElementById("roomInput");

  // Category selection
  const categorySelectScreen = document.getElementById("categorySelectScreen");
  const hostCategoryView     = document.getElementById("hostCategoryView");
  const playerWaitingView    = document.getElementById("playerWaitingView");
  const startGameBtn         = document.getElementById("startGameBtn");
  const playerCountText      = document.getElementById("playerCountText");
  const categoryRoomCodeEl   = document.getElementById("categoryRoomCode");
  const categoryPreview      = document.getElementById("categoryPreview");
  const chosenCategoryEmoji  = document.getElementById("chosenCategoryEmoji");
  const chosenCategoryName   = document.getElementById("chosenCategoryName");
  const waitingPlayersList   = document.getElementById("waitingPlayersList");

  // Game screen
  const gameScreen        = document.getElementById("gameScreen");
  const roomStatus        = document.getElementById("roomStatus");
  const participantBadge  = document.getElementById("participantBadge");
  const participantCount  = document.getElementById("participantCount");
  const playerList        = document.getElementById("playerList");
  const inlineShareBtn    = document.getElementById("inlineShareBtn");
  const playersToggle     = document.getElementById("playersToggle");
  const leaveBtn          = document.getElementById("leaveBtn");
  const installBtn        = document.getElementById("installBtn");

  // Host controls panel
  const hostControlsPanel   = document.getElementById("hostControlsPanel");
  const hostControlsToggle  = document.getElementById("hostControlsToggle");
  const hostControlsContent = document.getElementById("hostControlsContent");
  const hostToggleIcon      = document.getElementById("hostToggleIcon");
  const lockRoomBtn         = document.getElementById("lockRoomBtn");

  // Game controls
  const categoryPillsWrap = document.querySelector(".category-pills");
  const nextBtn    = document.getElementById("nextBtn");
  const skipBtn    = document.getElementById("skipBtn");
  const resetBtn   = document.getElementById("resetBtn");

  // Timer
  const timerToggle      = document.getElementById("timerToggle");
  const timerOptions     = document.getElementById("timerOptions");
  const timerRing        = document.getElementById("timerRing");
  const timerRingFill    = document.getElementById("timerRingFill");
  const timerCount       = document.getElementById("timerCount");
  const timerCustomInput = document.getElementById("timerCustomInput");

  // Language
  const languageOptions  = document.getElementById("languageOptions");
  const languageControls = document.getElementById("languageControls");
  const hostLanguageOpts = document.getElementById("hostLanguageOptions");

  // Question area
  const questionEl        = document.getElementById("question");
  const questionCard      = document.getElementById("questionCard");
  const turnBadge         = document.getElementById("turnBadge");
  const copyQuestionBtn   = document.getElementById("copyQuestionBtn");
  const reactionBar       = document.getElementById("reactionBar");
  const reactionStage     = document.getElementById("reactionStage");
  const votingPanel       = document.getElementById("votingPanel");
  const voteList          = document.getElementById("voteList");
  const leaderboard       = document.getElementById("leaderboard");
  const leaderboardList   = document.getElementById("leaderboardList");
  const doneOverlay       = document.getElementById("doneOverlay");

  // Player view elements
  const categoryBadge    = document.getElementById("categoryBadge");
  const categoryEmoji    = document.getElementById("categoryEmoji");
  const categoryName     = document.getElementById("categoryName");
  const categoryProgress = document.getElementById("categoryProgress");
  const waitingMessage   = document.getElementById("waitingMessage");

  // Progress
  const progressFill  = document.getElementById("progressFill");
  const progressBar   = document.querySelector(".progress");
  const progressLabel = document.getElementById("progressLabel");

  // Group mood
  const groupMoodEl = document.getElementById("groupMood");

  // Score
  const categoryScoreboard = document.getElementById("categoryScoreboard");
  const categoryScoreList  = document.getElementById("categoryScoreList");

  // Toast / misc
  const toastEl    = document.getElementById("toast");
  const cardEl     = document.querySelector(".card");
  const subtitleEl = document.querySelector(".subtitle");
  const defaultSubtitle = subtitleEl ? subtitleEl.textContent : "";

  /* ================= STATE ================= */
  const socket = io();
  let currentRoom   = null;
  let currentName   = null;
  let currentHostId = null;
  let isHost        = false;
  let currentState  = null;
  let lastState     = null;
  let lastQuestion  = null;
  let lastTimerDuration = 60;
  let timerInterval = null;
  let timerSecondsLeft  = 0;
  let isMyTurn          = false;
  let doneAlreadyPlayed = false;
  let playersPanelVisible = false;
  let selectedMood  = null;
  let particleLayer = null;

  /* ================= CATEGORY INFO ================= */
  const categoryInfo = {
    all:       { emoji:"🎲", name:"All" },
    chill:     { emoji:"🌙", name:"Chill" },
    funny:     { emoji:"😂", name:"Funny" },
    spicy:     { emoji:"🔥", name:"Spicy" },
    deep:      { emoji:"🧠", name:"Deep" },
    chaos:     { emoji:"😈", name:"Chaos" },
    work:      { emoji:"💼", name:"Work" },
    nostalgia: { emoji:"📼", name:"Nostalgia" },
    creative:  { emoji:"🎨", name:"Creative" },
    movies:    { emoji:"🎬", name:"Movies" },
    sports:    { emoji:"⚽", name:"Sports" },
    travel:    { emoji:"✈️", name:"Travel" },
    food:      { emoji:"🍕", name:"Food" },
    music:     { emoji:"🎵", name:"Music" },
    gaming:    { emoji:"🎮", name:"Gaming" },
    romance:   { emoji:"💕", name:"Romance" },
    journey:   { emoji:"🛤️", name:"Life Journey" },
    mystery:   { emoji:"🔮", name:"Mystery" },
    tech:      { emoji:"💻", name:"Tech" },
    party:     { emoji:"🎉", name:"Party Mix" },
    soulful:   { emoji:"😭", name:"Soulful" },
    dares:     { emoji:"🎯", name:"Dares" }
  };

  const categoryRgbPalette = {
    chill:"24, 213, 196", funny:"246, 178, 91", spicy:"244, 83, 72",
    deep:"124, 231, 255", chaos:"255, 115, 180", work:"74, 222, 128",
    nostalgia:"251, 146, 60", creative:"232, 121, 249", all:"255, 255, 255",
    movies:"167, 139, 250", sports:"52, 211, 153", travel:"56, 189, 248",
    food:"249, 115, 22", music:"244, 114, 182", gaming:"129, 140, 248",
    romance:"255, 77, 109", journey:"251, 191, 36", mystery:"99, 102, 241",
    tech:"14, 165, 233", party:"252, 211, 77", dares:"249, 115, 22",
    soulful:"236, 72, 153"
  };

  const particlePalette = {
    chill:"#18d5c4", funny:"#f6b25b", spicy:"#f45348", deep:"#7ce7ff",
    chaos:"#ff73b4", work:"#4ade80", nostalgia:"#fb923c", creative:"#e879f9",
    all:"#ffffff", movies:"#a78bfa", sports:"#34d399", travel:"#38bdf8",
    food:"#f97316", music:"#f472b6", gaming:"#818cf8", romance:"#ff4d6d",
    journey:"#fbbf24", mystery:"#6366f1", tech:"#0ea5e9", party:"#fcd34d",
    soulful:"#ec4899", dares:"#f97316"
  };

  /* ================= ROOM CODE ================= */
  const ADJS  = ["CHILL","EPIC","WILD","COOL","BOLD","FAST","KEEN","ZANY","MINT","NEON"];
  const NOUNS = ["TEAM","CREW","PACK","GANG","CLUB","BAND","UNIT","HIVE","TRIO","QUAD"];
  function generateRoomCode() {
    const adj  = ADJS[Math.floor(Math.random() * ADJS.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const num  = Math.floor(Math.random() * 99) + 1;
    return `${adj}${noun}${num}`;
  }
  if (hostRoomCode) hostRoomCode.textContent = generateRoomCode();

  /* ================= TOAST ================= */
  let toastTimer;
  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("visible"), 2500);
  }

  /* ================= SOUNDS ================= */
  const sounds = {};
  let soundReady = false;
  function loadSounds() {
    if (soundReady) return;
    ["click","complete","reset"].forEach(key => {
      const a = new Audio(`${key}.mp3`);
      a.preload = "auto"; a.volume = 0.5; sounds[key] = a;
    });
    soundReady = true;
  }
  function playSound(name) {
    if (!sounds[name]) return;
    sounds[name].currentTime = 0;
    sounds[name].play().catch(() => {});
  }
  document.addEventListener("click", loadSounds, { once: true });

  /* ================= SCREEN MANAGEMENT ================= */
  function showScreen(screenId) {
    ["lobbyScreen","categorySelectScreen","gameScreen"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add("hidden");
    });
    const target = document.getElementById(screenId);
    if (target) target.classList.remove("hidden");
  }

  function openModal(modalId) {
    [lobbyHost, lobbyJoin].forEach(m => { if (m) m.classList.add("hidden"); });
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove("hidden");
  }

  function closeAllModals() {
    [lobbyHost, lobbyJoin].forEach(m => { if (m) m.classList.add("hidden"); });
  }

  /* ================= ENABLE/DISABLE UI ================= */
  function enableGameUI(on) {
    if (nextBtn)       nextBtn.disabled       = !on;
    if (skipBtn)       skipBtn.disabled       = !on;
    if (resetBtn)      resetBtn.disabled      = !on;
    if (leaveBtn)      leaveBtn.classList.toggle("hidden", !on);
    if (playersToggle) playersToggle.classList.toggle("hidden", !on);
    if (inlineShareBtn) inlineShareBtn.classList.toggle("hidden", !on);
    if (languageControls) languageControls.classList.toggle("hidden", !on);
  }

  /* ================= TIMER ================= */
  function setActiveTimerButton(seconds) {
    if (!timerOptions) return;
    timerOptions.querySelectorAll(".timer-btn").forEach(btn => {
      btn.classList.toggle("active", Number(btn.dataset.seconds) === Number(seconds));
    });
  }

  function getActiveTimerDuration() {
    if (timerCustomInput) {
      const v = parseInt(timerCustomInput.value, 10);
      if (!isNaN(v) && v >= 10 && v <= 600) return v;
    }
    if (!timerOptions) return 60;
    const active = timerOptions.querySelector(".timer-btn.active");
    const s = active ? Number(active.dataset.seconds) : 60;
    return s > 0 ? s : 60;
  }

  function updateTimerRing(total, left) {
    if (!timerRingFill || !timerCount) return;
    const C = 163.4;
    const ratio = total > 0 ? left / total : 0;
    timerRingFill.style.strokeDasharray  = `${C}`;
    timerRingFill.style.strokeDashoffset = `${C * (1 - ratio)}`;
    timerCount.textContent = String(left);
  }

  function startTimer(seconds) {
    if (!timerRing) return;
    stopTimer();
    timerSecondsLeft = seconds;
    timerRing.classList.remove("hidden");
    updateTimerRing(seconds, timerSecondsLeft);
    timerInterval = setInterval(() => {
      timerSecondsLeft -= 1;
      if (timerSecondsLeft <= 0) {
        updateTimerRing(seconds, 0);
        stopTimer();
        playSound("click");
        if (currentRoom && (isHost || isMyTurn)) {
          socket.emit("nextQuestion", { roomId: currentRoom });
        }
        return;
      }
      updateTimerRing(seconds, timerSecondsLeft);
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
    if (timerRing) timerRing.classList.add("hidden");
  }

  /* ================= CONFETTI ================= */
  function spawnConfetti(count) {
    count = count || 120;
    const canvas = document.createElement("canvas");
    canvas.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:998;";
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) { canvas.remove(); return; }
    const colors = ["#18d5c4","#f6b25b","#f45348","#ff73b4","#ffffff","#FFD700"];
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: -10,
      vx: (Math.random() * 6) - 3,
      vy: 2 + Math.random() * 4,
      rot: Math.random() * Math.PI,
      rotSpeed: (Math.random() * 0.2) - 0.1,
      size: 4 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    const start = performance.now();
    let rafId;
    function frame(t) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.vy += 0.15; p.x += p.vx; p.y += p.vy; p.rot += p.rotSpeed;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
      if (t - start < 3500) { rafId = requestAnimationFrame(frame); }
      else { cancelAnimationFrame(rafId); canvas.remove(); }
    }
    requestAnimationFrame(frame);
  }

  /* ================= CATEGORY GLOW ================= */
  function updateCategoryGlow(category) {
    document.body.classList.remove(...Object.keys(particlePalette));
    if (category) document.body.classList.add(category);
    const rgb = categoryRgbPalette[category] || "255, 255, 255";
    if (questionCard) questionCard.style.setProperty("--cat-color-rgb", rgb);
    document.documentElement.style.setProperty("--cat-color-rgb", rgb);
  }

  /* ================= CATEGORY BADGE ================= */
  function updateCategoryBadge(state) {
    if (!categoryBadge || !categoryEmoji || !categoryName || !categoryProgress) return;
    
    if (state.category) {
      const info = categoryInfo[state.category] || { emoji: "🎲", name: state.category };
      categoryEmoji.textContent = info.emoji;
      categoryName.textContent = info.name;
      
      const used = state.usedIndexes ? state.usedIndexes.length : 0;
      const total = state.total || 0;
      categoryProgress.textContent = `${used} / ${total} questions`;
      
      categoryBadge.classList.remove("hidden");
    } else {
      categoryBadge.classList.add("hidden");
    }
  }

  /* ================= PILLS ================= */
  function getPills() {
    return categoryPillsWrap ? [...categoryPillsWrap.querySelectorAll(".pill")] : [];
  }
  function setActivePill(category) {
    getPills().forEach(p => {
      const active = p.dataset.value === category;
      p.classList.toggle("active", active);
      p.setAttribute("aria-checked", active ? "true" : "false");
    });
  }
  function clearPendingPills() {
    getPills().forEach(p => p.classList.remove("pending"));
  }

  /* ================= PROGRESS ================= */
  function updateProgress(used, total) {
    const pct = total > 0 ? (used / total) * 100 : 0;
    if (progressFill)  progressFill.style.width = pct + "%";
    if (progressBar)   progressBar.setAttribute("aria-valuenow", Math.round(pct));
    if (progressLabel) progressLabel.textContent = `${used} / ${total}`;
  }

  /* ================= QUESTION ANIMATION ================= */
  let questionAnimId;
  function animateQuestion(text) {
    if (!questionCard || !questionEl) return;
    clearTimeout(questionAnimId);
    questionCard.classList.remove("is-animating");
    void questionCard.offsetWidth;
    questionCard.classList.add("is-animating");
    questionEl.style.opacity = "0";
    questionEl.style.transform = "translateY(12px)";
    questionAnimId = setTimeout(() => {
      questionEl.textContent = text || "";
      questionEl.style.opacity = "1";
      questionEl.style.transform = "translateY(0)";
    }, 200);
  }

  /* ================= VOTE ANIMATION ================= */
  function animateVoteReceived(playerName) {
    const chip = document.querySelector(`[data-player-name="${playerName}"]`);
    if (!chip) return;
    const nameSpan = chip.querySelector(".player-name");
    if (!nameSpan) return;
    nameSpan.classList.add("vote-animated");
    setTimeout(() => nameSpan.classList.remove("vote-animated"), 600);
    const floatLabel = document.createElement("div");
    floatLabel.className = "vote-float";
    floatLabel.textContent = "+1";
    nameSpan.appendChild(floatLabel);
    setTimeout(() => { if (floatLabel.parentNode) floatLabel.parentNode.removeChild(floatLabel); }, 1500);
  }

  function checkVoteChanges(state) {
    if (!lastState || !state.scores) return;
    Object.entries(state.scores).forEach(([playerName, newScore]) => {
      const oldScore = (lastState.scores || {})[playerName] || 0;
      if (newScore > oldScore) animateVoteReceived(playerName);
    });
  }

  /* ================= LEADERBOARD ================= */
  function getAvatarColor(rank) {
    return { 1:"#FFD700", 2:"#C0C0C0", 3:"#CD7F32" }[rank] || "#64748b";
  }

  function buildTotalScores(state) {
    const categoryScores = state.categoryScores || {};
    const totalScores = {};
    Object.values(categoryScores).forEach(cs => {
      Object.entries(cs).forEach(([name, score]) => {
        totalScores[name] = (totalScores[name] || 0) + score;
      });
    });
    return totalScores;
  }

  function createPodiumUI(state) {
    const totalScores = buildTotalScores(state);
    const allPlayers = Object.values(state.playersV2 || {}).map(p => ({
      name: p.name,
      totalScore: totalScores[p.name] || 0,
      isHost: p.isHost || false
    })).sort((a, b) => b.totalScore - a.totalScore);

    if (allPlayers.length === 0) return "";

    let html = `<div class="leaderboard-header">Final Standings — ${allPlayers.length} players</div><div class="leaderboard-table">`;
    allPlayers.forEach((player, index) => {
      const rank = index + 1;
      const rankIcon = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `${rank}.`;
      const rankClass = rank <= 3 ? ["first","second","third"][rank-1] : "other";
      const scoreDisplay = player.totalScore > 0 ? `${player.totalScore} ⭐` : "—";
      html += `<div class="leaderboard-row ${rankClass}" style="animation-delay:${index * 0.1}s">
        <div class="leaderboard-rank">${rankIcon}</div>
        <div class="leaderboard-avatar" style="background:${getAvatarColor(rank)};width:32px;height:32px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-weight:700;color:#111;">${player.name.charAt(0).toUpperCase()}</div>
        <div class="leaderboard-name">${player.name}${player.isHost ? " 👑" : ""}</div>
        <div class="leaderboard-score">${scoreDisplay}</div>
      </div>`;
    });
    html += `</div>`;
    if (isHost) {
      html += `<div style="text-align:center;margin-top:16px"><button class="btn primary" id="playAgainBtn">🔄 Play Again</button></div>`;
    }
    return html;
  }

  function updateMiniLeaderboard(state) {
    const totalScores = buildTotalScores(state);
    const topPlayers = Object.values(state.playersV2 || {})
      .map(p => ({ name: p.name, score: totalScores[p.name] || 0 }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .filter(p => p.score > 0);

    let mini = document.getElementById("miniLeaderboard");
    if (!mini) {
      mini = document.createElement("div");
      mini.id = "miniLeaderboard";
      mini.className = "mini-leaderboard hidden";
      const qa = document.getElementById("questionArea");
      if (qa) qa.parentNode.insertBefore(mini, qa.nextSibling);
    }
    if (topPlayers.length > 0) {
      const medals = ["🥇","🥈","🥉"];
      mini.innerHTML = topPlayers.map((p, i) => `${medals[i]} ${p.name} (${p.score})`).join("  &nbsp;  ");
      mini.classList.remove("hidden");
    } else {
      mini.classList.add("hidden");
    }
  }

  function updateRankBadges(state) {
    const totalScores = buildTotalScores(state);
    const sortedNames = Object.entries(totalScores).sort(([,a],[,b]) => b - a).map(([name]) => name);
    document.querySelectorAll(".player-chip").forEach(chip => {
      chip.querySelectorAll(".rank-badge").forEach(b => b.remove());
      const nameSpan = chip.querySelector(".player-name");
      if (!nameSpan) return;
      const pName = nameSpan.textContent;
      const score = totalScores[pName] || 0;
      if (score > 0) {
        const ri = sortedNames.indexOf(pName);
        if (ri < 3) {
          const badge = document.createElement("span");
          badge.className = "rank-badge";
          badge.textContent = ri === 0 ? "👑" : ri === 1 ? "🥈" : "🥉";
          chip.appendChild(badge);
        }
      }
    });
  }

  /* ================= WAITING MESSAGE ================= */
  function updateWaitingMessage(state) {
    if (!waitingMessage) return;
    const hasQ = !!state.currentQuestion;
    if (isHost || hasQ) {
      waitingMessage.classList.add("hidden");
    } else {
      waitingMessage.classList.remove("hidden");
    }
  }

  /* ================= CATEGORY SELECTION UI ================= */
  function updateCategorySelectionUI(state) {
    if (isHost) {
      if (hostCategoryView)  hostCategoryView.classList.remove("hidden");
      if (playerWaitingView) playerWaitingView.classList.add("hidden");
    } else {
      if (hostCategoryView)  hostCategoryView.classList.add("hidden");
      if (playerWaitingView) playerWaitingView.classList.remove("hidden");
    }

    const playerCount = Object.keys(state.playersV2 || {}).length;
    if (playerCountText) {
      playerCountText.textContent = `${playerCount} ${playerCount === 1 ? "player is" : "players are"} ready — pick a category to begin`;
    }

    if (categoryRoomCodeEl && currentRoom) categoryRoomCodeEl.textContent = currentRoom;

    if (startGameBtn) startGameBtn.disabled = !state.category;

    if (isHost && state.category) {
      document.querySelectorAll(".category-card").forEach(card => {
        card.classList.toggle("selected", card.dataset.category === state.category);
      });
    }

    if (!isHost) {
      if (categoryPreview) {
        if (state.category) {
          categoryPreview.classList.remove("hidden");
          const info = categoryInfo[state.category] || { emoji: "🎲", name: state.category };
          if (chosenCategoryEmoji) chosenCategoryEmoji.textContent = info.emoji;
          if (chosenCategoryName)  chosenCategoryName.textContent  = info.name;
        } else {
          categoryPreview.classList.add("hidden");
        }
      }

      if (waitingPlayersList) {
        waitingPlayersList.innerHTML = "";
        Object.values(state.playersV2 || {}).forEach(p => {
          const chip = document.createElement("div");
          chip.className = `player-chip ${p.isHost ? "is-host" : ""}`;
          chip.textContent = `${p.isHost ? "👑 " : ""}${p.name}`;
          waitingPlayersList.appendChild(chip);
        });
      }
    }
  }

  /* ================= HOST CONTROLS ================= */
  function updateHostControls(state) {
    state = state || currentState || {};
    if (!currentRoom) return;

    if (resetBtn) resetBtn.disabled = !isHost;
    if (timerToggle) timerToggle.disabled = !isHost;
    if (timerOptions) timerOptions.querySelectorAll(".timer-btn").forEach(b => { b.disabled = !isHost; });
    if (timerCustomInput) timerCustomInput.disabled = !isHost;

    isMyTurn = false;
    const names = Object.values(state.players || {});
    if (names.length > 0) {
      const idxRaw = typeof state.currentTurn === "number" ? state.currentTurn : 0;
      const idx = ((idxRaw % names.length) + names.length) % names.length;
      isMyTurn = names[idx] === currentName;
    }
    const canProgress = (isHost || isMyTurn) && !!currentRoom;
    if (nextBtn) nextBtn.disabled = !canProgress;
    if (skipBtn) skipBtn.disabled = !canProgress;

    if (hostControlsPanel) hostControlsPanel.classList.toggle("hidden", !isHost);
    if (categoryBadge)     categoryBadge.classList.toggle("hidden", isHost);
  }

function updateUIFromState(state, isFirstState) {
  isFirstState = !!isFirstState;
  currentState = state;
  clearPendingPills();

  // Debug: Log game phase transitions
  console.log("Game phase:", state.gamePhase, "isHost:", isHost);

  if (state.gamePhase === "category_select") {
    showScreen("categorySelectScreen");
    updateCategorySelectionUI(state);
  } else if (state.gamePhase === "playing") {
    showScreen("gameScreen");
  } else {
    showScreen("lobbyScreen");
  }

  const used   = state.usedIndexes ? state.usedIndexes.length : 0;
  const total  = state.total || 0;
  const hasQ   = !!state.currentQuestion;
  const isDone = used >= total && total > 0 && state.currentQuestion === null;
  const questionChanged = state.currentQuestion !== lastQuestion;

  if (hasQ && questionChanged) clearFloatingEmojis();

  setActivePill(state.category);
  updateCategoryGlow(state.category);
  updateProgress(used, total);
  updateHostControls(state);
  updateCategoryBadge(state);
  updateWaitingMessage(state);

  if (groupMoodEl) {
    if (state.dominantMood) {
      const moodEmojis = { chill:"😌", hype:"⚡", chaotic:"🔥", deep:"🌊" };
      const moodTexts  = { chill:"Chill", hype:"Hype", chaotic:"Chaotic", deep:"Deep" };
      const mEl = groupMoodEl.querySelector(".group-mood-emoji");
      const mTx = groupMoodEl.querySelector(".group-mood-text");
      if (mEl) mEl.textContent = moodEmojis[state.dominantMood] || "😌";
      if (mTx) mTx.textContent  = moodTexts[state.dominantMood]  || "Chill";
      groupMoodEl.classList.remove("hidden");
    } else {
      groupMoodEl.classList.add("hidden");
    }
  }

    if (typeof state.participants === "number") {
      if (participantCount) participantCount.textContent = state.participants;
      if (participantBadge) participantBadge.classList.remove("hidden");
    }

    if (currentRoom && roomStatus && typeof state.isLocked === "boolean") {
      const label = `Room: ${currentRoom}${state.isLocked ? " (Locked)" : ""}`;
      roomStatus.textContent = label;
      if (subtitleEl) subtitleEl.textContent = label;
    }

    if (lockRoomBtn && typeof state.isLocked === "boolean") {
      lockRoomBtn.textContent = state.isLocked ? "🔓 Unlock Room" : "🔒 Lock Room";
    }

    // Player list
    if (playerList) {
      const players = Object.values(state.playersV2 || {});
      if (players.length > 0) {
        const totalScores = buildTotalScores(state);
        const sorted = [...players].sort((a, b) => (totalScores[b.name] || 0) - (totalScores[a.name] || 0));
        playerList.innerHTML = "";
        sorted.forEach((p, ri) => {
          const chip = document.createElement("div");
          chip.className = `player-chip ${p.isHost ? "is-host" : ""}`;
          chip.dataset.playerName = p.name;
          if (p.isHost) {
            const crown = document.createElement("span");
            crown.className = "host-crown"; crown.textContent = "👑 ";
            chip.appendChild(crown);
          }
          const ps = totalScores[p.name] || 0;
          if (ps > 0 && ri < 3) {
            const badge = document.createElement("span");
            badge.className = "rank-badge";
            badge.textContent = ri === 0 ? "👑" : ri === 1 ? "🥈" : "🥉";
            chip.appendChild(badge);
            chip.appendChild(document.createTextNode(" "));
          }
          const nameSpan = document.createElement("span");
          nameSpan.className = "player-name";
          nameSpan.textContent = p.name;
          chip.appendChild(nameSpan);
          if (!p.isHost && isHost) {
            const tBtn = document.createElement("button");
            tBtn.className = "transfer-btn";
            tBtn.textContent = "Handover";
            tBtn.addEventListener("click", () => {
              if (confirm(`Transfer ownership to ${p.name}?`)) {
                socket.emit("transferHost", { roomId: currentRoom, targetId: p.id });
              }
            });
            chip.appendChild(document.createTextNode(" "));
            chip.appendChild(tBtn);
          }
          playerList.appendChild(chip);
        });
        playerList.classList.toggle("hidden", !playersPanelVisible);
      } else {
        playerList.classList.add("hidden");
      }
    }

    // Turn badge
    if (turnBadge) {
      const names = Object.values(state.players || {});
      if (names.length > 0 && hasQ) {
        const idxRaw = typeof state.currentTurn === "number" ? state.currentTurn : 0;
        const idx = ((idxRaw % names.length) + names.length) % names.length;
        turnBadge.innerHTML = `${names[idx]}'s turn`;
        turnBadge.classList.remove("hidden");
      } else {
        turnBadge.classList.add("hidden");
      }
    }

    // Voting panel
    if (votingPanel && voteList) {
      const names = Object.values(state.players || {});
      const canVote = hasQ && names.length > 1 && !isDone;
      votingPanel.classList.toggle("hidden", !canVote);
      if (canVote) {
        const votedAlready = !!(state.votedThisRound && state.votedThisRound[socket.id]);
        voteList.innerHTML = "";
        names.forEach(name => {
          if (name === currentName) return;
          const btn = document.createElement("button");
          btn.className = "vote-btn"; btn.type = "button"; btn.dataset.name = name;
          if (votedAlready) { btn.textContent = "✓ Voted"; btn.disabled = true; }
          else { btn.textContent = `👑 ${name}`; }
          voteList.appendChild(btn);
        });
      } else {
        voteList.innerHTML = "";
      }
    }

    if (reactionBar) reactionBar.classList.toggle("hidden", !(hasQ && !isDone));

    // Timer
    if (timerToggle) timerToggle.checked = !!state.timerEnabled;
    if (timerOptions) {
      timerOptions.classList.toggle("hidden", !state.timerEnabled);
      setActiveTimerButton(state.timerDuration || 60);
    }
    if (!state.timerEnabled || isDone || !hasQ) {
      stopTimer();
    } else if (questionChanged || state.timerDuration !== lastTimerDuration) {
      startTimer(state.timerDuration || 60);
    }
    lastTimerDuration = state.timerDuration || 60;

    // Language
    const langSync = (container) => {
      if (!container) return;
      const lang = state.language || "en";
      container.querySelectorAll(".lang-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.lang === lang);
        if (container === languageOptions) btn.disabled = !isHost;
      });
    };
    langSync(languageOptions);
    langSync(hostLanguageOpts);

    // Done overlay
    if (doneOverlay) doneOverlay.classList.toggle("hidden", !isDone);
    if (questionCard) questionCard.style.opacity = isDone ? "0.15" : "1";
    if (isDone && !doneAlreadyPlayed) {
      playSound("complete"); spawnConfetti(120); doneAlreadyPlayed = true;
    }

    // Leaderboard
    if (leaderboard && leaderboardList) {
      if (isDone) {
        leaderboardList.innerHTML = createPodiumUI(state);
        leaderboard.classList.remove("hidden");
      } else {
        leaderboard.classList.add("hidden");
      }
    }

    checkVoteChanges(state);
    updateRankBadges(state);
    updateMiniLeaderboard(state);

    // Category scoreboard
    if (categoryScoreboard && categoryScoreList) {
      const scores = state.categoryScores ? state.categoryScores[state.category || "all"] : null;
      if (scores) {
        const sorted = Object.entries(scores).map(([name,val]) => ({ name,val })).filter(e => e.val > 0).sort((a,b) => b.val - a.val);
        if (sorted.length > 0) {
          categoryScoreList.innerHTML = "";
          sorted.forEach(entry => {
            const item = document.createElement("div"); item.className = "scoreboard-item";
            item.appendChild(document.createTextNode(entry.name + " "));
            const sc = document.createElement("span"); sc.className = "score"; sc.textContent = entry.val;
            item.appendChild(sc); categoryScoreList.appendChild(item);
          });
        }
      }
    }

    if (isFirstState && used > 0) showToast(`Joined mid-game (${state.category}), ${used}/${total} done`);

    animateQuestion(state.currentQuestion || "Click Next Question to begin.");
    lastQuestion = state.currentQuestion;
    lastState = state;
  }

  /* ================= JOIN ROOM ================= */
  function doJoin(nameOverride, roomOverride) {
    let name = (nameOverride || "").trim();
    let room = (roomOverride || "").trim().toUpperCase();

    if (!name) {
      if (lobbyHost && !lobbyHost.classList.contains("hidden") && nameInputHost) name = nameInputHost.value.trim();
      else if (lobbyJoin && !lobbyJoin.classList.contains("hidden") && nameInputJoin)  name = nameInputJoin.value.trim();
    }
    if (!room && roomInput) room = roomInput.value.trim().toUpperCase();

    if (!name) { showToast("Enter your name!"); return; }
    if (!room) { showToast("Enter room code!"); return; }

    currentName = name.slice(0, 20);
    currentRoom = room;
    currentState = null;

    const lang = (languageOptions ? languageOptions.querySelector(".lang-btn.active") : null)?.dataset?.lang || "en";
    socket.emit("joinRoom", { roomId: room, name: currentName, language: lang, mood: selectedMood });

    closeAllModals();
    if (roomStatus) roomStatus.textContent = `Room: ${room}`;
    if (subtitleEl) subtitleEl.textContent = `Room: ${room}`;
    enableGameUI(true);
    playSound("click");

    if (nameInputHost) nameInputHost.disabled = true;
    if (nameInputJoin) nameInputJoin.disabled = true;
    if (roomInput)     roomInput.disabled     = true;

    const url = new URL(window.location.href);
    url.searchParams.set("room", room);
    window.history.replaceState({}, "", url.toString());
  }

  /* ================= LANDING BUTTONS ================= */
  if (goHostBtn) goHostBtn.addEventListener("click", () => { openModal("lobbyHost"); playSound("click"); });
  if (goJoinBtn) goJoinBtn.addEventListener("click", () => { openModal("lobbyJoin"); playSound("click"); });
  if (backToHomeHost) backToHomeHost.addEventListener("click", () => { closeAllModals(); playSound("click"); });
  if (backToHomeJoin) backToHomeJoin.addEventListener("click", () => { closeAllModals(); playSound("click"); });

  [lobbyHost, lobbyJoin].forEach(modal => {
    if (!modal) return;
    modal.addEventListener("click", e => { if (e.target === modal) { closeAllModals(); } });
  });

  if (regenerateBtn) regenerateBtn.addEventListener("click", () => {
    if (hostRoomCode) hostRoomCode.textContent = generateRoomCode();
    playSound("click");
  });

  if (createBtn) createBtn.addEventListener("click", () => {
    const name = nameInputHost ? nameInputHost.value.trim() : "";
    const code = hostRoomCode ? hostRoomCode.textContent.trim() : generateRoomCode();
    if (!name) { showToast("Enter your name!"); return; }
    
    // Close the host modal and show loading state
    closeAllModals();
    if (roomStatus) roomStatus.textContent = `Creating room: ${code}`;
    
    // Join the room - the server will send room state with category_select phase
    doJoin(name, code);
    playersPanelVisible = true;
  });

  if (joinBtn) joinBtn.addEventListener("click", () => doJoin());

  if (nameInputHost) {
    nameInputHost.addEventListener("keydown", e => { if (e.key === "Enter" && createBtn) createBtn.click(); });
  }
  if (nameInputJoin) {
    nameInputJoin.addEventListener("keydown", e => { if (e.key === "Enter" && joinBtn) joinBtn.click(); });
  }
  if (roomInput) {
    roomInput.addEventListener("input", () => { roomInput.value = roomInput.value.toUpperCase(); });
    roomInput.addEventListener("keydown", e => { if (e.key === "Enter" && joinBtn) joinBtn.click(); });
  }

  // Pre-fill from URL
  const urlRoom = new URLSearchParams(window.location.search).get("room");
  if (urlRoom) {
    if (roomInput) roomInput.value = urlRoom.toUpperCase();
    openModal("lobbyJoin");
    if (nameInputJoin) nameInputJoin.focus();
  }

  /* ================= CATEGORY SELECTION ================= */
  if (startGameBtn) {
    startGameBtn.addEventListener("click", () => {
      if (currentRoom && isHost) { socket.emit("startGame", { roomId: currentRoom }); playSound("click"); }
    });
  }

  document.addEventListener("click", e => {
    const card = e.target.closest(".category-card");
    if (card && isHost && currentRoom) {
      const category = card.dataset.category;
      if (!category) return;
      document.querySelectorAll(".category-card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      if (startGameBtn) startGameBtn.disabled = false;
      socket.emit("changeCategory", { roomId: currentRoom, category });
      playSound("click");
    }
    if (e.target && e.target.id === "playAgainBtn") {
      if (currentRoom && isHost) {
        socket.emit("resetRoom", currentRoom);
        showToast("Starting new round!"); doneAlreadyPlayed = false;
      }
    }
  });

  /* ================= HOST CONTROLS TOGGLE ================= */
  if (hostControlsToggle && hostControlsContent) {
    hostControlsToggle.addEventListener("click", () => {
      const isOpen = !hostControlsContent.classList.contains("collapsed");
      hostControlsContent.classList.toggle("collapsed", isOpen);
      if (hostToggleIcon) hostToggleIcon.textContent = isOpen ? "▾" : "▴";
    });
  }

  /* ================= CATEGORY PILLS ================= */
  if (categoryPillsWrap) {
    categoryPillsWrap.addEventListener("click", e => {
      const pill = e.target.closest(".pill");
      if (!pill || pill.disabled || !currentRoom) return;
      const category = pill.dataset.value || "";
      if (!category) return;
      clearPendingPills(); pill.classList.add("pending");
      socket.emit("changeCategory", { roomId: currentRoom, category });
      playSound("click");
    });
  }

  /* ================= QUESTION CONTROLS ================= */
  if (nextBtn) nextBtn.addEventListener("click", () => {
    if (!currentRoom) return;
    clearFloatingEmojis(); socket.emit("nextQuestion", { roomId: currentRoom }); playSound("click");
  });
  if (skipBtn) skipBtn.addEventListener("click", () => {
    if (!currentRoom) return;
    clearFloatingEmojis(); socket.emit("skipQuestion", { roomId: currentRoom }); playSound("click");
  });
  if (resetBtn) resetBtn.addEventListener("click", () => {
    if (!currentRoom) return;
    socket.emit("resetRoom", currentRoom); playSound("reset"); showToast("Room reset!"); doneAlreadyPlayed = false;
  });

  if (copyQuestionBtn) {
    copyQuestionBtn.addEventListener("click", async () => {
      const text = questionEl ? questionEl.textContent : "";
      if (!text.trim()) return;
      try { await navigator.clipboard.writeText(text); showToast("Question copied!"); }
      catch (_) { showToast("Couldn't copy — try manually"); }
    });
  }
  if (inlineShareBtn) {
    inlineShareBtn.addEventListener("click", async () => {
      if (!currentRoom) return;
      const link = `${window.location.origin}/?room=${currentRoom}`;
      try { await navigator.clipboard.writeText(link); showToast("Room link copied!"); }
      catch (_) { showToast("Couldn't copy — try manually"); }
    });
  }

  /* ================= REACTIONS ================= */
  if (reactionBar) {
    reactionBar.addEventListener("click", e => {
      const btn = e.target.closest(".reaction-btn");
      if (!btn || btn.disabled || !currentRoom) return;
      const emoji = btn.dataset.emoji || "";
      if (!emoji || !currentState || !currentState.currentQuestion) return;
      socket.emit("sendReaction", { roomId: currentRoom, emoji });
      btn.classList.add("active");
      setTimeout(() => btn.classList.remove("active"), 150);
    });
  }

  /* ================= VOTING ================= */
  if (voteList) {
    voteList.addEventListener("click", e => {
      const btn = e.target.closest(".vote-btn");
      if (!btn || btn.disabled || !currentRoom) return;
      const votedFor = btn.dataset.name;
      if (!votedFor) return;
      socket.emit("castVote", { roomId: currentRoom, votedFor }); playSound("click");
    });
  }

  /* ================= TIMER CONTROLS ================= */
  if (timerToggle) {
    timerToggle.addEventListener("change", () => {
      if (!currentRoom) return;
      socket.emit("setTimer", { roomId: currentRoom, enabled: timerToggle.checked, duration: getActiveTimerDuration() });
    });
  }
  if (timerOptions) {
    timerOptions.addEventListener("click", e => {
      const btn = e.target.closest(".timer-btn");
      if (!btn || !currentRoom) return;
      const seconds = Number(btn.dataset.seconds);
      if (seconds <= 0) return;
      if (timerCustomInput) timerCustomInput.value = "";
      setActiveTimerButton(seconds);
      socket.emit("setTimer", { roomId: currentRoom, enabled: !!(timerToggle && timerToggle.checked), duration: seconds });
    });
  }
  if (timerCustomInput) {
    const applyCustomTimer = () => {
      if (!currentRoom) return;
      const val = parseInt(timerCustomInput.value, 10);
      if (isNaN(val) || val < 10 || val > 600) { showToast("Custom timer must be 10–600 seconds"); timerCustomInput.value = ""; return; }
      setActiveTimerButton(-1);
      socket.emit("setTimer", { roomId: currentRoom, enabled: !!(timerToggle && timerToggle.checked), duration: val });
    };
    timerCustomInput.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); applyCustomTimer(); } });
    timerCustomInput.addEventListener("blur", () => { if (timerCustomInput.value) applyCustomTimer(); });
  }

  /* ================= LANGUAGE ================= */
  function applyLangChange(lang) {
    storage.set("icebreaker_lang", lang);
    [languageOptions, hostLanguageOpts].forEach(container => {
      if (!container) return;
      container.querySelectorAll(".lang-btn").forEach(b => b.classList.toggle("active", b.dataset.lang === lang));
    });
    if (currentRoom) socket.emit("changeLanguage", { roomId: currentRoom, language: lang });
    playSound("click");
  }
  if (languageOptions) {
    languageOptions.addEventListener("click", e => { const btn = e.target.closest(".lang-btn"); if (!btn || btn.disabled) return; applyLangChange(btn.dataset.lang); });
  }
  if (hostLanguageOpts) {
    hostLanguageOpts.addEventListener("click", e => { const btn = e.target.closest(".lang-btn"); if (!btn) return; applyLangChange(btn.dataset.lang); });
  }
  const savedLang = storage.get("icebreaker_lang");
  if (savedLang) {
    [languageOptions, hostLanguageOpts].forEach(container => {
      if (!container) return;
      container.querySelectorAll(".lang-btn").forEach(b => b.classList.toggle("active", b.dataset.lang === savedLang));
    });
  }

  /* ================= ROOM LOCK / LEAVE / PLAYERS TOGGLE ================= */
  if (lockRoomBtn) lockRoomBtn.addEventListener("click", () => {
    if (currentRoom && isHost) socket.emit("toggleRoomLock", { roomId: currentRoom });
  });

  if (leaveBtn) leaveBtn.addEventListener("click", () => {
    if (confirm("Leave the room?")) window.location.reload();
  });

  if (playersToggle && playerList) {
    playersToggle.addEventListener("click", () => {
      playersPanelVisible = !playersPanelVisible;
      playerList.classList.toggle("hidden", !playersPanelVisible);
      playersToggle.classList.toggle("active", playersPanelVisible);
    });
    document.addEventListener("click", e => {
      if (playersPanelVisible && !playerList.contains(e.target) && !playersToggle.contains(e.target)) {
        playersPanelVisible = false;
        playerList.classList.add("hidden");
        playersToggle.classList.remove("active");
      }
    });
  }

  /* ================= FLOATING EMOJIS ================= */
  function clearFloatingEmojis() {
    if (reactionStage) reactionStage.textContent = "";
  }

  function spawnFloatingEmoji(emoji, name) {
    if (!reactionStage) return;
    const el = document.createElement("div");
    el.className = "floating-emoji";
    el.textContent = emoji;
    const stageRect = reactionStage.getBoundingClientRect();
    el.style.left = `${10 + Math.random() * 80}%`;
    el.style.top  = `${10 + Math.random() * 70}%`;
    if (name) {
      const label = document.createElement("div");
      label.className = "emoji-label"; label.textContent = name;
      el.appendChild(label);
    }
    if (reactionStage.children.length >= 8) reactionStage.removeChild(reactionStage.firstElementChild);
    reactionStage.appendChild(el);
    el.addEventListener("animationend", () => { if (el.parentNode) el.parentNode.removeChild(el); });
  }

  /* ================= SOCKET EVENTS ================= */
  socket.on("roomState", state => {
    const isFirst = currentState === null;
    if (state && state.playersV2) {
      const host = Object.values(state.playersV2).find(p => p && p.isHost === true);
      currentHostId = host ? host.id : null;
      isHost = socket.id === currentHostId;
    } else {
      isHost = false;
    }
    updateUIFromState(state, isFirst);
  });

  socket.on("hostUpdated", ({ id } = {}) => {
    if (!id) return;
    currentHostId = id; isHost = socket.id === currentHostId;
    updateHostControls();
  });

  socket.on("hostChanged", ({ newHostName } = {}) => {
    if (newHostName) showToast(`👑 ${newHostName} is now host`);
  });

  socket.on("reaction", ({ emoji, name } = {}) => {
    if (!emoji) return;
    spawnFloatingEmoji(emoji, name); spawnConfetti(30);
  });

  socket.on("roomLocked", ({ reason } = {}) => {
    showToast(reason || "Room is locked");
  });

  socket.on("connect_error", () => showToast("Connection lost. Reconnecting..."));

  socket.on("connect", () => {
    if (cardEl) cardEl.classList.remove("disconnected");
    if (currentRoom) {
      socket.emit("joinRoom", { roomId: currentRoom, name: currentName });
      if (roomStatus) roomStatus.textContent = `Room: ${currentRoom}`;
      if (subtitleEl) subtitleEl.textContent  = `Room: ${currentRoom}`;
      enableGameUI(true);
    } else {
      if (roomStatus) roomStatus.textContent = "Not connected";
      if (playerList) playerList.classList.add("hidden");
      if (subtitleEl) subtitleEl.textContent = defaultSubtitle;
      enableGameUI(false);
    }
  });

  socket.on("disconnect", () => {
    enableGameUI(false);
    if (roomStatus) roomStatus.textContent = "Disconnected — reconnecting...";
    if (playerList)  playerList.classList.add("hidden");
    if (cardEl)      cardEl.classList.add("disconnected");
    if (subtitleEl)  subtitleEl.textContent = defaultSubtitle;
    if (nameInputHost) nameInputHost.disabled = false;
    if (nameInputJoin) nameInputJoin.disabled = false;
    if (roomInput)     roomInput.disabled     = false;
  });

  /* ================= PWA INSTALL ================= */
  let deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", e => {
    e.preventDefault(); deferredPrompt = e;
    if (installBtn) installBtn.classList.remove("hidden");
  });
  installBtn.addEventListener("click", async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") installBtn.classList.add("hidden");
    deferredPrompt = null;
  });
  window.addEventListener("appinstalled", () => {
    if (installBtn) installBtn.classList.add("hidden");
    showToast("App installed!");
  });

  /* ================= PARALLAX EFFECT ================= */
  let ticking = false;
  const landingContainer = document.querySelector('.landing-container');
  const heroEmoji = document.querySelector('.hero-emoji');
  const stepCards = document.querySelectorAll('.step-card');
  const showcasePills = document.querySelectorAll('.showcase-pill');
  
  function updateParallax() {
    const scrolled = window.pageYOffset;
    const windowHeight = window.innerHeight;
    
    // Parallax for hero emoji
    if (heroEmoji && scrolled < windowHeight) {
      const offset = scrolled * 0.3;
      heroEmoji.style.transform = `translateY(${offset}px) rotate(${offset * 0.1}deg)`;
    }
    
    // Parallax for step cards with stagger
    stepCards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      if (rect.top < windowHeight && rect.bottom > 0) {
        const progress = (windowHeight - rect.top) / windowHeight;
        const offset = progress * 20;
        const delay = index * 0.1;
        card.style.transform = `translateY(${-offset}px)`;
        card.style.opacity = Math.min(1, progress * 1.5);
        card.style.transitionDelay = `${delay}s`;
      }
    });
    
    // Add magnetic effect to showcase pills
    showcasePills.forEach(pill => {
      pill.addEventListener('mousemove', (e) => {
        const rect = pill.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        pill.style.setProperty('--mouse-x', `${x}px`);
        pill.style.setProperty('--mouse-y', `${y}px`);
      });
    });
    
    ticking = false;
  }
  
  function requestParallaxUpdate() {
    if (!ticking && landingContainer) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }
  
  // Mouse tracking for step cards
  stepCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--mouse-x', '50%');
      card.style.setProperty('--mouse-y', '50%');
    });
  });
  
  // Only add parallax on landing page and if not reduced motion
  if (landingContainer && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
    updateParallax(); // Initial call
  }
  
  /* ================= SMOOTH SCROLL REVEAL ================= */
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe elements for reveal animation
  document.querySelectorAll('.step-card, .showcase-pill').forEach(el => {
    observer.observe(el);
  });
});