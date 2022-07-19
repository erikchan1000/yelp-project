import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyBo2MJLYaAJKor6enNHeY6NM_iAnLQpDzY",
    authDomain: "yelp-notifications.firebaseapp.com",
    projectId: "yelp-notifications",
    storageBucket: "yelp-notifications.appspot.com",
    messagingSenderId: "394925608644",
    appId: "1:394925608644:web:3ebc38b937d6a7a3064391"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;

export const db = getFirestore(app);

export const auth = getAuth();