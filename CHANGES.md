# CHANGES

## v1.0.0 — 2026-07-02 — Initial release

### HTML (structure)
- Home screen with Single Phone / Server Mode buttons
- Setup screen: player name entry, word pack selector grid, imposter count counter, hint/no-hint toggle, troll toggle
- Player list screen: card grid, sticky header with pack name and round number, Vote button
- Role reveal modal: two-step flow (pre-reveal → tap → show role + word)
- Voting screen: same card grid with eliminate action
- Vote result modal: shows icon, name, and verdict (INNOCENT / IMPOSTER / TROLL)
- End screen: result banner, word reveal box, full role list with color coding
- Server Mode home: create room or join by code
- Server lobby (host): room code display, QR code, live player list, game settings, Start button
- Server player view: dynamic content — waiting → role reveal → voting panel

### CSS (design)
- Pure black `#000` background throughout
- White text only — no color until End Screen
- Inter font (Google Fonts), system-ui fallback
- Cards: `#0d0d0d` background, `#222` border, 14px rounded corners
- Modals: `rgba(0,0,0,0.92)` backdrop, `#0d0d0d` panel
- Buttons: white-on-dark, white border, no decorative color
- Minimum 56px tap targets on all interactive elements
- Smooth 0.22s fade + translateY screen transitions, 0.2s modal transitions
- Mobile-first layout, responsive grid breakpoints at 480px and 700px
- End Screen: red `#e53935` for imposters, gold `#f5c518` for troll, white for crewmates
- CSS shake animation for duplicate player name rejection

### JS (game logic)
- `word-packs.js`: 13 packs × 10 words each (8 standard + 5 funny)
- Role assignment: Fisher-Yates shuffle, N imposters + optional troll + remaining crewmates
- Hint mode: imposter sees hint word or `???` depending on setting
- Troll: gets the real word, shown in gold on end screen
- Modal flow: player taps card → pre-reveal overlay → "Tap to Reveal" → role + word shown → "Done"
- Voting: eliminate players, vote result modal, end condition checked after each vote
- End conditions: all imposters caught (crew wins) or imposters ≥ crew (imposters win)
- "Play Again" increments round number, reshuffles roles with same players/settings
- Event delegation throughout — no inline `onclick` with interpolated strings
- URL `?room=XXXXX` auto-populates join code for Server Mode
- CSS.escape() used for data-attribute selectors

### Firebase (Server Mode)
- Project: `imposter-web-game` (Firebase Console)
- Realtime Database: `imposter-web-game-default-rtdb.firebaseio.com`
- Room structure: `rooms/{code}` → host, status, players, roles, settings, word
- Host creates room with 6-char alphanumeric code, sets onDisconnect().remove()
- Players join by code, added to `players/` node
- Host starts game: roles assigned server-side, written to `rooms/{code}/roles`
- Non-host players see their role on their own device when status → 'playing'
- Host eliminates players from game view, checks end conditions, sets status → 'ended'
- QR code generated for join link using qrcode.js CDN
- Firebase Hosting deployed at: https://imposter-web-game.web.app

### Deployment
- Firebase Hosting: `firebase deploy --project imposter-web-game`
- Live URL: https://imposter-web-game.web.app
- GitHub: https://github.com/DaEpickid540/imposter
