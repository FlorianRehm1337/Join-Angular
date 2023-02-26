import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { InputService } from '../shared/services/input.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isChecked: boolean = false;
  email: string = '';
  password: string = '';

  constructor(public authservice: AuthService, public inputservice: InputService) { }

  ngOnInit(): void {

  }

  async logInUser() {
    if (this.isChecked) {
      this.authservice.rememberLogin = true;
    } else {
      this.authservice.rememberLogin = false;
    }

    await this.authservice.LogIn(this.email, this.password);
  }
}
