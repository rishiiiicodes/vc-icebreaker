// public/script.js

document.addEventListener("DOMContentLoaded", () => {

  document.body.classList.add("is-ready");

  /* ================= RANKING SYSTEM ================= */
  let previousScores = {};

  function animateVoteReceived(playerName) {
    const playerChips = document.querySelectorAll('.player-chip');
    playerChips.forEach(chip => {
      const nameSpan = chip.querySelector('.player-name');
      if (nameSpan && nameSpan.textContent === playerName) {
        // Remove existing animations
        const existingAnim = chip.querySelector('.vote-animation');
        if (existingAnim) existingAnim.remove();
        
        // Create new vote animation
        const animation = document.createElement('div');
        animation.className = 'vote-animation';
        animation.textContent = '+1 ⭐';
        chip.style.position = 'relative';
        chip.appendChild(animation);
        
        // Remove animation after completion
        setTimeout(() => animation.remove(), 1500);
      }
    });
  }

  function createPodiumUI(state) {
    const categoryScores = state.categoryScores || {};
    const currentScores = state.scores || {};
    const playersV2 = state.playersV2 || {};
    
    // Calculate total scores for ALL players from categoryScores
    const totalScores = {};
    Object.values(categoryScores).forEach(categoryScore => {
      Object.entries(categoryScore).forEach(([name, score]) => {
        totalScores[name] = (totalScores[name] || 0) + score;
      });
    });
    
    // Include ALL players from playersV2, even those with 0 scores
    const allPlayers = Object.values(playersV2).map(player => ({
      name: player.name,
      totalScore: totalScores[player.name] || 0,
      currentScore: currentScores[player.name] || 0,
      isHost: player.isHost || false
    }));
    
    // Sort by total score descending, keep original order for ties
    allPlayers.sort((a, b) => {
      if (b.totalScore !== a.totalScore) {
        return b.totalScore - a.totalScore;
      }
      // Keep original order for ties by comparing their position in playersV2
      const aIndex = Object.values(playersV2).findIndex(p => p.name === a.name);
      const bIndex = Object.values(playersV2).findIndex(p => p.name === b.name);
      return aIndex - bIndex;
    });

    if (allPlayers.length === 0) return '';

    let leaderboardHTML = `
      <div class="leaderboard-header">
        Final Standings — ${allPlayers.length} players
      </div>
      <div class="leaderboard-table">
    `;
    
    allPlayers.forEach((player, index) => {
      const rank = index + 1;
      const scoreDisplay = player.totalScore > 0 ? `${player.totalScore} ` : '—';
      const rankIcon = rank === 1 ? '' : rank === 2 ? '' : rank === 3 ? '' : `${rank}.`;
      const rankClass = rank === 1 ? 'first' : rank === 2 ? 'second' : rank === 3 ? 'third' : 'other';
      const avatarLetter = player.name.charAt(0).toUpperCase();
      const hostIcon = player.isHost ? ' <span class="host-icon"></span>' : '';
      
      leaderboardHTML += `
        <div class="leaderboard-row ${rankClass}" style="animation-delay: ${index * 0.1}s">
          <div class="leaderboard-rank">${rankIcon}</div>
          <div class="leaderboard-avatar" style="background-color: ${getAvatarColor(rank)}">
            ${avatarLetter}
          </div>
          <div class="leaderboard-name">
            ${player.name}${hostIcon}
          </div>
          <div class="leaderboard-score">${scoreDisplay}</div>
        </div>
      `;
    });
    
    leaderboardHTML += `
      </div>
      <div class="leaderboard-actions">
        ${isHost ? '<button class="btn primary" id="playAgainBtn"> Play Again</button>' : ''}
      </div>
    `;

    return leaderboardHTML;
  }

  function getAvatarColor(rank) {
    const colors = {
      1: '#FFD700', // Gold
      2: '#C0C0C0', // Silver  
      3: '#CD7F32', // Bronze
      default: '#64748b' // Default gray
    };
    return colors[rank] || colors.default;
  }

  function updateMiniLeaderboard(state) {
    const categoryScores = state.categoryScores || {};
    const playersV2 = state.playersV2 || {};
    
    // Calculate total scores for all players
    const totalScores = {};
    Object.values(categoryScores).forEach(categoryScore => {
      Object.entries(categoryScore).forEach(([name, score]) => {
        totalScores[name] = (totalScores[name] || 0) + score;
      });
    });
    
    // Get all players with scores
    const allPlayers = Object.values(playersV2).map(player => ({
      name: player.name,
      totalScore: totalScores[player.name] || 0
    }));
    
    // Sort by score and get top 3
    const topPlayers = allPlayers
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 3)
      .filter(p => p.totalScore > 0); // Only show players with votes
    
    // Find or create mini leaderboard element
    let miniLeaderboard = document.getElementById('miniLeaderboard');
    if (!miniLeaderboard) {
      miniLeaderboard = document.createElement('div');
      miniLeaderboard.id = 'miniLeaderboard';
      miniLeaderboard.className = 'mini-leaderboard hidden';
      
      // Insert after question area
      const questionArea = document.getElementById('questionArea');
      if (questionArea) {
        questionArea.parentNode.insertBefore(miniLeaderboard, questionArea.nextSibling);
      }
    }
    
    if (topPlayers.length > 0) {
      const medals = ['', '', ''];
      miniLeaderboard.innerHTML = topPlayers.map((player, index) => 
        `${medals[index]} ${player.name} (${player.totalScore})`
      ).join('   ');
      miniLeaderboard.classList.remove('hidden');
    } else {
      miniLeaderboard.classList.add('hidden');
    }
  }

  function updateLiveScoreTicker(state) {
    if (!voteList) return;
    
    // Don't overwrite if voting is active (buttons are present)
    const existingVoteBtns = voteList.querySelectorAll('.vote-btn');
    if (existingVoteBtns.length > 0) return;
    
    const scores = state.scores || {};
    const players = Object.values(state.players || {});
    
    voteList.innerHTML = '';
    
    players.forEach(player => {
      const voteCount = scores[player.name] || 0;
      const voteItem = document.createElement('div');
      voteItem.className = 'vote-item';
      
      const nameLabel = document.createElement('span');
      nameLabel.textContent = player.name;
      
      const scoreBadge = document.createElement('span');
      scoreBadge.className = `vote-score-badge ${voteCount > 0 ? 'has-votes' : ''}`;
      scoreBadge.textContent = ` ${voteCount}`;
      
      voteItem.appendChild(nameLabel);
      voteItem.appendChild(scoreBadge);
      voteList.appendChild(voteItem);
    });
  }

  function updateRankBadges(state) {
    const categoryScores = state.categoryScores || {};
    const totalScores = {};
    
    // Calculate total scores
    Object.values(categoryScores).forEach(categoryScore => {
      Object.entries(categoryScore).forEach(([name, score]) => {
        totalScores[name] = (totalScores[name] || 0) + score;
      });
    });

    // Update existing rank badges
    const playerChips = document.querySelectorAll('.player-chip');
    playerChips.forEach(chip => {
      const nameSpan = chip.querySelector('.player-name');
      if (!nameSpan) return;
      
      const playerName = nameSpan.textContent;
      const playerScore = totalScores[playerName] || 0;
      
      // Remove existing rank badges
      const existingBadges = chip.querySelectorAll('.rank-badge');
      existingBadges.forEach(badge => badge.remove());
      
      // Add rank badge if player has score and is in top 3
      if (playerScore > 0) {
        const sortedPlayers = Object.entries(totalScores)
          .sort(([, a], [, b]) => b - a)
          .map(([name]) => name);
        
        const rankIndex = sortedPlayers.indexOf(playerName);
        if (rankIndex < 3) {
          const rankBadge = document.createElement('span');
          rankBadge.className = 'rank-badge';
          if (rankIndex === 0) {
            rankBadge.textContent = '👑';
            rankBadge.classList.add('gold');
          } else if (rankIndex === 1) {
            rankBadge.textContent = '🥈';
            rankBadge.classList.add('silver');
          } else if (rankIndex === 2) {
            rankBadge.textContent = '🥉';
            rankBadge.classList.add('bronze');
          }
          chip.appendChild(rankBadge);
        }
      }
    });
  }

  function checkVoteChanges(state) {
    const currentScores = state.scores || {};
    
    // Check for new votes and trigger animations
    Object.entries(currentScores).forEach(([playerName, newScore]) => {
      const oldScore = previousScores[playerName] || 0;
      if (newScore > oldScore) {
        animateVoteReceived(playerName);
      }
    });
    
    previousScores = { ...currentScores };
  }

  /* ================= UTILS ================= */
  const storage = {
    set: (key, val) => {
      try { localStorage.setItem(key, val); } catch (e) { /* ignore */ }
    },
    get: (key) => {
      try { return localStorage.getItem(key); } catch (e) { return null; }
    }
  };

  /* ================= SOCKET.IO ================= */
  const socket = io();

  let currentRoom = null;
  let currentState = null;
  let currentName = "";
  let selectedMood = null;
  let currentHostId = null;
  let isHost = false;

  /* ================= ELEMENTS ================= */
  const roomInput = document.getElementById("roomInput");
  const nameInput = document.getElementById("nameInput");
  const joinBtn = document.getElementById("joinBtn");
  const generateBtn = document.getElementById("generateBtn");
  const shareBtn = document.getElementById("shareBtn");
  const inlineShareBtn = document.getElementById("inlineShareBtn");
  const roomStatus = document.getElementById("roomStatus");
  const participantBadge = document.getElementById("participantBadge");
  const participantCount = document.getElementById("participantCount");
  const playerList = document.getElementById("playerList");
  const categoryPillsWrap = document.querySelector(".category-pills");
  const categorySelect = document.getElementById("category");
  const questionEl = document.getElementById("question");
  const questionCard = document.getElementById("questionCard");
  const turnBadge = document.getElementById("turnBadge");
  const copyQuestionBtn = document.getElementById("copyQuestionBtn");
  const reactionBar = document.getElementById("reactionBar");
  const reactionStage = document.getElementById("reactionStage");
  const votingPanel = document.getElementById("votingPanel");
  const voteList = document.getElementById("voteList");
  const leaderboard = document.getElementById("leaderboard");
  const leaderboardList = document.getElementById("leaderboardList");
  const timerToggle = document.getElementById("timerToggle");
  const timerOptions = document.getElementById("timerOptions");
  const timerRing = document.getElementById("timerRing");
  const timerRingFill = document.getElementById("timerRingFill");
  const timerCount = document.getElementById("timerCount");
  const timerCustomInput = document.getElementById("timerCustomInput");
  const languageOptions = document.getElementById("languageOptions");
  const themeSelector = document.getElementById("themeSelector");
  const languageControls = document.getElementById("languageControls");
  const playersToggle = document.getElementById("playersToggle");
  const doneOverlay = document.getElementById("doneOverlay");
  const progressFill = document.getElementById("progressFill");
  const progressBar = document.querySelector(".progress");
  const progressLabel = document.getElementById("progressLabel");
  const nextBtn = document.getElementById("nextBtn");
  const skipBtn = document.getElementById("skipBtn");
  const resetBtn = document.getElementById("resetBtn");
  const leaveBtn = document.getElementById("leaveBtn");
  const categoryScoreboard = document.getElementById("categoryScoreboard");
  const categoryScoreList = document.getElementById("categoryScoreList");
  const toastEl = document.getElementById("toast");
  const cardEl = document.querySelector(".card");
  const subtitleEl = document.querySelector(".subtitle");
  const defaultSubtitle = subtitleEl ? subtitleEl.textContent : "";

  // Host Controls Elements
  const hostControlsPanel = document.getElementById("hostControlsPanel");
  const hostControlsToggle = document.getElementById("hostControlsToggle");
  const hostControlsContent = document.getElementById("hostControlsContent");
  const hostToggleIcon = document.getElementById("hostToggleIcon");
  const lockRoomBtn = document.getElementById("lockRoomBtn");

  // Player View Elements
  const categoryBadge = document.getElementById("categoryBadge");
  const categoryEmoji = document.getElementById("categoryEmoji");
  const categoryName = document.getElementById("categoryName");
  const categoryProgress = document.getElementById("categoryProgress");
  const waitingMessage = document.getElementById("waitingMessage");

  // Lobby Sub-screens
  const lobbyHome = document.getElementById("lobbyHome");
  const lobbyHost = document.getElementById("lobbyHost");
  const lobbyJoin = document.getElementById("lobbyJoin");
  const goHostBtn = document.getElementById("goHostBtn");
  const goJoinBtn = document.getElementById("goJoinBtn");
  const backToHomeHost = document.getElementById("backToHomeHost");
  const backToHomeJoin = document.getElementById("backToHomeJoin");
  const createBtn = document.getElementById("createBtn");
  const nameInputHost = document.getElementById("nameInputHost");
  const nameInputJoin = document.getElementById("nameInputJoin");
  const moodSelectHost = document.getElementById("moodSelectHost");
  const moodSelectJoin = document.getElementById("moodSelectJoin");

  /* ================= PARTICLE COLORS ================= */
  const particlePalette = {
    chill: "#18d5c4",
    funny: "#f6b25b",
    spicy: "#f45348",
    deep: "#7ce7ff",
    chaos: "#ff73b4",
    work: "#4ade80",
    nostalgia: "#fb923c",
    creative: "#e879f9",
    all: "#ffffff",
    movies: "#a78bfa",
    sports: "#34d399",
    travel: "#38bdf8",
    food: "#f97316",
    music: "#f472b6",
    gaming: "#818cf8",
    romance: "#ff4d6d",
    journey: "#fbbf24",
    mystery: "#6366f1",
    tech: "#0ea5e9",
    party: "#fcd34d",
    soulful: "#ec4899",
    dares: "#f97316"
  };

  const categoryRgbPalette = {
    chill: "24, 213, 196",
    funny: "246, 178, 91",
    spicy: "244, 83, 72",
    deep: "124, 231, 255",
    chaos: "255, 115, 180",
    work: "74, 222, 128",
    nostalgia: "251, 146, 60",
    creative: "232, 121, 249",
    all: "255, 255, 255",
    movies: "167, 139, 250",
    sports: "52, 211, 153",
    travel: "56, 189, 248",
    food: "249, 115, 22",
    music: "244, 114, 182",
    gaming: "129, 140, 248",
    romance: "255, 77, 109",
    journey: "251, 191, 36",
    mystery: "99, 102, 241",
    tech: "14, 165, 233",
    party: "252, 211, 77",
    dares: "249, 115, 22",
    soulful: "236, 72, 153"
  };

  let particleLayer = null;
  let doneAlreadyPlayed = false;
  let lastQuestion = null;
  let lastTimerDuration = 60;
  let timerInterval = null;
  let timerSecondsLeft = 0;
  let isMyTurn = false;

  // Lightweight mode to keep interactions snappy on all devices
  const ENABLE_PARALLAX = false;
  const ENABLE_WEBGL_BG = false;
  const ENABLE_PARTICLES = false;
  let playersPanelVisible = false;

  function setActiveTimerButton(seconds) {
    if (!timerOptions) return;
    const buttons = timerOptions.querySelectorAll(".timer-btn");
    buttons.forEach(btn => {
      const active = Number(btn.dataset.seconds) === Number(seconds);
      btn.classList.toggle("active", active);
    });
  }

  function getActiveTimerDuration() {
    if (!timerOptions) return 60;
    // If the custom input has a valid value, prefer it
    if (timerCustomInput) {
      const customVal = parseInt(timerCustomInput.value, 10);
      if (!isNaN(customVal) && customVal >= 10 && customVal <= 600) return customVal;
    }
    const active = timerOptions.querySelector(".timer-btn.active");
    const seconds = active ? Number(active.dataset.seconds) : 60;
    return seconds > 0 ? seconds : 60;
  }

  function updateTimerRing(total, left) {
    if (!timerRingFill || !timerCount) return;
    const circumference = 163.4;
    const ratio = total > 0 ? (left / total) : 0;
    timerRingFill.style.strokeDasharray = `${circumference}`;
    timerRingFill.style.strokeDashoffset = `${circumference * (1 - ratio)}`;
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
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    if (timerRing) timerRing.classList.add("hidden");
  }

  function spawnConfetti(count = 120) {
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.inset = "0";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "998";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      canvas.remove();
      return;
    }

    const colors = ["#18d5c4", "#f6b25b", "#f45348", "#ff73b4", "#ffffff", "#FFD700"];
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
    let rafId = null;

    function frame(t) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.vy += 0.15;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rotSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }

      if (t - start < 3500) {
        rafId = requestAnimationFrame(frame);
      } else {
        cancelAnimationFrame(rafId);
        canvas.remove();
      }
    }

    requestAnimationFrame(frame);
  }

  function setParticleColor(category) {
    if (!particleLayer) return;
    particleLayer.setMode(particlePalette[category] || particlePalette.chill);
  }

  /* ================= SOUNDS ================= */
  const sounds = {};
  let soundReady = false;

  function loadSounds() {
    if (soundReady) return;
    ["click", "complete", "reset"].forEach(key => {
      const audio = new Audio(`${key}.mp3`);
      audio.preload = "auto";
      audio.volume = 0.5;
      sounds[key] = audio;
    });
    soundReady = true;
  }

  function playSound(name) {
    if (!sounds[name]) return;
    sounds[name].currentTime = 0;
    sounds[name].play().catch(() => { });
  }

  document.addEventListener("click", loadSounds, { once: true });

  /* ================= TOAST ================= */
  let toastTimer;
  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("visible"), 2500);
  }

  /* ================= ROOM CODE GENERATOR ================= */
  const ADJS = ["CHILL", "EPIC", "WILD", "COOL", "BOLD", "FAST", "KEEN", "ZANY", "MINT", "NEON"];
  const NOUNS = ["TEAM", "CREW", "PACK", "GANG", "CLUB", "BAND", "UNIT", "HIVE", "TRIO", "QUAD"];

  function generateRoomCode() {
    const adj = ADJS[Math.floor(Math.random() * ADJS.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const num = Math.floor(Math.random() * 99) + 1;
    return `${adj}${noun}${num}`;
  }

  // Older UI had a standalone "Generate" button; the current markup may not.
  // Guard this listener so missing elements don't break the rest of the script.
  if (generateBtn && roomInput) {
    generateBtn.addEventListener("click", () => {
      roomInput.value = generateRoomCode();
      if (nameInput) {
        nameInput.focus();
        if (!nameInput.value.trim()) showToast("Enter your name, then Join.");
      }
      playSound("click");
    });
  }

  /* ================= SHARE ================= */
  function buildShareUrl(roomId) {
    const url = new URL(window.location.href);
    url.searchParams.set("room", roomId);
    return url.toString();
  }

  shareBtn.addEventListener("click", async () => {
    if (!currentRoom) return;
    const url = buildShareUrl(currentRoom);
    if (navigator.share) {
      try {
        await navigator.share({ title: "VC Icebreaker", text: `Join room ${currentRoom}`, url });
        return;
      } catch (_) { }
    }
    try {
      await navigator.clipboard.writeText(url);
      showToast("Link copied!");
      playSound("click");
    } catch (_) {
      showToast("Link: " + url);
    }
  });

  // Pre-fill room code from URL
  const urlRoom = new URLSearchParams(window.location.search).get("room");
  if (urlRoom) {
    const upper = urlRoom.toUpperCase();
    roomInput.value = upper;
    roomStatus.textContent = "You've been invited \u2014 enter your name to join";
    // Jump straight into Join flow when opened via link
    showLobbySubScreen("lobbyJoin");
    if (themeSelector) themeSelector.classList.remove("hidden");
    if (languageControls) languageControls.classList.remove("hidden");
    if (nameInputJoin) nameInputJoin.focus();
  }

  /* ================= UI HELPERS ================= */
  function getPills() {
    return categoryPillsWrap ? [...categoryPillsWrap.querySelectorAll(".pill")] : [];
  }

  function updateHostControls(state = currentState) {
    if (!currentRoom) return;
    const canHost = !!isHost;

    // Settings only for host (category can be changed by any player)
    if (resetBtn) resetBtn.disabled = !canHost;
    if (timerToggle) timerToggle.disabled = !canHost;
    if (timerOptions) {
      const buttons = timerOptions.querySelectorAll(".timer-btn");
      buttons.forEach(btn => { btn.disabled = !canHost; });
    }
    if (timerCustomInput) timerCustomInput.disabled = !canHost;

    // Progression: Host OR whose turn it is
    isMyTurn = false;
    if (state && state.players) {
      const names = Object.values(state.players);
      if (names.length > 0) {
        const idxRaw = typeof state.currentTurn === "number" ? state.currentTurn : 0;
        const idx = ((idxRaw % names.length) + names.length) % names.length;
        isMyTurn = names[idx] === currentName;
      }
    }
    const canProgress = (canHost || isMyTurn) && !!currentRoom;
    if (nextBtn) nextBtn.disabled = !canProgress;
    if (skipBtn) skipBtn.disabled = !canProgress;

    // Show/hide host controls panel based on host status
    if (hostControlsPanel) {
      if (isHost) {
        hostControlsPanel.classList.remove("hidden");
        hostControlsPanel.classList.add("expanded"); // Start expanded for host
        if (hostToggleIcon) hostToggleIcon.textContent = "▴";
      } else {
        hostControlsPanel.classList.add("hidden");
        hostControlsPanel.classList.remove("expanded");
      }
    }

    // Show/hide player view elements based on host status
    if (categoryBadge) {
      if (isHost) {
        categoryBadge.classList.add("hidden");
      } else {
        categoryBadge.classList.remove("hidden");
      }
    }

    if (waitingMessage) {
      if (isHost) {
        waitingMessage.classList.add("hidden");
      } else {
        waitingMessage.classList.remove("hidden");
      }
    }

    // Hide regular controls for non-hosts
    const regularControls = document.querySelector(".controls");
    if (regularControls) {
      regularControls.classList.toggle("hidden", !isHost);
    }
  }

  function updateCategoryBadge(state) {
    if (!categoryBadge || !categoryEmoji || !categoryName || !categoryProgress) return;
    
    const category = state.category || "all";
    const total = state.total || 0;
    const used = state.used || 0;
    
    // Get category emoji and name
    const categoryInfo = {
      all: { emoji: "🎲", name: "All" },
      chill: { emoji: "🌙", name: "Chill" },
      romance: { emoji: "💕", name: "Romance" },
      funny: { emoji: "😂", name: "Funny" },
      spicy: { emoji: "🔥", name: "Spicy" },
      deep: { emoji: "🧠", name: "Deep" },
      chaos: { emoji: "😈", name: "Chaos" },
      work: { emoji: "💼", name: "Work" },
      nostalgia: { emoji: "📼", name: "Nostalgia" },
      creative: { emoji: "🎨", name: "Creative" },
      movies: { emoji: "🎬", name: "Movies" },
      sports: { emoji: "⚽", name: "Sports" },
      travel: { emoji: "✈️", name: "Travel" },
      food: { emoji: "🍕", name: "Food" },
      music: { emoji: "🎵", name: "Music" },
      gaming: { emoji: "🎮", name: "Gaming" },
      romance: { emoji: "💕", name: "Romance" },
      journey: { emoji: "🛤️", name: "Life Journey" },
      mystery: { emoji: "🔮", name: "Mystery" },
      tech: { emoji: "💻", name: "Tech" },
      party: { emoji: "🎉", name: "Party Mix" },
      soulful: { emoji: "😭", name: "Soulful" },
      dares: { emoji: "🎯", name: "Dares" }
    };

    const info = categoryInfo[category] || categoryInfo.all;
    
    categoryEmoji.textContent = info.emoji;
    categoryName.textContent = info.name;
    categoryProgress.textContent = `${used} / ${total} questions`;
    
    // Apply category color
    const rgb = categoryRgbPalette[category] || "255, 255, 255";
    categoryBadge.style.setProperty("--cat-color-rgb", rgb);
  }

  function updateWaitingMessage(state) {
    if (!waitingMessage || !turnBadge) return;
    
    const hasQuestion = state.currentQuestion && state.currentQuestion.trim() !== "";
    const isMyTurn = state.currentTurnPlayer === currentName;
    
    if (!isHost && !hasQuestion && !isMyTurn) {
      waitingMessage.classList.remove("hidden");
      turnBadge.classList.add("hidden");
    } else {
      waitingMessage.classList.add("hidden");
    }
  }

  function updateTurnBadgeWithHost(state) {
    if (!turnBadge) return;
    
    const currentTurnPlayer = state.currentTurnPlayer;
    if (!currentTurnPlayer) {
      turnBadge.classList.add("hidden");
      return;
    }

    // Check if current turn player is host
    const players = state.playersV2 || {};
    const currentPlayer = Object.values(players).find(p => p.name === currentTurnPlayer);
    const isHostTurn = currentPlayer && currentPlayer.isHost;

    turnBadge.textContent = isHostTurn ? `👑 Host's turn 🎤` : `${currentTurnPlayer}'s turn 🎤`;
    turnBadge.classList.remove("hidden");
  }

  function enableGameUI(on) {
    const lobby = document.getElementById("lobbyScreen");
    const game = document.getElementById("gameScreen");
    if (lobby) lobby.classList.toggle("hidden", on);
    if (game) game.classList.toggle("hidden", !on);
    if (leaveBtn) leaveBtn.classList.toggle("hidden", !on);
    if (playersToggle) playersToggle.classList.toggle("hidden", !on);
    if (inlineShareBtn) inlineShareBtn.classList.toggle("hidden", !on);

    // Reset lobby sub-screens when going back to lobby
    if (!on) showLobbySubScreen("lobbyHome");

    getPills().forEach(p => p.disabled = !on);
    nextBtn.disabled = !on;
    if (skipBtn) skipBtn.disabled = !on;
    resetBtn.disabled = !on;
    updateHostControls();
  }

  function showLobbySubScreen(id) {
    if (!lobbyHome || !lobbyHost || !lobbyJoin) return;
    lobbyHome.classList.add("hidden");
    lobbyHost.classList.add("hidden");
    lobbyJoin.classList.add("hidden");
    const el = document.getElementById(id);
    if (el) el.classList.remove("hidden");
  }

  function setActivePill(category) {
    getPills().forEach(p => {
      const active = p.dataset.value === category;
      p.classList.toggle("active", active);
      p.setAttribute("aria-checked", active ? "true" : "false");
    });
    if (categorySelect) categorySelect.value = category;
  }

  function clearPendingPills() {
    getPills().forEach(p => p.classList.remove("pending"));
  }

  function updateCategoryGlow(category) {
    document.body.classList.remove(...Object.keys(particlePalette));
    document.body.classList.add(category);
    setParticleColor(category);

    const rgb = categoryRgbPalette[category] || "255, 255, 255";
    if (questionCard) {
      questionCard.style.setProperty("--cat-color-rgb", rgb);
    }
  }

  function updateProgress(used, total) {
    const pct = total > 0 ? (used / total) * 100 : 0;
    progressFill.style.width = pct + "%";
    progressBar.setAttribute("aria-valuenow", Math.round(pct));
    progressLabel.textContent = `${used} / ${total}`;
  }

  let questionAnimId;
  function animateQuestion(text) {
    clearTimeout(questionAnimId);
    questionCard.classList.remove("is-animating");
    void questionCard.offsetWidth; // force reflow
    questionCard.classList.add("is-animating");
    questionEl.style.opacity = "0";
    questionEl.style.transform = "translateY(12px)";
    questionAnimId = setTimeout(() => {
      questionEl.textContent = text || "Click Next Question to begin.";
      questionEl.style.opacity = "1";
      questionEl.style.transform = "translateY(0)";
    }, 200);
  }

  function updateUIFromState(state, isFirstState = false) {
    currentState = state;
    clearPendingPills();

    const used = state.usedIndexes?.length || 0;
    const total = state.total || 0;
    const isDone = used >= total && total > 0 && state.currentQuestion === null;
    const hasQuestion = !!state.currentQuestion;

    const questionChanged = state.currentQuestion !== lastQuestion;
    if (hasQuestion && questionChanged) {
      clearFloatingEmojis();
    }

    setActivePill(state.category);
    updateCategoryGlow(state.category);
    updateProgress(used, total);

    // Update host controls and player view
    updateHostControls(state);
    updateCategoryBadge(state);
    updateWaitingMessage(state);
    updateTurnBadgeWithHost(state);

    // Update Group Mood indicator
    const groupMoodEl = document.getElementById("groupMood");
    if (groupMoodEl) {
      if (state.dominantMood) {
        const moodEmojis = {
          chill: "😌",
          hype: "⚡", 
          chaotic: "🔥",
          deep: "🌊"
        };
        
        const moodTexts = {
          chill: "Chill",
          hype: "Hype",
          chaotic: "Chaotic", 
          deep: "Deep"
        };
        
        groupMoodEl.querySelector(".group-mood-emoji").textContent = moodEmojis[state.dominantMood] || "😌";
        groupMoodEl.querySelector(".group-mood-text").textContent = moodTexts[state.dominantMood] || "Chill";
        groupMoodEl.classList.remove("hidden");
      } else {
        groupMoodEl.classList.add("hidden");
      }
    }

    if (typeof state.participants === "number") {
      participantCount.textContent = state.participants;
      participantBadge.classList.remove("hidden");
    }

    if (currentRoom && roomStatus && typeof state.isLocked === "boolean") {
      const base = `Room: ${currentRoom}`;
      const label = state.isLocked ? `${base} (Locked)` : base;
      roomStatus.textContent = label;
      if (subtitleEl) subtitleEl.textContent = label;
    }

    if (playerList) {
      const players = Object.values(state.playersV2 || {});
      if (players.length > 0) {
        playerList.innerHTML = "";

        // Calculate total scores for ranking
        const categoryScores = state.categoryScores || {};
        const totalScores = {};
        Object.values(categoryScores).forEach(categoryScore => {
          Object.entries(categoryScore).forEach(([name, score]) => {
            totalScores[name] = (totalScores[name] || 0) + score;
          });
        });

        // Sort players by total score for ranking
        const sortedPlayers = [...players].sort((a, b) => {
          const scoreA = totalScores[a.name] || 0;
          const scoreB = totalScores[b.name] || 0;
          return scoreB - scoreA;
        });

        sortedPlayers.forEach((p, rankIndex) => {
          const chip = document.createElement("div");
          chip.className = `player-chip ${p.isHost ? "is-host" : ""}`;
          chip.dataset.playerName = p.name;

          if (p.isHost) {
            const crown = document.createElement("span");
            crown.className = "host-crown";
            crown.title = "Room Host";
            crown.textContent = "\u{1F451}";
            chip.appendChild(crown);
            chip.appendChild(document.createTextNode(" "));
          }

          // Add rank badge for top 3 players with scores
          const playerScore = totalScores[p.name] || 0;
          if (playerScore > 0 && rankIndex < 3) {
            const rankBadge = document.createElement("span");
            rankBadge.className = "rank-badge";
            if (rankIndex === 0) rankBadge.textContent = "👑";
            else if (rankIndex === 1) rankBadge.textContent = "🥈";
            else if (rankIndex === 2) rankBadge.textContent = "🥉";
            chip.appendChild(rankBadge);
            chip.appendChild(document.createTextNode(" "));
          }

          const nameSpan = document.createElement("span");
          nameSpan.textContent = p.name;
          nameSpan.className = "player-name";
          chip.appendChild(nameSpan);

          if (!p.isHost && isHost) {
            // Only show transfer button to the current host
            const tBtn = document.createElement("button");
            tBtn.className = "transfer-btn";
            tBtn.title = "Transfer Host Ownership";
            tBtn.textContent = "Handover";
            tBtn.addEventListener("click", () => {
              if (confirm(`Transfer room ownership to ${p.name}?`)) {
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

    if (turnBadge) {
      const names = Object.values(state.players || {});
      if (names.length > 0 && hasQuestion) {
        const idxRaw = typeof state.currentTurn === "number" ? state.currentTurn : 0;
        const idx = ((idxRaw % names.length) + names.length) % names.length;
        const turnName = names[idx];
        
        // Create turn badge with score ticker
        turnBadge.innerHTML = `${turnName}'s turn`;
        
        // Add score ticker for current question votes
        const scores = state.scores || {};
        const voteCounts = names.map(name => ({
          name,
          votes: scores[name] || 0
        })).filter(p => p.votes > 0);
        
        if (voteCounts.length > 0) {
          const ticker = document.createElement("div");
          ticker.className = "score-ticker";
          ticker.style.fontSize = "11px";
          ticker.style.color = "var(--text-muted)";
          ticker.style.marginTop = "2px";
          ticker.style.fontWeight = "500";
          
          const tickerText = voteCounts
            .map(p => `${p.name}: ${p.votes}`)
            .join(" • ");
          ticker.textContent = tickerText;
          
          turnBadge.appendChild(ticker);
        }
        
        turnBadge.classList.remove("hidden");
      } else {
        turnBadge.classList.add("hidden");
      }
    }

    if (votingPanel && voteList) {
      const names = Object.values(state.players || {});
      const canVote = hasQuestion && names.length > 1 && !isDone;
      if (canVote) {
        const votedAlready = !!(state.votedThisRound && state.votedThisRound[socket.id]);
        voteList.innerHTML = "";
        names.forEach(name => {
          if (name === currentName) return;
          const btn = document.createElement("button");
          btn.className = "vote-btn";
          btn.type = "button";
          btn.dataset.name = name;
          btn.textContent = `\u{1F451} ${name}`;
          if (votedAlready) {
            btn.disabled = true;
            btn.textContent = "\u2713 Voted";
          }
          voteList.appendChild(btn);
        });
        votingPanel.classList.remove("hidden");
      } else {
        votingPanel.classList.add("hidden");
      }
    }

    if (reactionBar) {
      if (hasQuestion && !isDone) {
        reactionBar.classList.remove("hidden");
      } else {
        reactionBar.classList.add("hidden");
      }
    }

    if (timerToggle) {
      timerToggle.checked = !!state.timerEnabled;
    }
    if (timerOptions) {
      const shouldShow = !!state.timerEnabled;
      timerOptions.classList.toggle("hidden", !shouldShow);
      setActiveTimerButton(state.timerDuration || 60);
    }

    if (!state.timerEnabled || isDone || !hasQuestion) {
      stopTimer();
    } else {
      const durationChanged = state.timerDuration !== lastTimerDuration;
      if (questionChanged || durationChanged) {
        startTimer(state.timerDuration || 60);
      }
    }
    lastTimerDuration = state.timerDuration || 60;

    // Sync language button active state
    if (languageOptions) {
      const currentLang = state.language || "en";
      languageOptions.querySelectorAll(".lang-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.lang === currentLang);
        btn.disabled = !isHost;
      });
    }

    if (isDone) {
      doneOverlay.classList.remove("hidden");
      questionCard.style.opacity = "0.15";
      if (!doneAlreadyPlayed) {
        playSound("complete");
        spawnConfetti(120);
        doneAlreadyPlayed = true;
      }
    } else {
      doneOverlay.classList.add("hidden");
      questionCard.style.opacity = "1";
    }

    if (leaderboard && leaderboardList) {
      if (isDone) {
        // Use new podium UI system
        leaderboardList.innerHTML = createPodiumUI(state);
        
        // Add confetti burst for podium
        if (!doneAlreadyPlayed) {
          spawnConfetti(150);
        }
        
        leaderboard.classList.remove("hidden");
      } else {
        leaderboard.classList.add("hidden");
      }
    }

    // Add ranking system calls
    checkVoteChanges(state);
    updateRankBadges(state);
    updateMiniLeaderboard(state);

    if (categoryScoreboard && categoryScoreList) {
      const scores = state.categoryScores ? state.categoryScores[state.category || "all"] : null;
      if (scores) {
        const sorted = Object.entries(scores)
          .map(([name, val]) => ({ name, val }))
          .filter(e => e.val > 0)
          .sort((a, b) => b.val - a.val);

        if (sorted.length > 0) {
          categoryScoreList.innerHTML = "";
          sorted.forEach(entry => {
            const item = document.createElement("div");
            item.className = "scoreboard-item";
            item.appendChild(document.createTextNode(entry.name + " "));
            const scoreSpan = document.createElement("span");
            scoreSpan.className = "score";
            scoreSpan.textContent = entry.val;
            item.appendChild(scoreSpan);
            categoryScoreList.appendChild(item);
          });
          categoryScoreboard.classList.remove("hidden");
        } else {
          categoryScoreboard.classList.add("hidden");
        }
      } else {
        categoryScoreboard.classList.add("hidden");
      }
    }

    if (isFirstState && used > 0) {
      showToast(`Joined mid-game ${state.category}, ${used}/${total} done`);
    }

    animateQuestion(state.currentQuestion || (used === 0 ? "Click Next Question to begin." : null));
    lastQuestion = state.currentQuestion;

    // Track vote changes for animations
    if (lastState && state.scores) {
      Object.entries(state.scores).forEach(([playerName, newScore]) => {
        const oldScore = lastState.scores[playerName] || 0;
        if (newScore > oldScore) {
          // Player received a vote, trigger animation
          animateVoteReceived(playerName);
        }
      });
    }
  }

  function animateVoteReceived(playerName) {
    const playerChip = document.querySelector(`[data-player-name="${playerName}"]`);
    if (!playerChip) return;
    
    const nameSpan = playerChip.querySelector('.player-name');
    if (!nameSpan) return;
    
    // Add flash animation to player name
    nameSpan.classList.add('vote-animated');
    setTimeout(() => nameSpan.classList.remove('vote-animated'), 600);
    
    // Create floating +1 label
    const floatLabel = document.createElement('div');
    floatLabel.className = 'vote-float';
    floatLabel.textContent = '+1';
    nameSpan.appendChild(floatLabel);
    
    // Remove floating label after animation
    setTimeout(() => {
      if (floatLabel.parentNode) {
        floatLabel.parentNode.removeChild(floatLabel);
      }
    }, 1500);
  }

  /* ================= JOIN ROOM ================= */
  function doJoin(customName, customRoom) {
    let name = (customName || "").trim();
    let room = (customRoom || roomInput.value).trim().toUpperCase();

    if (!customName) {
      if (!lobbyHost.classList.contains("hidden")) name = nameInputHost.value.trim();
      else if (!lobbyJoin.classList.contains("hidden")) name = nameInputJoin.value.trim();
    }

    if (!name) { showToast("Enter your name!"); return; }
    if (!room) { showToast("Enter room code!"); return; }

    currentName = name.slice(0, 20);
    currentRoom = room;
    currentState = null;

    const activeLang = languageOptions ? languageOptions.querySelector(".lang-btn.active") : null;
    const lang = activeLang ? activeLang.dataset.lang : "en";

    socket.emit("joinRoom", { roomId: room, name: currentName, language: lang, mood: selectedMood });

    roomStatus.textContent = `Room: ${room}`;
    if (subtitleEl) subtitleEl.textContent = `Room: ${room}`;
    shareBtn.classList.remove("hidden");
    enableGameUI(true);
    playSound("click");

    if (nameInputHost) nameInputHost.disabled = true;
    if (nameInputJoin) nameInputJoin.disabled = true;
    if (roomInput) roomInput.disabled = true;
    if (playerList) playerList.classList.remove("hidden");

    const url = new URL(window.location.href);
    url.searchParams.set("room", room);
    window.history.replaceState({}, "", url.toString());
  }

  if (joinBtn) joinBtn.onclick = () => doJoin();
  if (createBtn) {
    createBtn.onclick = () => {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      doJoin(null, code);
      playersPanelVisible = true;
    };
  }

  // Handle Enter key for all lobby inputs
  [nameInputHost, nameInputJoin, roomInput].forEach(el => {
    if (el) {
      el.addEventListener("keydown", e => {
        if (e.key === "Enter") {
          if (el === nameInputHost) {
            if (createBtn) createBtn.click();
          } else {
            if (joinBtn) joinBtn.click();
          }
        }
      });
    }
  });

  /* ================= LOBBY ROUTING ================= */
  if (goHostBtn) {
    goHostBtn.onclick = () => {
      lobbyHome.classList.add("hidden");
      lobbyHost.classList.remove("hidden");
      if (themeSelector) themeSelector.classList.remove("hidden");
      if (languageControls) languageControls.classList.remove("hidden");
      if (nameInputHost) nameInputHost.focus();
      playSound("click");
    };
  }

  if (goJoinBtn) {
    goJoinBtn.onclick = () => {
      lobbyHome.classList.add("hidden");
      lobbyJoin.classList.remove("hidden");
      if (themeSelector) themeSelector.classList.remove("hidden");
      if (languageControls) languageControls.classList.remove("hidden");
      if (nameInputJoin) nameInputJoin.focus();
      playSound("click");
    };
  }

  if (backToHomeHost) {
    backToHomeHost.onclick = () => {
      lobbyHost.classList.add("hidden");
      lobbyHome.classList.remove("hidden");
      if (themeSelector) themeSelector.classList.add("hidden");
      if (languageControls) languageControls.classList.add("hidden");
      playSound("click");
    };
  }

  if (backToHomeJoin) {
    backToHomeJoin.onclick = () => {
      lobbyJoin.classList.add("hidden");
      lobbyHome.classList.remove("hidden");
      if (themeSelector) themeSelector.classList.add("hidden");
      if (languageControls) languageControls.classList.add("hidden");
      playSound("click");
    };
  }

  // Initial Visibility Adjustment
  if (lobbyHome && !lobbyHome.classList.contains("hidden")) {
    if (themeSelector) themeSelector.classList.add("hidden");
    if (languageControls) languageControls.classList.add("hidden");
  }

  // Mood selector event listeners
  [moodSelectHost, moodSelectJoin].forEach(selector => {
    if (selector) {
      selector.addEventListener("click", e => {
        const moodBtn = e.target.closest(".mood-btn");
        if (moodBtn) {
          // Remove active class from all buttons in this selector
          selector.querySelectorAll(".mood-btn").forEach(btn => btn.classList.remove("active"));
          moodBtn.classList.add("active");
          selectedMood = moodBtn.dataset.mood;
        }
      });
    }
  });

  /* ================= SOCKET EVENTS ================= */
  socket.on("roomState", state => {
    const isFirst = currentState === null;
    if (state && state.playersV2 && typeof state.playersV2 === "object") {
      const host = Object.values(state.playersV2).find(p => p && p.isHost === true);
      currentHostId = host ? host.id : null;
      isHost = socket.id === currentHostId;
    } else {
      isHost = false;
    }
    if (currentRoom && roomStatus && typeof state.isLocked === "boolean") {
      const base = `Room: ${currentRoom}`;
      const label = state.isLocked ? `${base} (Locked)` : base;
      roomStatus.textContent = label;
      if (subtitleEl) subtitleEl.textContent = label;
    }
    if (!currentRoom && joinBtn) {
      joinBtn.disabled = !!state?.isLocked;
    }
    updateHostControls(state);
    updateUIFromState(state, isFirst);
  });

  socket.on("hostUpdated", ({ id }) => {
    if (!id) return;
    currentHostId = id;
    isHost = socket.id === currentHostId;
    updateHostControls();
  });

  socket.on("reaction", ({ emoji, name }) => {
    if (!emoji) return;
    spawnFloatingEmoji(emoji, name);
    spawnConfetti(30);
  });

  socket.on("roomLocked", ({ reason } = {}) => {
    showToast(reason || "Room is locked");
  });

  socket.on("connect_error", () => showToast("Connection lost. Reconnecting..."));

  socket.on("connect", () => {
    if (cardEl) cardEl.classList.remove("disconnected");
    if (currentRoom) {
      socket.emit("joinRoom", { roomId: currentRoom, name: currentName });
      roomStatus.textContent = `Room: ${currentRoom}`;
      if (subtitleEl) subtitleEl.textContent = `Room: ${currentRoom}`;
      enableGameUI(true);
    } else {
      roomStatus.textContent = "Not connected"; if (playerList) playerList.classList.add("hidden");
      if (subtitleEl) subtitleEl.textContent = defaultSubtitle;
      enableGameUI(false);
    }
  });

  socket.on("disconnect", () => {
    enableGameUI(false);
    roomStatus.textContent = "Disconnected \u2014 reconnecting..."; if (playerList) playerList.classList.add("hidden");
    if (cardEl) cardEl.classList.add("disconnected");
    if (subtitleEl) subtitleEl.textContent = defaultSubtitle;
    if (nameInput) nameInput.disabled = false;
    roomInput.disabled = false;

  });

  /* ================= GAME ACTIONS ================= */
  // Delegated \u2014 works for all pills, including any added later
  if (categoryPillsWrap) {
    categoryPillsWrap.addEventListener("click", e => {
      const pill = e.target.closest(".pill");
      if (!pill || pill.disabled || !currentRoom) return;
      const rawCategory = pill.dataset.value || "";
      const category = rawCategory.toLowerCase().replace(/[^a-z]/g, "");
      if (!category) return;
      clearPendingPills();
      pill.classList.add("pending");
      socket.emit("changeCategory", { roomId: currentRoom, category });
      playSound("click");
    });
  }

  nextBtn.addEventListener("click", () => {
    if (!currentRoom) return;
    clearFloatingEmojis();
    socket.emit("nextQuestion", { roomId: currentRoom });
    playSound("click");
  });

  resetBtn.addEventListener("click", () => {
    if (!currentRoom) return;
    socket.emit("resetRoom", currentRoom);
    playSound("reset");
    showToast("Room reset!");
    doneAlreadyPlayed = false;
  });

  if (skipBtn) {
    skipBtn.addEventListener("click", () => {
      if (!currentRoom) return;
      clearFloatingEmojis();
      socket.emit("skipQuestion", { roomId: currentRoom });
      playSound("click");
    });
  }

  if (copyQuestionBtn) {
    copyQuestionBtn.addEventListener("click", async () => {
      const text = questionEl.textContent || "";
      if (!text.trim()) return;
      try {
        await navigator.clipboard.writeText(text);
        showToast("Question copied!");
      } catch (_) {
        showToast("Couldn't copy \u2014 try manually");
      }
    });
  }

  // Old shareBtn functionality removed - now using inlineShareBtn only

  if (inlineShareBtn) {
    inlineShareBtn.addEventListener("click", async () => {
      if (!currentRoom) return;
      const inviteLink = `${window.location.origin}/?room=${currentRoom}`;
      try {
        await navigator.clipboard.writeText(inviteLink);
        showToast("Room link copied!");
      } catch (_) {
        showToast("Couldn't copy \u2014 try manually");
      }
    });
  }

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

  if (timerToggle) {
    timerToggle.addEventListener("change", () => {
      if (!currentRoom) return;
      const duration = getActiveTimerDuration();
      socket.emit("setTimer", { roomId: currentRoom, enabled: timerToggle.checked, duration });
    });
  }

  if (timerOptions) {
    timerOptions.addEventListener("click", e => {
      const btn = e.target.closest(".timer-btn");
      if (!btn || !currentRoom) return;
      const seconds = Number(btn.dataset.seconds);
      if (seconds <= 0) return;
      // Clear custom input when a preset is clicked
      if (timerCustomInput) timerCustomInput.value = "";
      setActiveTimerButton(seconds);
      socket.emit("setTimer", { roomId: currentRoom, enabled: !!(timerToggle && timerToggle.checked), duration: seconds });
    });
  }

  if (timerCustomInput) {
    // Fire on Enter key or blur when user finishes typing
    const applyCustomTimer = () => {
      if (!currentRoom) return;
      const val = parseInt(timerCustomInput.value, 10);
      if (isNaN(val) || val < 10 || val > 600) {
        showToast("Custom timer must be 10 – 600 seconds");
        timerCustomInput.value = "";
        return;
      }
      // Deactivate preset buttons when custom is set
      setActiveTimerButton(-1);
      socket.emit("setTimer", { roomId: currentRoom, enabled: !!(timerToggle && timerToggle.checked), duration: val });
    };
    timerCustomInput.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); applyCustomTimer(); } });
    timerCustomInput.addEventListener("blur", () => { if (timerCustomInput.value) applyCustomTimer(); });
  }

  if (languageOptions) {
    languageOptions.addEventListener("click", e => {
      const btn = e.target.closest(".lang-btn");
      if (!btn || btn.disabled) return;
      const lang = btn.dataset.lang;
      if (!lang) return;

      // Update UI immediately (local feedback)
      languageOptions.querySelectorAll(".lang-btn").forEach(b => b.classList.toggle("active", b === btn));
      storage.set("icebreaker_lang", lang);

      if (currentRoom) {
        socket.emit("changeLanguage", { roomId: currentRoom, language: lang });
      }
      playSound("click");
    });
  }

  // Load saved language
  const savedLang = storage.get("icebreaker_lang");
  if (savedLang) {
    const btn = languageOptions ? languageOptions.querySelector(`.lang-btn[data-lang="${savedLang}"]`) : null;
    if (btn) {
      languageOptions.querySelectorAll(".lang-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    }
  }

  if (leaveBtn) {
    leaveBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to leave room?")) {
        window.location.reload(); // Simple way to reset everything for now
      }
    });
  }

  // Play Again button event listener (delegated since it's dynamically created)
  document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "playAgainBtn") {
      if (currentRoom && isHost) {
        socket.emit("resetRoom", currentRoom);
        showToast("Starting new round!");
        doneAlreadyPlayed = false;
      }
    }
  });

  if (playersToggle && playerList) {
    playersToggle.addEventListener("click", () => {
      playersPanelVisible = !playersPanelVisible;
      playerList.classList.toggle("hidden", !playersPanelVisible);
      playersToggle.classList.toggle("active", playersPanelVisible);
      
      // Update button text with participant count
      const participantCount = document.getElementById("participantCount");
      const count = participantCount ? participantCount.textContent : "0";
      playersToggle.innerHTML = playersPanelVisible 
        ? `👥 Players (${count})`
        : `👥 Players`;
    });
  }

  // Close player panel when clicking outside
  document.addEventListener("click", (e) => {
    if (playersPanelVisible && playerList && !playerList.contains(e.target) && !playersToggle.contains(e.target)) {
      playersPanelVisible = false;
      playerList.classList.add("hidden");
      playersToggle.classList.remove("active");
      
      const participantCount = document.getElementById("participantCount");
      const count = participantCount ? participantCount.textContent : "0";
      playersToggle.innerHTML = `👥 Players`;
    }
  });

  if (voteList) {
    voteList.addEventListener("click", e => {
      const btn = e.target.closest(".vote-btn");
      if (!btn || btn.disabled || !currentRoom) return;
      const votedFor = btn.dataset.name;
      if (!votedFor) return;
      socket.emit("castVote", { roomId: currentRoom, votedFor });
      playSound("click");
    });
  }

  function clearFloatingEmojis() {
    if (!reactionStage) return;
    reactionStage.textContent = "";
  }

  function spawnFloatingEmoji(emoji, name) {
    if (!reactionStage) return;
    const el = document.createElement("div");
    el.className = "floating-emoji";
    el.textContent = emoji;
    const cardRect = questionCard ? questionCard.getBoundingClientRect() : null;
    const stageRect = reactionStage.getBoundingClientRect();
    const x = cardRect ? (cardRect.left + cardRect.width * (0.1 + Math.random() * 0.8)) : (window.innerWidth * (0.1 + Math.random() * 0.8));
    const y = cardRect ? (cardRect.bottom - 10) : (window.innerHeight - 80);
    el.style.left = `${Math.max(0, Math.min(x, stageRect.width - 10))}px`;
    el.style.top = `${Math.max(0, Math.min(y, stageRect.height - 10))}px`;

    if (name) {
      const label = document.createElement("div");
      label.className = "emoji-label";
      label.textContent = name;
      el.appendChild(label);
    }

    if (reactionStage.children.length >= 8) {
      reactionStage.removeChild(reactionStage.firstElementChild);
    }

    reactionStage.appendChild(el);
    el.addEventListener("animationend", () => {
      if (el.parentNode) el.parentNode.removeChild(el);
    });
  }

  /* ================= THEME ================= */
  function loadTheme() {
    const saved = storage.get("vci_theme");
    if (saved) {
      applyTheme(saved);
    } else {
      const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
      if (prefersLight) {
        document.body.classList.add("light");
      }
    }
  }

  /* ================= THEMES ================= */
  const THEMES = {
    classic: {
      colors: [
        [0.05, 0.05, 0.14],
        [0.09, 0.07, 0.22],
        [0.15, 0.06, 0.25],
        [0.04, 0.10, 0.20]
      ]
    },
    midnight: {
      colors: [
        [0.02, 0.02, 0.05],
        [0.04, 0.04, 0.08],
        [0.06, 0.03, 0.10],
        [0.01, 0.02, 0.04]
      ]
    },
    aura: {
      colors: [
        [0.14, 0.05, 0.14],
        [0.22, 0.07, 0.22],
        [0.25, 0.06, 0.15],
        [0.10, 0.04, 0.20]
      ]
    },
    ocean: {
      colors: [
        [0.05, 0.14, 0.14],
        [0.07, 0.22, 0.22],
        [0.06, 0.25, 0.15],
        [0.04, 0.20, 0.10]
      ]
    },
    forest: {
      colors: [
        [0.05, 0.14, 0.05],
        [0.07, 0.22, 0.07],
        [0.06, 0.25, 0.06],
        [0.04, 0.20, 0.04]
      ]
    },
    slate: {
      colors: [
        [0.08, 0.10, 0.12],
        [0.12, 0.14, 0.16],
        [0.16, 0.18, 0.20],
        [0.10, 0.12, 0.14]
      ]
    },
    amethyst: {
      colors: [
        [0.12, 0.05, 0.20],
        [0.18, 0.08, 0.25],
        [0.22, 0.10, 0.30],
        [0.15, 0.06, 0.22]
      ]
    },
    ember: {
      colors: [
        [0.20, 0.06, 0.04],
        [0.25, 0.08, 0.06],
        [0.30, 0.12, 0.08],
        [0.22, 0.07, 0.05]
      ]
    },
    ivory: {
      colors: [
        [0.96, 0.95, 0.92],
        [0.94, 0.92, 0.88],
        [0.98, 0.97, 0.95],
        [1.00, 0.99, 0.97]
      ]
    }
  };

  let currentTheme = storage.get("vci_theme") || "classic";
  let themeUniforms = null;

  function applyTheme(themeId) {
    if (!THEMES[themeId]) themeId = "classic";
    currentTheme = themeId;
    storage.set("vci_theme", themeId);

    // Update Body Class
    Object.keys(THEMES).forEach(t => document.body.classList.remove(`theme-${t}`));
    document.body.classList.add(`theme-${themeId}`);

    // Update Dots UI
    const dots = document.querySelectorAll(".theme-dot");
    dots.forEach(dot => {
      dot.classList.toggle("active", dot.dataset.theme === themeId);
    });

    // Update Shader Uniforms
    if (window.updateShaderColors) {
      window.updateShaderColors(THEMES[themeId].colors);
    }
  }

  if (themeSelector) {
    themeSelector.addEventListener("click", e => {
      const dot = e.target.closest(".theme-dot");
      if (dot) {
        applyTheme(dot.dataset.theme);
        playSound("click");
      }
    });
  }

  // Initial Theme Apply
  setTimeout(() => applyTheme(currentTheme), 100);

  /* ================= PWA INSTALL ================= */
  let deferredPrompt = null;
  const installBtn = document.getElementById("installBtn");
  window.addEventListener("beforeinstallprompt", e => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) installBtn.classList.remove("hidden");
  });
  if (installBtn) {
    installBtn.addEventListener("click", async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") installBtn.classList.add("hidden");
      deferredPrompt = null;
    });
  }
  window.addEventListener("appinstalled", () => {
    if (installBtn) installBtn.classList.add("hidden");
    showToast("App installed!");
  });

  /* ================= PARALLAX ================= */
  (function setupParallax() {
    if (!ENABLE_PARALLAX) return;
    if (!cardEl) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let tx = 0, ty = 0, cx = 0, cy = 0;
    let rafId = null, active = false;
    const MAX_TILT = 6, MAX_SHIFT = 10;

    function tick() {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      cardEl.style.transform =
        `translate3d(${cx * MAX_SHIFT}px, ${cy * MAX_SHIFT}px, 0) ` +
        `rotateX(${cy * MAX_TILT}deg) rotateY(${cx * MAX_TILT * -1}deg)`;
      document.body.style.setProperty("--orb-x", `${cx * 30}px`);
      document.body.style.setProperty("--orb-y", `${cy * 22}px`);
      document.body.style.setProperty("--orb2-x", `${cx * -22}px`);
      document.body.style.setProperty("--orb2-y", `${cy * 18}px`);
      if (particleLayer) particleLayer.setParallax(cx, cy);
      rafId = requestAnimationFrame(tick);
    }

    function start() {
      if (!active) { active = true; rafId = requestAnimationFrame(tick); }
    }

    window.addEventListener("mousemove", e => {
      tx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      ty = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      start();
    });

    window.addEventListener("mouseleave", () => {
      tx = 0; ty = 0; start();
      setTimeout(() => {
        if (Math.abs(cx) < 0.01 && Math.abs(cy) < 0.01) {
          active = false;
          cancelAnimationFrame(rafId);
          cardEl.style.transform = "";
        }
      }, 800);
    });

    window.addEventListener("deviceorientation", e => {
      if (e.beta == null || e.gamma == null) return;
      tx = Math.max(-1, Math.min(1, e.gamma / 25));
      ty = Math.max(-1, Math.min(1, e.beta / 25));
      start();
    });
  })();

  /* ================= WEBGL BACKGROUND ================= */
  (function setupWebGL() {
    if (!ENABLE_WEBGL_BG) return;
    const canvas = document.getElementById("bg");
    if (!canvas) return;
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    }
    resize();
    window.addEventListener("resize", resize);

    function compile(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    }

    const vs = compile(gl.VERTEX_SHADER, document.getElementById("vertexShader").text);
    const fs = compile(gl.FRAGMENT_SHADER, document.getElementById("fragmentShader").text);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(prog, "a_position");
    const uRes = gl.getUniformLocation(prog, "u_resolution");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uColors = [
      gl.getUniformLocation(prog, "u_color1"),
      gl.getUniformLocation(prog, "u_color2"),
      gl.getUniformLocation(prog, "u_color3"),
      gl.getUniformLocation(prog, "u_color4")
    ];

    window.updateShaderColors = (colors) => {
      gl.useProgram(prog);
      colors.forEach((c, i) => {
        gl.uniform3f(uColors[i], c[0], c[1], c[2]);
      });
    };

    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    function render(t) {
      t *= 0.001;
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uRes, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.uniform1f(uTime, t);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  })();

  /* ================= PARTICLE LAYER ================= */
  particleLayer = (function setupParticles() {
    if (!ENABLE_PARTICLES) return null;
    const canvas = document.getElementById("particles");
    if (!canvas) return null;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    let w = 0, h = 0, particles = [];
    let cur = { r: 24, g: 213, b: 196 };
    let tgt = { r: 24, g: 213, b: 196 };
    let pxOff = 0, pyOff = 0;

    function hexToRgb(hex) {
      const n = parseInt(hex.replace("#", ""), 16);
      return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
    }

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      const count = Math.min(90, Math.floor((w * h) / 28000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 1.8,
        a: 0.15 + Math.random() * 0.35,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.24
      }));
    }

    function draw() {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.setTransform(1, 0, 0, 1, pxOff, pyOff);

      cur.r += (tgt.r - cur.r) * 0.06;
      cur.g += (tgt.g - cur.g) * 0.06;
      cur.b += (tgt.b - cur.b) * 0.06;

      const r = cur.r.toFixed(0);
      const g = cur.g.toFixed(0);
      const b = cur.b.toFixed(0);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${p.a})`;
        ctx.fill();
      }

      requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    draw();

    return {
      setMode(hex) { tgt = hexToRgb(hex); },
      setParallax(x, y) { pxOff = x * 12; pyOff = y * 10; }
    };
  })();

});