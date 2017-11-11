import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import firebase from 'firebase';
import { AlertController } from 'ionic-angular';

import { HomeUPage } from '../home-u/home-u';
import { HomeAPage } from '../../admin/home-a/home-a';
import { SignUpUPage } from '../sign-up-u/sign-up-u';
/**
 * Generated class for the SignInUPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sign-in-u',
  templateUrl: 'sign-in-u.html',
})
export class SignInUPage {
  username:any;
  password: any;
  pathString: any;
  pathStringA: any;

  usernameRef: firebase.database.Reference;
  passwordRef: firebase.database.Reference;
  usernameARef: firebase.database.Reference;
  passwordARef: firebase.database.Reference;


  public Username= {};
  public Password= {};
  public UsernameA= {};
  public PasswordA= {};

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, public loadingCtrl: LoadingController, public events: Events) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignInUPage');
  }

  async itemTapped() {
    this.username= (<HTMLInputElement>document.getElementById('usernameU')).value;
    this.password= (<HTMLInputElement>document.getElementById('passwordU')).value;
    this.pathString = `/userStorage/`+ this.username+ `/` ;
    this.pathStringA= `/adminStorage/`+ this.username+ `/` ;

    //user data
    this.usernameRef=  firebase.database().ref(this.pathString+'username/');
    this.usernameRef.on('value', dataSnapshot => {
      this.Username = dataSnapshot.val();
    })
    this.passwordRef=  firebase.database().ref(this.pathString+'password/');
    this.passwordRef.on('value', dataSnapshot => {
      this.Password = dataSnapshot.val();
    })

    //admin data
    this.usernameARef=  firebase.database().ref(this.pathStringA+'username/');
    this.usernameARef.on('value', dataSnapshot => {
      this.UsernameA = dataSnapshot.val();
    })
    this.passwordARef =  firebase.database().ref(this.pathStringA+'password/');
    this.passwordARef.on('value', dataSnapshot => {
       this.PasswordA = dataSnapshot.val();
    })

    this.loadingfunc(); //loading spinner
    await this.delay(5000); //wait 5sec

    if(this.Username && this.Password==this.password){//user
      this.events.publish("username", this.username);
      this.navCtrl.setRoot(HomeUPage, {
        username: <String> this.Username
      });
    }
    else if(this.UsernameA && this.PasswordA==this.password){//admin
      this.events.publish("username", this.username);
      this.navCtrl.setRoot(HomeAPage, {
        username: <String> this.UsernameA
      });
    }
    else{
      this.presentAlert();
      this.navCtrl.setRoot(SignInUPage);
    }

  }

  buttonRegister(event, item){
       this.navCtrl.setRoot(SignUpUPage);
  }

  presentAlert() {
   let alert = this.alertCtrl.create({
     title: 'Wrong Username And Password',
     subTitle: 'Please Try Again',
     buttons: ['Dismiss']
  });
   alert.present();
  }

  delay(ms: number) {
     return new Promise(resolve => setTimeout(resolve, ms));
  }

  loadingfunc() {
    let loading = this.loadingCtrl.create({

      spinner: 'ios',
      dismissOnPageChange: true,
      content: 'Signing in...'
    });

    loading.present();

    setTimeout(() => {
      loading.dismiss();
    }, 5000);
  }
}
