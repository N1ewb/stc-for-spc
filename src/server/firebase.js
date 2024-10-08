// Firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
  apiKey: "AIzaSyCwbUjWoy5niE46Gz68zvuBBjx-o7fghig",
  authDomain: "student-teacher-counseling-app.firebaseapp.com",
  projectId: "student-teacher-counseling-app",
  storageBucket: "student-teacher-counseling-app.appspot.com",
  messagingSenderId: "480363677981",
  appId: "1:480363677981:web:1ff4fa9a765337e2fa39f4",
};

const app = initializeApp(firebaseConfig);

//Need i catch error
const response = await fetch(
  "https://tscforspc.metered.live/api/v1/turn/credentials?apiKey=8883ab6c0b75e82a000f2975e6cb59499568"
);

const iceServers = await response.json();

export const firestore = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export const servers = {
  iceServers: iceServers && iceServers,
  iceCandidatePoolSize: 10,
};

export const pc = new RTCPeerConnection(servers);
