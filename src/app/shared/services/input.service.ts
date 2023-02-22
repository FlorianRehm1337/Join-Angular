import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class InputService {


  name: string = '';
  email: string = '';
  password: string = '';
  phoneNumber: string = '';
  date: any;

  title: string = '';
  description: string = '';

  constructor(public authservice: AuthService) { }

  onChangeName(event: any) {
    this.authservice.loginFailed = false;
    this.name = event.value;
  }

  onChangeEmail(event: any) {
    this.authservice.loginFailed = false;
    this.email = event.value;
  }

  onChangePassword(event: any) {
    this.authservice.loginFailed = false;
    this.password = event.value;
  }

  onChangePhoneNumber(event: any) {
    this.phoneNumber = event.value;
  }

  onChangeTitle(event: any) {
    this.title = event.value;
  }

  onChangeDescription(event: any) {
    this.description = event.value;
  }

  onChangeDate(event: any){
    this.date = event.value;
  }


}
