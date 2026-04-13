import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDZbFwHsOZqkP_VeUhrwUSz9Se2S6M05xA",
  authDomain: "netflix-clone-js-2ed33.firebaseapp.com",
  projectId: "netflix-clone-js-2ed33",
  storageBucket: "netflix-clone-js-2ed33.firebasestorage.app",
  messagingSenderId: "511346986494",
  appId: "1:511346986494:web:4151572a59ad61857ec4af",
  measurementId: "G-5PHJ9HGW6N"
};

const app = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app)