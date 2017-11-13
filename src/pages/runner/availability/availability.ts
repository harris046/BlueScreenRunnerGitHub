import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events } from 'ionic-angular';
import firebase from 'firebase';
import { HomeRPage} from '../home-r/home-r';

/**
 * Generated class for the AvailabilityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-availability',
  templateUrl: 'availability.html',
})
export class AvailabilityPage {
  isToggled: boolean;

  pathString: any;
  usernamePassed: any;

  dataRef: firebase.database.Reference;

  constructor(public alertCtrl: AlertController, navCtrl: NavController, public navParams: NavParams, public events: Events) {
    //get passed username
    this.usernamePassed= navParams.get('username');

    //set pathstring to the current username
    this.pathString = `/runnerStorage/`+ this.usernamePassed+ `/` ;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AvailabilityPage');
  }

  availableToggled(){
    this.dataRef= firebase.database().ref(this.pathString);

    //should put if here if toggle on , set true. else false
    this.dataRef.update({
    availability: "true"
    })
  }

  getAvailability(){

  }
}
