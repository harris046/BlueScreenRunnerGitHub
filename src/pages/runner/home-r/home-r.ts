import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Events } from 'ionic-angular';

/**
 * Generated class for the HomeRPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home-r',
  templateUrl: 'home-r.html',
})
export class HomeRPage {
  activeMenu: string = 'menu-r'

  constructor(public navCtrl: NavController, public navParams: NavParams, private menu: MenuController, public events: Events) {
    this.activeMenu= 'menu-r' ;
    this.menu.enable(false, 'menu-a');
    this.menu.enable(true, 'menu-r') ;
    this.menu.enable(false, 'menu-u');

    events.publish('user:entered');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomeRPage');
  }

}
