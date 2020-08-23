import { NgModule, Injectable } from '@angular/core';
import { BrowserModule, HammerModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Firebase } from "@ionic-native/firebase/ngx";
import { GooglePlus } from "@ionic-native/google-plus/ngx";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { IonicStorageModule } from "@ionic/storage";
import { environment } from 'src/environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';

import * as Hammer from 'hammerjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any> {
    // override hammerjs default configuration
    'swipe': { direction: Hammer.DIRECTION_ALL }
  };
}


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule
    , HammerModule
    , IonicModule.forRoot()
    , AppRoutingModule
    , AngularFireModule.initializeApp(environment.firebaseConfig)
    , AngularFireAuthModule
    , AngularFirestoreModule
    , IonicStorageModule.forRoot(), ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }), BrowserAnimationsModule
  ],
  providers: [
    Firebase,
    StatusBar,
    GooglePlus,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
