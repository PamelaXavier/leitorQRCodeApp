import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { QRScanner} from '@ionic-native/qr-scanner/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

//imports do firebase

import { AngularFireModule } from  '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
     IonicModule.forRoot(), 
     AppRoutingModule,
     AngularFireModule.initializeApp(environment.firebaseConfig),
     AngularFireDatabaseModule,
     AngularFirestoreModule
  ],

  providers: [
    StatusBar,
    SplashScreen,
    QRScanner,
    ScreenOrientation,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
