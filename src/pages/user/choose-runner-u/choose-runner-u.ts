import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import firebase from 'firebase';

import { ConfirmRunnerUPage } from '../confirm-runner-u/confirm-runner-u'

/**
 * Generated class for the ChooseRunnerUPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-choose-runner-u',
  templateUrl: 'choose-runner-u.html',
})
export class ChooseRunnerUPage {
  usernamePassed: any;
  title: string;
  additional: string;
  uLat: any;
  uLng: any;
  tLat: any;
  tLng: any;
  distance: any;
  payment: any

  runnerNode: Array<{index: number, email: String, fullName: String, ic: number, password: String, phoneNum: number, username: String, availability: String, rating: number, deliveryCount: number}>=[];

  runnerNodeSearch: Array<{index: number, email: String, fullName: String, ic: number, password: String, phoneNum: number, username: String, availability: String, rating: number, deliveryCount: number}>=[];

  pathString: any;
  pathRef: any;

  public email=[];
  public fullName=[];
  public ic=[];
  public password=[];
  public phoneNum=[];
  public username=[];
  public availability=[];
  public rating=[];
  public deliveryCount=[];



  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events) {
    //get passed from last page..ins del info
    this.usernamePassed= navParams.get('username');
    this.title= navParams.get('title');
    this.additional= navParams.get('additional');
    this.uLat= navParams.get('uLat');
    this.uLng= navParams.get('uLng');
    this.tLat= navParams.get('tLat');
    this.tLng= navParams.get('tLng');
    this.distance= navParams.get('distance');
    this.payment= navParams.get('payment');

    this.pathString= `/runnerStorage/` ;
    this.pathRef= firebase.database().ref(this.pathString);

    //get all data
    this.pathRef.once('value', snapshot => {
      var index=0;
      snapshot.forEach(childSnapshot => {

        this.email[index]=  childSnapshot.child("/email/").val();
        this.fullName[index]=  childSnapshot.child("/fullName/").val();
        this.ic[index]=  childSnapshot.child("/ic/").val();
        this.password[index]=  childSnapshot.child("/password/").val();
        this.phoneNum[index]=  childSnapshot.child("/phoneNum/").val();
        this.username[index]=  childSnapshot.child("/username/").val();
        this.availability[index]= childSnapshot.child("/availability/").val();
        this.rating[index]= childSnapshot.child("/rating/").val();
        this.deliveryCount[index]= childSnapshot.child("/deliveryCount/").val();

        //push into array object
        if(this.availability[index]=="true"){
          this.runnerNode.push({index: (index+1), email: this.email[index], fullName: this.fullName[index], ic: this.ic[index], password: this.password[index], phoneNum: this.phoneNum[index], username: this.username[index], availability: this.availability[index], rating: this.rating[index], deliveryCount: this.deliveryCount[index]  });
        }
        index++;
      });
    });
    this.initializeRunnerSearch();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChooseRunnerUPage');
  }

  initializeRunnerSearch(){
    this.runnerNodeSearch=this.runnerNode;
  }

  getRunner(ev: any){
    // Reset items back to all of the items
    this.initializeRunnerSearch();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.runnerNodeSearch = this.runnerNodeSearch.filter((p) => {
        if(p.username!=null){
          return (p.username.toLowerCase().indexOf(val.toLowerCase()) > -1);
        }
      })
    }
  }

  confirm(usernameR){
    this.navCtrl.push(ConfirmRunnerUPage, {
      runner: <string>usernameR ,//pass runner selected
      username: this.usernamePassed,
      title: this.title,
      additional: this.additional,
      uLat: this.uLat,
      uLng: this.uLng,
      tLat: this.tLat,
      tLng: this.tLng,
      distance: this.distance,
      payment: this.payment
    });
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.runnerNode=[];
    //get all data
    this.pathRef.once('value', snapshot => {
      var index=0;
      snapshot.forEach(childSnapshot => {

        this.email[index]=  childSnapshot.child("/email/").val();
        this.fullName[index]=  childSnapshot.child("/fullName/").val();
        this.ic[index]=  childSnapshot.child("/ic/").val();
        this.password[index]=  childSnapshot.child("/password/").val();
        this.phoneNum[index]=  childSnapshot.child("/phoneNum/").val();
        this.username[index]=  childSnapshot.child("/username/").val();
        this.availability[index]= childSnapshot.child("/availability/").val();
        this.rating[index]= childSnapshot.child("/rating/").val();
        this.deliveryCount[index]= childSnapshot.child("/deliveryCount/").val();

        //push into array object
        if(this.availability[index]=="true"){
          this.runnerNode.push({index: (index+1), email: this.email[index], fullName: this.fullName[index], ic: this.ic[index], password: this.password[index], phoneNum: this.phoneNum[index], username: this.username[index], availability: this.availability[index], rating: this.rating[index], deliveryCount: this.deliveryCount[index]  });
        }
        index++;
      });
    });
    this.initializeRunnerSearch();

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

}
