import 'dotenv/config';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, collection, query, orderBy, limit, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

console.log("Config loaded:", { projectId: firebaseConfig.projectId });

try {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  
  async function test() {
    console.log("Writing test document...");
    try {
      await setDoc(doc(db, 'leaderboard', 'test-entry-123'), {
        score: 99,
        displayName: "Bot",
        timestamp: Date.now()
      });
      console.log("Write success!");
      
      console.log("Querying leaderboard...");
      // Simulate the exact query
      const q = query(collection(db, 'leaderboard'), orderBy('score', 'desc'), limit(5));
      const snap = await getDocs(q);
      console.log(`Found ${snap.docs.length} documents.`);
      snap.docs.forEach(d => console.log(d.id, d.data().score, d.data().displayName));

      process.exit(0);
    } catch (e) {
      console.error("Firestore operation failed:", e);
      // Log the exact error code to see if it implies missing permissions or missing index
      if (e.code) console.error("Error code:", e.code);
      if (e.message) console.error("Error message:", e.message);
      process.exit(1);
    }
  }

  test();
} catch (err) {
  console.error("Init Error:", err);
  process.exit(1);
}
