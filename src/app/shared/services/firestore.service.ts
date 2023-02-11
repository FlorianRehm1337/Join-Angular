import { Injectable } from '@angular/core';
import { collection, query, where, getDocs, getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  currentUserDocID: any;
  currentUserData : any;
  constructor(private authService: AuthService) {


  }

  async getCurrentuser(){
    const currentUserEmail = this.authService.auth.currentUser?.email;
    const querySnapshot = await getDocs(collection(db, 'Users'));
    querySnapshot.forEach((doc) => {
      if (doc.data()['email'] === currentUserEmail) {
        this.currentUserDocID = doc.id;
        this.currentUserData = doc.data();
        console.log(this.currentUserDocID);
      }
    });
  }

  async updateUserContacts(contactsArray: Array<any>){
    const contactsRef = doc(db, 'Users', this.currentUserDocID);
    await updateDoc(contactsRef, {
      contacts: contactsArray
    });
  }
}
