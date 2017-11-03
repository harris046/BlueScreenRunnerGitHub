import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MenuController } from 'ionic-angular';
import firebase from 'firebase';
import { AlertController } from 'ionic-angular';

import { HomeAPage } from '../pages/admin/home-a/home-a';
import { ListPage } from '../pages/list/list';
import { FrontPage } from '../pages/front/front';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = FrontPage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public menuCtrl: MenuController) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomeAPage },
      { title: 'List', component: ListPage },
      { title: 'Sign Out', component: FrontPage },
    ];

    firebase.initializeApp({
      apiKey: "AIzaSyB4gM65eE1RYXe3gc7nAMqV1IWZqjODPXw",
      authDomain: "bluescreenrunner.firebaseapp.com",
      databaseURL: "https://bluescreenrunner.firebaseio.com",
      projectId: "bluescreenrunner",
      storageBucket: "bluescreenrunner.appspot.com",
      messagingSenderId: "833160565470"
    });
  }


  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  openMenu() {
   this.menuCtrl.open();
 }

 closeMenu() {
   this.menuCtrl.close();
 }

 toggleMenu() {
   this.menuCtrl.toggle();
 }

 justOpenPage(page){
   this.nav.setRoot(page);
 }

}
