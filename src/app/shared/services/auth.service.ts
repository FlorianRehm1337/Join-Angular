import { Injectable } from '@angular/core';
import { sendPasswordResetEmail, onAuthStateChanged, browserSessionPersistence, setPersistence, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, browserLocalPersistence, confirmPasswordReset } from "firebase/auth";
import { collection, getDocs, doc, addDoc, updateDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})

export class AuthService {

  userData: any;
  loginFailed: boolean = false;
  rememberLogin: boolean = false;
  emailExists: boolean = false;
  resetEmailSent: boolean = false;
  emailSentError: boolean = false;
  newPasswordValid: boolean = false;
  app = initializeApp(environment.firebase);
  auth = getAuth(this.app);
  db = getFirestore(this.app);
  user = this.auth.currentUser;
  constructor(private router: Router) { }

  async checkAuthState() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        const uid = user.uid;
        return true;
      } else {
        this.auth.signOut();
        return false;
      }
    });
  }

  isLoggedIn() {
    if (this.user) {
      return true;
    } else {
      return false;
    }

  }

  async LogIn(email: string, password: string) {

    signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
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
        this.loginFailed = true;
      });
  }

  async loginAsGuest() {
    this.LogIn('guest123@test.de', '123456')
  }

  async forgetPassword(email: string) {
    sendPasswordResetEmail(this.auth, email)
      .then(() => {
        this.resetEmailSent = true;

        setTimeout(() => {
          this.resetEmailSent = false;
        }, 2000)
      })
      .catch((error) => {
        this.emailSentError = true;
      });
  }

  async resetPassword(actionCode: string, newPassword: string) {
    confirmPasswordReset(this.auth, actionCode, newPassword).then(() => {
      this.newPasswordValid = true;

      setTimeout(() => {
        this.router.navigateByUrl('/login');
        this.newPasswordValid = false;
      }, 2000)
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  }

  async SignUp(username: string, email: string, password: string) {

    createUserWithEmailAndPassword(this.auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        await this.addNewUser(user, username);
        this.LogIn(email, password);

      })
      .catch((error) => {
        this.emailExists = true;
        const errorCode = error.code;
        const errorMessage = error.message;

      });
  }

  stayLoggedIn(user: any) {
    setPersistence(this.auth, browserLocalPersistence) //Local -> bleibt eingeloggt bis speziell logout() ausgeführt wird
      .then(() => {
        return signInWithEmailAndPassword(this.auth, user.email, user.password);
      })
      .catch((error) => {
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
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }


  async setUserData(user: any) {

    const querySnapshot = await getDocs(collection(this.db, "Users"));
    querySnapshot.forEach((document) => {
      let docInQueue = document.data();
      if (docInQueue['uid'] == user.uid) {

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
      contacts: [{
        color: "#490B9B",
        email: user.email,
        name: username,
        phoneNumber: ""
      }],
      allTasks: [],
      emailVerified: user.emailVerified,
      rememberLogin: this.rememberLogin,
    });
  }
}

