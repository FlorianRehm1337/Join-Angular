import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  email:string = '';
  constructor(public authservice: AuthService) { }

  ngOnInit(): void {
  }

  sendEmail(){
    this.authservice.forgetPassword(this.email)
  }

  resetError(){
    this.authservice.emailSentError = false;
  }

}
