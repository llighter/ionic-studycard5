import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private router: Router
    , private afAuth: AngularFireAuth
  ) { }

  async ngOnInit() {
    const user = await this.afAuth.currentUser;
    const isLoggedIn = !!user;

    if (isLoggedIn) {
      this.router.navigate(['']);
    }
  }

}
