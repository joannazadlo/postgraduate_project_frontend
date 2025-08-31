import { initializeApp } from "firebase/app";

import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDcCS4BvzYSL7WAB1n1HObUoMIW0P9ZdHk",
  authDomain: "my-first-project-b6175.firebaseapp.com",
  projectId: "my-first-project-b6175",
  storageBucket: "my-first-project-b6175.firebasestorage.app",
  messagingSenderId: "706159490727",
  appId: "1:706159490727:web:e5c51f1e98693f35378d82"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth };
