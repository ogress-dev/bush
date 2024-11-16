// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyCOvFBKHaVgJaxbbzw4_EpBIxljKHTs_Go",
    authDomain: "ogres-beads-workshop.firebaseapp.com",
    databaseURL: "https://ogres-beads-workshop-default-rtdb.firebaseio.com",
    projectId: "ogres-beads-workshop",
    storageBucket: "ogres-beads-workshop.appspot.com",
    messagingSenderId: "433330029208",
    appId: "1:433330029208:web:fc6902f9960acf387b46ed",
    measurementId: "G-N201K0DCK3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


export { auth , db};

