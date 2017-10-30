import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {HomeRPage} from '../home-r/home-r'

/**
 * Generated class for the SignInPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sign-in',
  templateUrl: 'sign-in-r.html',
})
export class SignInRPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignInPage');
  }

  itemTapped(event, item) {
  //  this.navCtrl.push(HomePage);
    this.navCtrl.setRoot(HomeRPage);
  }
}
