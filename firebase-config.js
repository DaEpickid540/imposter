// firebase-config.js — real Firebase project config
// Single-phone mode works without Firebase; Server Mode uses Realtime Database.

const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyChttrW8TpeblnuI0hXVjERqjRObFpDdXc",
  authDomain:        "imposter-web-game.firebaseapp.com",
  databaseURL:       "https://imposter-web-game-default-rtdb.firebaseio.com",
  projectId:         "imposter-web-game",
  storageBucket:     "imposter-web-game.firebasestorage.app",
  messagingSenderId: "451645504652",
  appId:             "1:451645504652:web:8a566e03db50f090c8cfa9",
};

try {
  firebase.initializeApp(FIREBASE_CONFIG);
} catch (e) {
  console.warn("Firebase init:", e.message);
}
