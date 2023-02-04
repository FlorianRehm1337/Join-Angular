import { Injectable } from "@angular/core";
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { AuthService } from "./auth.service";
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router, private afAuth: AngularFireAuth) { }

  canActivate(): Observable<boolean> {
    return this.afAuth.authState.pipe(map((user) => {
      if (user) {
        return true;
      }
      this.router.navigate(['/login'])
      return false;
    }))
  }


}
