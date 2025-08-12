import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { UtilsModule } from './utils/utils.module';
import { SharedModule } from './shared/shared.module';
import { IonicStorageModule } from '@ionic/storage-angular';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { NativeGeocoder } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { googleAdmod } from 'capacitor-admob-keder';

const config: SocketIoConfig = { url: environment.apiSocket, options: {} };
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
       IonicModule.forRoot({
      mode: 'ios'
    }),
    AppRoutingModule,
    HttpClientModule,
    UtilsModule,
    SharedModule,
    SocketIoModule.forRoot(config),
    IonicStorageModule.forRoot(),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
  ],
  providers: [
    DatePipe,
    Geolocation,
    NativeGeocoder,
    { provide: 'googleAdmod', useValue: googleAdmod },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
