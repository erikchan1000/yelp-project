import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth";
import {getMessaging, onMessage, getToken} from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyA9YHhGf_mrToG3ltlLQPWW2PkymmkI58s",
    authDomain: "yelp-testing-fc2be.firebaseapp.com",
    projectId: "yelp-testing-fc2be",
    storageBucket: "yelp-testing-fc2be.appspot.com",
    messagingSenderId: "785577067867",
    appId: "1:785577067867:web:afa660dcbb41559138867e",
    measurementId: "G-X1QG4YTM2D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;

export const db = getFirestore(app);

export const auth = getAuth();

export const messaging = getMessaging(app);

const publicKey = "BGKgvq0fjunMJ-BMVp3yOpUs05ounl2lrxIydQWfihkzHp_-Oe2KZ0y--HsRw8HQcaBF5TGp4zCUlMpyW5xJ6t_xRvEFh_InQUauM"

export const getMyToken = async (setTokenFound) => {
    let currentToken = ''

    try {
        currentToken = await getToken(messaging, {publicKey})
        if (currentToken) {
            setTokenFound(true)
        } else {
            setTokenFound(false)
        }
    }
    catch (err) {
        console.log(err)
    }
    return currentToken
}


export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
});

