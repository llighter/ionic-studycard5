import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
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

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule
    , IonicModule.forRoot()
    , AppRoutingModule
    , AngularFireModule.initializeApp(environment.firebaseConfig)
    , AngularFireAuthModule
    , AngularFirestoreModule
    , IonicStorageModule.forRoot()
  ],
  providers: [
    Firebase,
    StatusBar,
    GooglePlus,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
