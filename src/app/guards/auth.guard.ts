import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router
    , private afAuth: AngularFireAuth
  ) {

  }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
      const user = await this.afAuth.currentUser;
      const isLoggedIn = !!user;

      if (!isLoggedIn) {
        console.log(`isLoggedIn: ${isLoggedIn}`);
        this.router.navigate(['login']);
      }
      
      return isLoggedIn;
  }
  
}
