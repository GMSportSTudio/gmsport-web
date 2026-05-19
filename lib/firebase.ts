import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey:            "AIzaSyCP5s4LnjL1UQFnqwrpRt87V86-XbGH4nA",
  authDomain:        "gmsportstudio-53bbf.firebaseapp.com",
  databaseURL:       "https://gmsportstudio-53bbf-default-rtdb.europe-west1.firebasedatabase.app",
  projectId:         "gmsportstudio-53bbf",
  storageBucket:     "gmsportstudio-53bbf.firebasestorage.app",
  messagingSenderId: "1070417059015",
  appId:             "1:1070417059015:web:2ddfc86485f26791cc32e2",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth      = getAuth(app);
export const db        = getFirestore(app);
export const functions = getFunctions(app, "europe-west1");

// Homogeneización 2026-05-19 (task #40): las callables grantFreeAccess,
// revokeFreeAccess y claimGumroadPurchase se movieron de us-central1 a
// europe-west1 añadiendo region: "europe-west1" al onCall() en el lado
// servidor. El export `functionsUS` quedó sin clientes y se eliminó
// para evitar que futuros callers se confundan apuntando a una región
// que ya no tiene funciones desplegadas.
