// firebase-config.js — real Firebase project config
// Single-phone mode works without Firebase; Server Mode uses Realtime Database.
// Consolidated into the shared "game-suite" project (2026-07-16). Imposter data
// lives under rooms/<roomCode> in the game-suite default RTDB instance.
// Uses its own registered app ("Imposter", 2026-07-17) so it shows up as its
// own entry in Project Settings > Your apps, instead of the shared one.

const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyDoZTc3Vftb_ZEDtGRBMgxlJiqT-5B-URA",
  authDomain:        "game-suite-5d189.firebaseapp.com",
  databaseURL:       "https://game-suite-5d189-default-rtdb.firebaseio.com",
  projectId:         "game-suite-5d189",
  storageBucket:     "game-suite-5d189.firebasestorage.app",
  messagingSenderId: "130023825617",
  appId:             "1:130023825617:web:827fa4ae065caf52cd25f0",
  measurementId:     "G-1JP3XPRY30",
};

try {
  firebase.initializeApp(FIREBASE_CONFIG);
  // Server Mode's Realtime Database rules require auth != null (2026-07-17).
  // Sign in anonymously before any db.ref() calls; Server._db() awaits this.
  window.FIREBASE_AUTH_READY = firebase.auth().signInAnonymously()
    .catch(e => console.warn("Firebase anonymous sign-in failed:", e.message));
} catch (e) {
  console.warn("Firebase init:", e.message);
}
