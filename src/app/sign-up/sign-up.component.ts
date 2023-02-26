import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { InputService } from '../shared/services/input.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  signupForm = new FormGroup({
    name: new FormControl('', Validators.compose([
      Validators.pattern(/^[A-Z]+[a-zßäöü]+ [A-Z]+[a-zßäöü]+$/),
      Validators.minLength(5),
      Validators.maxLength(20),
      Validators.required
    ])),
    email: new FormControl('', Validators.compose([
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
      Validators.minLength(6),
      Validators.required
    ])),
    password: new FormControl('', Validators.compose([
      /* Validators.pattern('[a-zA-Z]+[a-zA-Z0-9-]'), */
      Validators.minLength(6),
      Validators.maxLength(20),
      Validators.required
    ])),
  });

  constructor(public authservice: AuthService, public inputservice: InputService) { }

  ngOnInit(): void {
  }



  async createNewUser() {
    await this.authservice.SignUp(this.inputservice.name, this.inputservice.email, this.inputservice.password);
    this.signupForm.reset();
  }

}
