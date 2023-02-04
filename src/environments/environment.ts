import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const environment = {
  firebase: {
    projectId: 'join-17d18',
    appId: '1:1053267080017:web:c7b46288b3f3bc16329970',
    storageBucket: 'join-17d18.appspot.com',
    locationId: 'europe-west',
    apiKey: 'AIzaSyDklvMEh-n1sE11KhSKOFFqHtjgYj_Bzwc',
    authDomain: 'join-17d18.firebaseapp.com',
    messagingSenderId: '1053267080017',
  },
  production: false
};

const app = initializeApp(environment.firebase);
const auth = getAuth(app);
const db = getFirestore(app);

export {auth,db}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
