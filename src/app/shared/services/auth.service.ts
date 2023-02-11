import { Injectable } from '@angular/core';
import { User } from '../services/user';
import { sendPasswordResetEmail, onAuthStateChanged, browserSessionPersistence, setPersistence, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, browserLocalPersistence } from "firebase/auth";
import { collection, getDocs, query, where, doc, addDoc, getDoc, updateDoc, DocumentReference } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class AuthService{

  userData: any;
  loginFailed: boolean = false;
  rememberLogin: boolean = false;
  auth = getAuth();
  user = this.auth.currentUser;
  constructor(private router: Router) {

  }


  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);

  async checkAuthState() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        console.log(user);
        const uid = user.uid;
        console.log(uid)
        return true;
        // ...
      } else {
        console.log(user)
        this.auth.signOut();
        console.log("User is signed out");
        return false;
        // User is signed out
        // ...
      }
    });
  }

  isLoggedIn(){
    console.log(this.user);
    if (this.user) {
      return true;
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      // ...
    } else {
      return false;
      // No user is signed in.
    }

  }

  async LogIn(email: string, password: string) {

    signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        debugger;
        const user = userCredential.user;
        if (user) {
          this.setUserData(user)
          this.loginFailed = false;
          this.router.navigate(['summary/']);
        }
        if (this.rememberLogin) {
          this.stayLoggedIn(user)
        } else {
          this.stayLoggedInForCurrentSession(user)
        }
      })
      .catch((error) => {
        /* window.alert(error.message); */
        this.loginFailed = true;
      });
  }

  async loginAsGuest() {
    this.LogIn('guest123@test.de','123456')
  }

  async resetPassword(email:string){
    sendPasswordResetEmail(this.auth, email)
      .then(() => {
        console.log("Password reset email sent");
        // Password reset email sent!
        // ..
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  }

  async SignUp(username: string, email: string, password: string) {

    createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // Signed in
        debugger;
        const user = userCredential.user;
        console.log(user, username);
        this.addNewUser(user, username);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  }

  stayLoggedIn(user: any) {
    setPersistence(this.auth, browserLocalPersistence) //Local -> bleibt eingeloggt bis speziell logout() ausgeführt wird
      .then(() => {
        return signInWithEmailAndPassword(this.auth, user.email, user.password);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }

  stayLoggedInForCurrentSession(user: any) {
    setPersistence(this.auth, browserSessionPersistence) //Session -> bleibt eingeloggt bis speziell logout() ausgeführt wird oder Tab geschlossen wird
      .then(() => {
        return signInWithEmailAndPassword(this.auth, user.email, user.password);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }


  async setUserData(user: any) {
    debugger;

    const querySnapshot = await getDocs(collection(this.db, "Users"));
    querySnapshot.forEach((document) => {
      let docInQueue = document.data();
      if (docInQueue['uid'] == user.uid) {
        console.log(document.data()['email']);

        const userData = {
          uid: document.data()['uid'],
          email: document.data()['email'],
          displayName: document.data()['displayName'],
          contacts: document.data()['contacts'],
          allTasks: document.data()['allTasks'],
          emailVerified: document.data()['emailVerified'],
          rememberLogin: this.rememberLogin,
        };
        const docRef = doc(this.db, "Users", document.id);
        updateDoc(docRef, userData);

      }
    });
  }

  async addNewUser(user: any, username: string) {

    const docRef = await addDoc(collection(this.db, "Users"), {
      uid: user.uid,
      email: user.email,
      displayName: username,
      contacts: [],
      allTasks: [],
      emailVerified: user.emailVerified,
      rememberLogin: this.rememberLogin,
    });
    console.log("Document written with ID: ", docRef.id);
  }

  /* async addGuestUser(user: any, username: string) {

    const docRef = await addDoc(collection(this.db, "Users"), {
      uid: user.uid,
      displayName: username,
      contacts: ['Max Mustermann','Anold Schwarzenegger','Angela Merkel','Tony Test'],
      allTasks: [{
        "title": "Mustertask",
        "description": "Test description",
        "category": "Development",
        "assignee": ['Max Mustermann', 'Anold Schwarzenegger'],
        "date": "01.02.2015",
        "prio": "medium",
        "status": "todo",
        "subtasks": ['Subtask 1', 'Subtask 2'],
      }],
    });
    console.log("Document written with ID: ", docRef.id);
  } */
}

