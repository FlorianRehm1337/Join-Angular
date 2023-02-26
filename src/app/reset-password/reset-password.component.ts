import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  app = initializeApp(environment.firebase);
  auth = getAuth(this.app);
  params: any

  passwordIsNotEqual: boolean = false;

  resetPassword = new FormGroup({
    password: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(6),

    ])),
    confirmedPassword: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(6),
    ])),
  });

  constructor(public authservice: AuthService, public route: ActivatedRoute) {

  }

  async ngOnInit() {
    await this.getParameterByName();

  }

  async getParameterByName() {
    this.route.queryParams.subscribe(params => {
      this.params = params;
    })
  }

  async sendPasswordReset() {
    if (this.resetPassword.value.password == this.resetPassword.value.confirmedPassword) {
      await this.getParameterByName();
      this.authservice.resetPassword(this.params.oobCode, this.resetPassword.value.password)

    } else {
      this.passwordIsNotEqual = true;
    }
  }
}
