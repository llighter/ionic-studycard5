import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router
    , private auth: AuthService
  ) {

  }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
      const uid = await this.auth.uid();
      const isLoggedIn = !!uid;

      if (!isLoggedIn) {
        console.log(`isLoggedIn: ${isLoggedIn}`);
        this.router.navigate(['login']);
      }
      
      return isLoggedIn;
  }
  
}
