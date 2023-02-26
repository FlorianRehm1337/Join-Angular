import { Injectable } from '@angular/core';
import { collection, query, where, getDocs, getDoc, doc, updateDoc, getFirestore } from "firebase/firestore";
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  currentUserDocID: any;
  currentUserData : any;
  tasksTodo: any[] = [];
  tasksInProgress: any[] = [];
  tasksAwaitingFeedback: any[] = [];
  tasksDone: any[] = [];

  app = initializeApp(environment.firebase);
  auth = getAuth(this.app);
  db = getFirestore(this.app);

  constructor(private authService: AuthService) {}

  async getCurrentuser(){
    const currentUserEmail = this.authService.auth.currentUser?.email;
    const querySnapshot = await getDocs(collection(this.db, 'Users'));
    querySnapshot.forEach((doc) => {
      if (doc.data()['email'] === currentUserEmail) {
        this.currentUserDocID = doc.id;
        this.currentUserData = doc.data();
      }
    });
  }

  async updateUserContacts(contactsArray: Array<any>){
    const contactsRef = doc(this.db, 'Users', this.currentUserDocID);
    await updateDoc(contactsRef, {
      contacts: contactsArray
    });
  }

  async updateUserCategories(categoriesArray: Array<any>) {
    const contactsRef = doc(this.db, 'Users', this.currentUserDocID);
    await updateDoc(contactsRef, {
      categories: categoriesArray
    });
  }

  async updateUserTasks(tasksArray: Array<any>) {
    const contactsRef = doc(this.db, 'Users', this.currentUserDocID);
    await updateDoc(contactsRef, {
      allTasks: tasksArray
    });
  }
}
