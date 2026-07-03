// ═══════════════════════════════════════════════════════════
//  IMPOSTER — app.js
//  Single-file game logic: navigation, roles, voting, server
// ═══════════════════════════════════════════════════════════

// ── Global state ────────────────────────────────────────────

const state = {
  mode: 'single',          // 'single' | 'server'
  players: [],             // ['Alice', 'Bob', ...]
  roundNumber: 1,
  settings: {
    imposterCount: 1,
    hintMode: 'hint',      // 'hint' | 'none'
    trollEnabled: false,
    wordPack: 'office',
  },
  game: {
    currentWord: null,
    currentHint: null,
    roles: {},             // { playerName: 'crewmate'|'imposter'|'troll' }
    wordForPlayer: {},     // { playerName: string }
    revealed: {},          // { playerName: true }
    eliminated: [],        // [playerName, ...]
    gameOver: false,
    winner: null,          // 'crew_wins' | 'imposter_wins'
  },
  currentRevealPlayer: null,
};

// ── Utility ─────────────────────────────────────────────────

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function sanitize(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ── Navigation ───────────────────────────────────────────────

const App = {

  goTo(screen, mode) {
    if (mode) state.mode = mode;
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById(`screen-${screen}`);
    if (el) el.classList.add('active');

    if (screen === 'setup') UI.initSetup();
  },

  confirmBack() {
    if (confirm('Go back? The current game will end.')) {
      App.goTo('setup');
    }
  },

  // ── Player management ──────────────────────────────────

  addPlayer() {
    const input = document.getElementById('player-name-input');
    const name = input.value.trim();
    if (!name) return;
    if (state.players.map(p => p.toLowerCase()).includes(name.toLowerCase())) {
      UI.shake(input); return;
    }
    if (state.players.length >= 12) { alert('Max 12 players!'); return; }
    state.players.push(name);
    input.value = '';
    UI.renderChips();
    input.focus();
  },

  removePlayer(name) {
    state.players = state.players.filter(p => p !== name);
    UI.renderChips();
  },

  changeImposterCount(delta) {
    const max = Math.max(1, Math.floor((state.players.length - 1) / 2));
    state.settings.imposterCount = Math.max(1, Math.min(max, state.settings.imposterCount + delta));
    document.getElementById('imposter-count-display').textContent = state.settings.imposterCount;
  },

  setHintMode(mode) {
    state.settings.hintMode = mode;
    document.getElementById('hint-btn').classList.toggle('active', mode === 'hint');
    document.getElementById('nohint-btn').classList.toggle('active', mode === 'none');
  },

  setTroll(enabled) { state.settings.trollEnabled = enabled; },

  selectPack(packId) {
    state.settings.wordPack = packId;
    UI.renderPackGrid('pack-grid');
  },

  // ── Game start ─────────────────────────────────────────

  startGame() {
    if (state.players.length < 3) { alert('Need at least 3 players!'); return; }

    const max = Math.max(1, Math.floor((state.players.length - 1) / 2));
    if (state.settings.imposterCount > max) state.settings.imposterCount = max;
    if (state.settings.trollEnabled && state.players.length < state.settings.imposterCount + 2) {
      alert('Not enough players for a Troll. Add more players or disable Troll.');
      return;
    }

    GameLogic.assignRoles();
    state.game.revealed   = {};
    state.game.eliminated = [];
    state.game.gameOver   = false;
    state.game.winner     = null;

    App.goTo('player-list');
    document.getElementById('pl-pack-name').textContent  = WORD_PACKS[state.settings.wordPack].name;
    document.getElementById('pl-round-info').textContent = `Round ${state.roundNumber}`;
    UI.renderPlayerCards();
  },

  // ── Role reveal modal ──────────────────────────────────

  openRoleModal(playerName) {
    state.currentRevealPlayer = playerName;
    document.getElementById('modal-player-name').textContent = playerName;
    document.getElementById('modal-pre').classList.remove('hidden');
    document.getElementById('modal-revealed').classList.add('hidden');
    document.getElementById('modal-role').classList.add('active');
  },

  maybeCloseRoleModal(e) {
    // Only close on backdrop click (not panel click)
    if (e.target === document.getElementById('modal-role')) App.closeRoleModal();
  },

  revealRole() {
    const name = state.currentRevealPlayer;
    const role = state.game.roles[name];
    const word = state.game.wordForPlayer[name];

    document.getElementById('modal-pre').classList.add('hidden');
    document.getElementById('modal-revealed').classList.remove('hidden');

    // Badge
    const badge = document.getElementById('modal-role-badge');
    badge.textContent = role.toUpperCase();
    badge.className   = 'role-badge-large';   // white/neutral in modal

    // Word area
    const wordArea = document.getElementById('modal-word-area');
    if (role === 'imposter' && state.settings.hintMode === 'none') {
      wordArea.innerHTML = `
        <p class="word-label">Your word</p>
        <p class="word-value mystery">???</p>
      `;
    } else if (role === 'imposter') {
      wordArea.innerHTML = `
        <p class="word-label">Hint</p>
        <p class="word-value">${sanitize(word)}</p>
      `;
    } else {
      wordArea.innerHTML = `
        <p class="word-label">The word is</p>
        <p class="word-value">${sanitize(word)}</p>
      `;
    }

    state.game.revealed[name] = true;
    UI.updateCard(name);
  },

  closeRoleModal() {
    document.getElementById('modal-role').classList.remove('active');
    state.currentRevealPlayer = null;
  },

  // ── Voting ─────────────────────────────────────────────

  enterVoting() {
    const active    = state.players.filter(p => !state.game.eliminated.includes(p));
    const unrevealed = active.filter(p => !state.game.revealed[p]);
    if (unrevealed.length > 0) {
      alert(`${unrevealed.join(', ')} haven't seen their role yet!`);
      return;
    }
    App.goTo('voting');
    UI.renderVotingCards();
  },

  exitVoting() { App.goTo('player-list'); },

  vote(playerName) {
    state.game.eliminated.push(playerName);

    const role       = state.game.roles[playerName];
    const isImposter = role === 'imposter';
    const isTroll    = role === 'troll';

    // Vote result modal
    document.getElementById('vote-icon').textContent    = isImposter ? '🎯' : isTroll ? '🃏' : '😇';
    document.getElementById('vote-name').textContent    = playerName;
    document.getElementById('vote-verdict').textContent =
      isImposter ? 'was THE IMPOSTER!' : isTroll ? 'was THE TROLL!' : 'was INNOCENT';

    document.getElementById('modal-vote').classList.add('active');
    UI.renderVotingCards();
  },

  closeVoteModal() {
    document.getElementById('modal-vote').classList.remove('active');
    const end = GameLogic.checkEnd();
    if (end) setTimeout(() => App.showEnd(end), 320);
  },

  showEnd(result) {
    state.game.gameOver = true;
    state.game.winner   = result;
    App.goTo('end');
    UI.renderEndScreen(result);
  },

  playAgain() {
    state.roundNumber++;
    App.startGame();
  },

  // ── Theme (light / dark) ───────────────────────────────

  toggleTheme() {
    const current = App._effectiveTheme();
    const next    = current === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('imposter_theme', next);
    App._updateThemeBtn();
  },

  _effectiveTheme() {
    const manual = document.documentElement.dataset.theme;
    if (manual) return manual;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  },

  _updateThemeBtn() {
    const btn = document.getElementById('theme-toggle-btn');
    if (!btn) return;
    btn.textContent = App._effectiveTheme() === 'dark' ? '☀️' : '🌙';
  },

  _initTheme() {
    const saved = localStorage.getItem('imposter_theme');
    if (saved) document.documentElement.dataset.theme = saved;
    App._updateThemeBtn();
  },
};

// ── Game Logic ───────────────────────────────────────────────

const GameLogic = {
  assignRoles() {
    const players = shuffle(state.players);
    const pack    = WORD_PACKS[state.settings.wordPack];
    const entry   = pack.words[Math.floor(Math.random() * pack.words.length)];

    state.game.currentWord = entry.word;
    state.game.currentHint = entry.hint;
    state.game.roles       = {};
    state.game.wordForPlayer = {};

    let idx = 0;

    for (let i = 0; i < state.settings.imposterCount; i++, idx++) {
      state.game.roles[players[idx]]       = 'imposter';
      state.game.wordForPlayer[players[idx]] = state.game.currentHint;
    }

    if (state.settings.trollEnabled) {
      state.game.roles[players[idx]]       = 'troll';
      state.game.wordForPlayer[players[idx]] = state.game.currentWord;
      idx++;
    }

    for (; idx < players.length; idx++) {
      state.game.roles[players[idx]]       = 'crewmate';
      state.game.wordForPlayer[players[idx]] = state.game.currentWord;
    }
  },

  checkEnd() {
    const active       = state.players.filter(p => !state.game.eliminated.includes(p));
    const imposters    = active.filter(p => state.game.roles[p] === 'imposter');
    const crew         = active.filter(p => state.game.roles[p] === 'crewmate');

    if (imposters.length === 0) return 'crew_wins';
    if (imposters.length >= crew.length) return 'imposter_wins';
    return null;
  },
};

// ── UI ───────────────────────────────────────────────────────

const UI = {

  initSetup() {
    UI.renderChips();
    UI.renderPackGrid('pack-grid');
    document.getElementById('imposter-count-display').textContent = state.settings.imposterCount;
    document.getElementById('hint-btn').classList.toggle('active', state.settings.hintMode === 'hint');
    document.getElementById('nohint-btn').classList.toggle('active', state.settings.hintMode === 'none');
    document.getElementById('troll-toggle').checked = state.settings.trollEnabled;
  },

  renderChips() {
    document.getElementById('player-chips').innerHTML =
      state.players.map(name => `
        <div class="player-chip">
          <span>${sanitize(name)}</span>
          <button class="chip-remove" data-remove="${sanitize(name)}">×</button>
        </div>
      `).join('');
  },

  renderPackGrid(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = Object.entries(WORD_PACKS).map(([id, pack]) => `
      <button class="pack-btn ${state.settings.wordPack === id ? 'selected' : ''}"
              data-pack="${id}" data-grid="${containerId}">
        <span class="pack-emoji">${pack.emoji}</span>
        <span class="pack-name">${sanitize(pack.name)}</span>
      </button>
    `).join('');
  },

  renderPlayerCards() {
    document.getElementById('player-cards').innerHTML =
      state.players.map(name => {
        const elim     = state.game.eliminated.includes(name);
        const revealed = state.game.revealed[name];
        return `
          <div class="player-card ${elim ? 'eliminated' : ''} ${revealed ? 'revealed' : ''}"
               data-player="${sanitize(name)}">
            <span class="card-name">${sanitize(name)}</span>
            <span class="card-status">${elim ? '✗' : revealed ? 'Ready' : 'Tap to view'}</span>
          </div>
        `;
      }).join('');
  },

  updateCard(name) {
    const el = document.querySelector(`#player-cards [data-player="${CSS.escape(name)}"]`);
    if (!el) return;
    el.classList.add('revealed');
    const st = el.querySelector('.card-status');
    if (st) st.textContent = 'Ready';
  },

  renderVotingCards() {
    document.getElementById('voting-cards').innerHTML =
      state.players.map(name => {
        const elim = state.game.eliminated.includes(name);
        return `
          <div class="player-card ${elim ? 'eliminated' : ''}"
               data-vote="${sanitize(name)}">
            <span class="card-name">${sanitize(name)}</span>
            <span class="card-status">${elim ? '✗ Out' : 'Vote Out'}</span>
          </div>
        `;
      }).join('');
  },

  renderEndScreen(result) {
    const banner   = document.getElementById('end-result-banner');
    const wordEl   = document.getElementById('end-word');
    const rolesList = document.getElementById('end-roles-list');

    wordEl.textContent = state.game.currentWord;

    if (result === 'crew_wins') {
      banner.innerHTML = `
        <p class="end-result crew-wins">Crew Wins! 🎉</p>
        <p class="end-subtitle">The imposter was caught.</p>
      `;
    } else {
      banner.innerHTML = `
        <p class="end-result imposter-wins">Imposters Win! 😈</p>
        <p class="end-subtitle">The crew was deceived.</p>
      `;
    }

    rolesList.innerHTML = state.players.map(name => {
      const role  = state.game.roles[name];
      const elim  = state.game.eliminated.includes(name);
      const cls   = role === 'imposter' ? 'end-imposter' : role === 'troll' ? 'end-troll' : 'end-crewmate';
      const label = role === 'imposter' ? 'IMPOSTER' : role === 'troll' ? 'TROLL' : 'CREWMATE';
      return `
        <div class="end-role-row ${cls}">
          <span class="end-player-name">${sanitize(name)}</span>
          ${elim ? '<span class="end-out-badge">voted out</span>' : ''}
          <span class="end-role-tag">${label}</span>
        </div>
      `;
    }).join('');
  },

  shake(el) {
    el.style.animation = 'none';
    el.offsetHeight;
    el.style.animation = 'shake 0.3s ease';
    setTimeout(() => { el.style.animation = ''; }, 350);
  },
};

// ── Server (Firebase) ────────────────────────────────────────

const Server = {
  roomCode: null,
  isHost:   false,
  name:     null,
  ref:      null,

  _db() {
    if (typeof firebase === 'undefined') {
      alert('Firebase not configured. Server mode requires Firebase.');
      return null;
    }
    return firebase.database();
  },

  _genCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let c = '';
    for (let i = 0; i < 6; i++) c += chars[Math.floor(Math.random() * chars.length)];
    return c;
  },

  async createRoom() {
    const db = Server._db();
    if (!db) return;

    const hostName = prompt('Enter your display name:');
    if (!hostName || !hostName.trim()) return;

    Server.isHost   = true;
    Server.name     = hostName.trim();
    Server.roomCode = Server._genCode();
    Server.ref      = db.ref(`rooms/${Server.roomCode}`);

    await Server.ref.set({
      host:    Server.name,
      status:  'lobby',
      settings: state.settings,
      players: { [Server.name]: { joined: true, eliminated: false } },
      created: Date.now(),
    });

    Server.ref.onDisconnect().remove();
    Server._listen();

    document.getElementById('lobby-room-code').textContent    = Server.roomCode;
    document.getElementById('server-room-badge').textContent  = `Room: ${Server.roomCode}`;
    App.goTo('server-lobby');
    UI.renderPackGrid('server-pack-grid');

    Server._genQR();
  },

  async joinRoom() {
    const db   = Server._db();
    if (!db) return;

    const name = document.getElementById('join-name-input').value.trim();
    const code = document.getElementById('join-code-input').value.toUpperCase().trim();

    if (!name || !code) { alert('Enter your name and the room code.'); return; }

    Server.isHost   = false;
    Server.name     = name;
    Server.roomCode = code;
    Server.ref      = db.ref(`rooms/${code}`);

    const snap = await Server.ref.once('value');
    if (!snap.exists()) { alert('Room not found! Check the code.'); return; }

    const room = snap.val();
    if (room.status !== 'lobby') { alert('Game already in progress!'); return; }

    await Server.ref.child(`players/${name}`).set({ joined: true, eliminated: false });
    Server.ref.child(`players/${name}`).onDisconnect().remove();
    Server._listen();

    document.getElementById('server-room-badge').textContent = `Room: ${Server.roomCode}`;
    App.goTo('server-player');
  },

  _listen() {
    Server.ref.on('value', snap => {
      const room = snap.val();
      if (!room) { App.goTo('home'); return; }

      if (Server.isHost) {
        Server._updateLobbyUI(room);
      }

      const status = room.status;

      if (status === 'playing') {
        if (!Server.isHost) Server._showPlayerRole(room);
        else Server._hostGameView(room);
      }

      if (status === 'ended') {
        Server._showEnd(room);
      }
    });
  },

  _updateLobbyUI(room) {
    const players = Object.keys(room.players || {});
    document.getElementById('lobby-count').textContent = players.length;
    document.getElementById('lobby-player-chips').innerHTML =
      players.map(p => `<div class="lobby-chip">${sanitize(p)}</div>`).join('');
  },

  _showPlayerRole(room) {
    const myRole = (room.roles || {})[Server.name];
    if (!myRole) return;

    const content = document.getElementById('server-player-content');
    let wordHtml = '';
    if (myRole.role === 'imposter' && room.settings?.hintMode === 'none') {
      wordHtml = `<p class="word-label">Your word</p><p class="word-value mystery">???</p>`;
    } else if (myRole.role === 'imposter') {
      wordHtml = `<p class="word-label">Hint</p><p class="word-value">${sanitize(myRole.word)}</p>`;
    } else {
      wordHtml = `<p class="word-label">The word is</p><p class="word-value">${sanitize(myRole.word)}</p>`;
    }

    content.innerHTML = `
      <div class="server-role-reveal">
        <div class="server-role-badge">${myRole.role.toUpperCase()}</div>
        <div class="server-word-area">${wordHtml}</div>
        <p class="server-hint-text">Discuss with everyone.<br>The host will start the vote when ready.</p>
      </div>
    `;
  },

  _hostGameView(room) {
    // Host sees controls to start voting
    const content = document.getElementById('server-player-content');
    const players = Object.keys(room.players || {}).filter(p => !(room.players[p].eliminated));
    content.innerHTML = `
      <div class="server-voting-area">
        <h3>Game in Progress</h3>
        <p style="color:var(--text-dim);text-align:center;font-size:14px">
          Let everyone discuss, then vote someone out.
        </p>
        <div class="cards-grid">
          ${players.map(p => `
            <div class="player-card" data-host-vote="${sanitize(p)}">
              <span class="card-name">${sanitize(p)}</span>
              <span class="card-status">Eliminate</span>
            </div>
          `).join('')}
        </div>
        <button class="btn-outline" onclick="Server._endGame('imposter_wins')">End Game (Imposters Win)</button>
      </div>
    `;
    App.goTo('server-player');
  },

  async hostVote(playerName) {
    if (!confirm(`Eliminate ${playerName}?`)) return;
    const snap  = await Server.ref.once('value');
    const room  = snap.val();
    const roles = room.roles || {};
    const role  = (roles[playerName] || {}).role;

    await Server.ref.child(`players/${playerName}/eliminated`).set(true);

    // Check end
    const updatedSnap = await Server.ref.once('value');
    const updatedRoom = updatedSnap.val();
    const activePlayers = Object.entries(updatedRoom.players || {})
      .filter(([, d]) => !d.eliminated).map(([n]) => n);
    const activeImposters = activePlayers.filter(p => (roles[p] || {}).role === 'imposter');
    const activeCrew      = activePlayers.filter(p => (roles[p] || {}).role === 'crewmate');

    let result = null;
    if (activeImposters.length === 0) result = 'crew_wins';
    else if (activeImposters.length >= activeCrew.length) result = 'imposter_wins';

    if (result) {
      Server._endGame(result);
    } else {
      Server._hostGameView(updatedRoom);
    }
  },

  async _endGame(result) {
    await Server.ref.update({ status: 'ended', result });
  },

  _showEnd(room) {
    // Reconstruct local state for end screen
    state.players = Object.keys(room.players || {});
    state.game.currentWord = room.word || '?';
    state.game.roles       = {};
    state.game.eliminated  = [];

    Object.entries(room.roles || {}).forEach(([n, r]) => {
      state.game.roles[n] = r.role;
    });
    Object.entries(room.players || {}).forEach(([n, d]) => {
      if (d.eliminated) state.game.eliminated.push(n);
    });

    if (Server.ref) Server.ref.off();
    App.goTo('end');
    UI.renderEndScreen(room.result || 'crew_wins');
  },

  async startGame() {
    const snap = await Server.ref.once('value');
    const room = snap.val();
    const players = Object.keys(room.players || {});

    if (players.length < 3) { alert('Need at least 3 players!'); return; }

    const shuffled = shuffle(players);
    const settings = room.settings || state.settings;
    const pack     = WORD_PACKS[settings.wordPack];
    const entry    = pack.words[Math.floor(Math.random() * pack.words.length)];

    const roles = {};
    let idx = 0;

    for (let i = 0; i < settings.imposterCount && idx < shuffled.length; i++, idx++) {
      roles[shuffled[idx]] = { role: 'imposter', word: entry.hint };
    }
    if (settings.trollEnabled && idx < shuffled.length) {
      roles[shuffled[idx]] = { role: 'troll', word: entry.word };
      idx++;
    }
    for (; idx < shuffled.length; idx++) {
      roles[shuffled[idx]] = { role: 'crewmate', word: entry.word };
    }

    await Server.ref.update({ status: 'playing', roles, word: entry.word, settings });
  },

  leaveRoom() {
    if (Server.ref) {
      if (Server.isHost) Server.ref.remove();
      else Server.ref.child(`players/${Server.name}`).remove();
      Server.ref.off();
    }
    Server.ref = null;
    Server.roomCode = null;
    App.goTo('home');
  },

  changeImposterCount(delta) {
    App.changeImposterCount(delta);
    document.getElementById('server-imposter-count').textContent = state.settings.imposterCount;
    Server._syncSettings();
  },

  setHintMode(mode) {
    state.settings.hintMode = mode;
    document.getElementById('s-hint-btn').classList.toggle('active', mode === 'hint');
    document.getElementById('s-nohint-btn').classList.toggle('active', mode === 'none');
    Server._syncSettings();
  },

  setTroll(enabled) {
    state.settings.trollEnabled = enabled;
    Server._syncSettings();
  },

  selectPack(packId) {
    state.settings.wordPack = packId;
    UI.renderPackGrid('server-pack-grid');
    Server._syncSettings();
  },

  _syncSettings() {
    if (Server.ref && Server.isHost) {
      Server.ref.child('settings').set(state.settings);
    }
  },

  copyRoomLink() {
    const url = `${location.origin}${location.pathname}?room=${Server.roomCode}`;
    navigator.clipboard.writeText(url).then(() => {
      alert('Link copied to clipboard!');
    }).catch(() => {
      prompt('Copy this link:', url);
    });
  },

  _genQR() {
    const url = `${location.origin}${location.pathname}?room=${Server.roomCode}`;
    const box  = document.getElementById('qr-container');
    box.innerHTML = '';
    if (typeof QRCode !== 'undefined') {
      new QRCode(box, {
        text: url,
        width: 150,
        height: 150,
        colorDark: '#ffffff',
        colorLight: '#000000',
      });
    } else {
      box.innerHTML = `<p style="font-size:11px;color:var(--text-dim);word-break:break-all">${url}</p>`;
    }
  },
};

