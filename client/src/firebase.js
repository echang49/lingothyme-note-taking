import firebase from "firebase/app";
import "firebase/auth";

const app = firebase.initializeApp({ // store 
    apiKey:process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain:REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId:REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket:REACT_APP_FIREBASE_STORAGE_BUCKET,
    messageSenderId: REACT_APP_FIREBASE_MESSAGE_SENDER_ID,
    appId: REACT_APP_FIREBASE_APP_ID,
    measurementId: REACT_APP_FIREBASE_MEASUREMENT_ID
});

export const auth = app.auth();
export default app;

