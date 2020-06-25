import { auth } from 'firebase/app';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { DbService } from './db.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Platform, LoadingController } from '@ionic/angular';

import { Observable, of } from 'rxjs';
import { switchMap, take, map } from 'rxjs/operators';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<any>;

  constructor(
    private afauth: AngularFireAuth
    , private db: DbService
    , private router: Router
    , private storage: Storage
    , private gplus: GooglePlus
    , private platform: Platform
    , private loadingController: LoadingController
  ) {
    this.user$ = this.afauth.authState.pipe(
      switchMap(user => {
        db.doc$(`users/${user.uid}`).subscribe(_ => console.log(_));
        return (user ? db.doc$(`users/${user.uid}`) : of(null))
      })
    );

    this.handleRedirect();
  }

  uid() {
    return this.user$
      .pipe(
        take(1),
        map(u => u && u.uid)
      )
      .toPromise();
  }

  async anonymousLogin() {
    const credential = await this.afauth.signInAnonymously();
    return await this.updateUserData(credential.user);
    
  }

  private updateUserData({ uid, email, displayName, photoURL, isAnonymous }) {
    const path = `users/${uid}`;

    const data = {
      uid
      , email
      , displayName
      , photoURL
      , isAnonymous
    };

    this.db.updateAt(path, data);
    return this.router.navigate(['/']);
  }

  async signOut() {
    await this.afauth.signOut();
    return this.router.navigate(['/']);
  }

  // GOOGLE AUTH

  setRedirect(val) {
    this.storage.set('authRedirect', val);
  }

  async isRedirect() {
    return await this.storage.get('authRedirect');
  }

  async googleLogin() {
    console.log(`[googleLogin] Start!`);
    try {
      let user;

      if (this.platform.is('cordova')) {
        console.log(`[googleLogin] cordova!`);
        user = await this.nativeGoogleLogin();
        console.log('googleLogin()');
      } else {
        console.log(`[googleLogin] web!`);
        this.setRedirect(true);
        const provider = new auth.GoogleAuthProvider();
        user = await this.afauth.signInWithRedirect(provider);
      }

      console.table(user);
      return await this.updateUserData(user);
    } catch (err) {
      console.log(err);
    }
  }

  // Handle login with redirect for web google auth
  private async handleRedirect() {
    if ((await this.isRedirect()) !== true) {
      return null;
    }
    const loading = await this.loadingController.create();
    await loading.present();

    const result = await this.afauth.getRedirectResult();

    if (result.user) {
      await this.updateUserData(result.user);
    }
    await loading.dismiss();

    await this.setRedirect(false);

    return result;
  }

  async nativeGoogleLogin(): Promise<any> {
    console.log('nativeGOogleLogin()');
    // const gplusUser = await this.gplus.login({
    //   webClientId:
    //     '549242650630-r48mvl89ddfd2ir6vvrlgaabahmbpb6m.apps.googleusercontent.com',
    //   offline: true,
    //   scope: 'profile email'
    // });
    // TODO: Check the option if necessary
    const gplusUser = await this.gplus.login({});

    console.table(gplusUser);
    return await this.afauth.signInWithCredential(
      auth.GoogleAuthProvider.credential(gplusUser.idToken)
    );
  }
}
