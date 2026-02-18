import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "PAIzaSyA-nupIhuiDa6sB2Tn_070zwmBZN-2S2k4",
  authDomain: "reuse-mart-1f586.firebaseapp.com",
  projectId: "reuse-mart-1f586",
  storageBucket: "reuse-mart-1f586.firebasestorage.app",
  messagingSenderId: "416066846360",
  appId: "1:416066846360:web:e76b9cb824b5ee708b1aed"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