// ── URL ?room= auto-join ──────────────────────────────────────

function checkURLRoom() {
  const params = new URLSearchParams(location.search);
  const room   = params.get('room');
  if (room) {
    document.getElementById('join-code-input').value = room.toUpperCase();
    App.goTo('server-home');
  }
}

// ── CSS shake keyframe (injected) ────────────────────────────

const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%,100%{transform:translateX(0)}
    25%     {transform:translateX(-6px)}
    75%     {transform:translateX(6px)}
  }
`;
document.head.appendChild(shakeStyle);

// ── Event Delegation ─────────────────────────────────────────

document.addEventListener('click', e => {
  const t = e.target;

  // Remove-player chip button
  const removeBtn = t.closest('[data-remove]');
  if (removeBtn) { App.removePlayer(removeBtn.dataset.remove); return; }

  // Pack selection button
  const packBtn = t.closest('[data-pack]');
  if (packBtn) {
    const id   = packBtn.dataset.pack;
    const grid = packBtn.dataset.grid;
    if (grid === 'server-pack-grid') Server.selectPack(id);
    else App.selectPack(id);
    return;
  }

  // Player card — role reveal
  const playerCard = t.closest('#player-cards [data-player]');
  if (playerCard && !playerCard.classList.contains('eliminated')) {
    App.openRoleModal(playerCard.dataset.player);
    return;
  }

  // Voting card
  const voteCard = t.closest('#voting-cards [data-vote]');
  if (voteCard && !voteCard.classList.contains('eliminated')) {
    App.vote(voteCard.dataset.vote);
    return;
  }

  // Server host voting card (dynamic content inside server-player-content)
  const hostVoteCard = t.closest('[data-host-vote]');
  if (hostVoteCard) { Server.hostVote(hostVoteCard.dataset.hostVote); return; }
});

// ── Init ─────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('player-name-input');
  if (input) input.addEventListener('keydown', e => { if (e.key === 'Enter') App.addPlayer(); });

  App._initTheme();
  UI.renderPackGrid('pack-grid');
  checkURLRoom();
});
