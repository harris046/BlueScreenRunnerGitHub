import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController  } from 'ionic-angular';
import { ChooseRunnerUPage } from '../choose-runner-u/choose-runner-u';
import { ChatUPage } from '../chat-u/chat-u';
import { HomeUPage } from '../home-u/home-u';

import firebase from 'firebase';

import {
 GoogleMaps,
 GoogleMap,
 GoogleMapsEvent,
 GoogleMapOptions,
 CameraPosition,
 MarkerOptions,
 Marker,
 LatLng
} from '@ionic-native/google-maps';

declare var google;

/**
 * Generated class for the DispCurrentDelUPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-disp-current-del-u',
  templateUrl: 'disp-current-del-u.html',
})
export class DispCurrentDelUPage {
  @ViewChild('map')
  private mapElement: ElementRef;
  map:any;
  private location:LatLng;
  markers: any;

  usernamePassed: any;

  //user
  userNode: Array<{currentDelivery: string, username: string}>=[];

  public currentDelivery=[];
  public username=[];

  public Cur={};

  pathString: any;
  pathRef: firebase.database.Reference;

  //delivery
  deliveryNode: Array<{accepted: string, additional: string, runnerUsername: string, title: string, userUsername: string, payment: string, distance: string, tLat: number, tLng: number, uLat: number, uLng: number, rLat: number, rLng: number}>=[];

  public accepted={};
  public additional={};
  public runnerUsername={};
  public title={};
  public userUsername={};
  public distance={};
  public payment={};
  public uLat={};
  public uLng={};
  public tLat={};
  public tLng={};
  public rLat={};
  public rLng={};
  key: string;

  delString: any;
  delRef: firebase.database.Reference;

  accRef: firebase.database.Reference;
  addRef: firebase.database.Reference;
  rURef: firebase.database.Reference;
  titleRef: firebase.database.Reference;
  uURef: firebase.database.Reference;


  haveAcc=0;
  havePen=0;
  haveRej=0;

  uLoc: LatLng;
  tLoc: LatLng;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController) {




  }

    async ionViewDidLoad() {
    console.log('ionViewDidLoad DispCurrentDelUPage');
    //get username from last page..homeu
    this.usernamePassed= this.navParams.get('username');

    //getdata AND CREATE MAP INSIDE THAT FUNC.....
    this.getData();

    await this.delay(1000); //wait




  }

  addMap(lat,long){

    let latLng = new google.maps.LatLng(lat, long);


    let mapOptions = {
    center: latLng,
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.addMarker(lat, long, "RUNNER");

  }

  addMarker(lat, lng, des){

    let marker = new google.maps.Marker({
    map: this.map,
    //animation: google.maps.Animation.DROP,
    position: {lat: lat, lng: lng}
    });
    this.markers= marker;

    let infoWindow = new google.maps.InfoWindow({
    content: des
    });

    google.maps.event.addListener(marker, 'click', () => {
    infoWindow.open(this.map, marker);
    });


  }

  async getData(){
    //get user data
    this.pathString= `/userStorage/`+this.usernamePassed+ `/`;

    var Cur;
    this.pathRef= firebase.database().ref(this.pathString+ 'currentDelivery/');
    this.pathRef.on('value', snapshot =>  {
      this.Cur = snapshot.val();

    });

    await this.delay(1000); //wait

    //get del data
    this.delString=`/deliveryStorage/`+ <string>this.Cur+ `/`;

    this.accRef= firebase.database().ref(this.delString+ 'accepted');
    this.accRef.on('value', snapshot => {
      this.accepted= snapshot.val();
    });

    this.addRef= firebase.database().ref(this.delString+ 'additional');
    this.addRef.on('value', snapshot => {
      this.additional= snapshot.val();
    });

    //get runner username, then location
    this.rURef= firebase.database().ref(this.delString+ 'runnerUsername');
    this.rURef.on('value', async snapshot => {
      this.runnerUsername= snapshot.val();

      var rPath= `/runnerStorage/`+ <string>this.runnerUsername+ `/`;
      var rRef= firebase.database().ref(rPath);

      //to create map
      rRef.on('value', async snap => {
      var rLat= snap.child("/rLat/").val();
      var rLng= snap.child("/rLng/").val();

      //CREATE MAP HERE

      console.log("rLat: "+ rLat)
      this.addMap(rLat, rLng);

      //get direction
      //set path
      var uLat= snap.child("/uLat/").val();
      var uLng= snap.child("/uLng/").val();
      var tLat= snap.child("/tLat/").val();
      var tLng= snap.child("/tLng/").val();

      //set uLoc n tLoc
      this.uLoc= new google.maps.LatLng(<number> uLat, <number> uLng);
      this.tLoc= new google.maps.LatLng(<number> tLat, <number> tLng);

      this.deleteMarkers();
      this.addMarker(rLat, rLng, "RUNNER");

      console.log("uLoc: "+ this.uLoc)
      console.log("tLoc: "+ this.tLoc)

      var dir= new google.maps.DirectionsService;
      var dirDisplay = new google.maps.DirectionsRenderer;
      dirDisplay.setMap(this.map);

      dir.route({
          origin: this.tLoc,
          destination: this.uLoc,
          travelMode: 'DRIVING'
        }, function(response, status) {
          if (status === 'OK') {
            dirDisplay.setDirections(response);
          } else {
            //window.alert('Directions request failed due to ' + status);
          }
        });
      })
      await this.delay(6000); //wait
      rRef.off();


      var rPath2= `/runnerStorage/`+ <string>this.runnerUsername+ `/`;
      var rRef2= firebase.database().ref(rPath2);
      rRef2.on('value', snap => {
        //update at map
        var rLat= snap.child("/rLat/").val();
        var rLng= snap.child("/rLng/").val();

        this.deleteMarkers();
        this.addMarker(rLat, rLng, "RUNNER");

        })


      //to update RUNNER marker to current position
      /*
      var rPath2= `/runnerStorage/`+ <string>this.runnerUsername+ `/`;
      var rRef2= firebase.database().ref(rPath2);
      rRef2.on('value', snap => {

        rRef.off();

        //update at map
        var rLat= snap.child("/rLat/").val();
        var rLng= snap.child("/rLng/").val();

        this.deleteMarkers();
        this.addMarker(rLat, rLng, "RUNNER");


      })
      */


    });

    this.titleRef= firebase.database().ref(this.delString+ 'title');
    this.titleRef.on('value', snapshot => {
      this.title= snapshot.val();
    });

    this.uURef= firebase.database().ref(this.delString+ 'userUsername');
    this.uURef.on('value', snapshot => {
      this.userUsername= snapshot.val();
    });

    //this.uURef= firebase.database().ref(this.delString+ 'userUsername');
    firebase.database().ref(this.delString+ 'distance').on('value', snapshot => {
      this.distance= snapshot.val();
    });

    firebase.database().ref(this.delString+ 'payment').on('value', snapshot => {
      this.payment= snapshot.val();
    });

    firebase.database().ref(this.delString+ 'uLat').on('value', snapshot => {
      this.uLat= snapshot.val();
    });

    firebase.database().ref(this.delString+ 'uLng').on('value', snapshot => {
      this.uLng= snapshot.val();
    });

    firebase.database().ref(this.delString+ 'tLat').on('value', snapshot => {
      this.tLat= snapshot.val();
    });

    firebase.database().ref(this.delString+ 'tLng').on('value', snapshot => {
      this.tLng= snapshot.val();
    });

    await this.delay(1000); //wait

    if(this.accepted=="true") {
      this.haveAcc=1;
      this.havePen=0;
      this.haveRej=0;

      //on for done request, or reject
      var path= `/deliveryStorage/` + <string>this.Cur+ `/`;
      var ref= firebase.database().ref(path)
      ref.on('value', snapshot =>{
        var doneReq= snapshot.child("accepted").val();

        if(doneReq=="doneReq"){
          //alert ask to confirm ================================<<<<<<<<<<<<
          this.presentConfirm();
        }

        if(doneReq=="cancel"){
          //alert cancelled ....
          this.presentAlertCancel();
        }

      })

    }
    else if(this.accepted=="false") {
      this.haveAcc=0;
      this.havePen=1;
      this.haveRej=0;
    }
    else if(this.accepted=="reject"){
      this.haveAcc=0;
      this.havePen=0;
      this.haveRej=1;
    }

    //push to deliveryNode
    this.deliveryNode[0]={accepted: <string>this.accepted, additional: <string>this.additional, runnerUsername: <string>this.runnerUsername, title: <string>this.title, userUsername: <string>this.userUsername, distance: <string> this.distance, payment: <string> this.payment, tLat: <number>this.tLat, tLng: <number>this.tLng, uLat: <number>this.uLat, uLng: <number>this.uLng, rLat: <number>this.rLat, rLng: <number>this.rLng }

    console.log("del: "+ this.deliveryNode[0].payment)
  }

  delay(ms: number) {
    //this.test(Cur)
     return new Promise(resolve => setTimeout(resolve, ms) );
  }

  newRunner(){
    this.navCtrl.push(ChooseRunnerUPage, {
      username: <string>this.userUsername ,
      title: <string>this.title,
      additional: <string>this.additional
    });
  }

  goChat(){
    this.navCtrl.push(ChatUPage, {
      userUsername: this.usernamePassed,
      runnerUsername: <string>this.runnerUsername,
      key: <string>this.Cur
    })
  }

  // Sets the map on all markers in the array.
  setMapOnAll(map) {
    this.markers.setMap(map);
  }

  // Removes the markers from the map, but keeps them in the array.
  clearMarkers() {
    this.setMapOnAll(null);
    }

  // Shows any markers currently in the array.
  showMarkers() {
    this.setMapOnAll(this.map);
  }

  // Deletes all markers in the array by removing references to them.
  deleteMarkers() {
    this.clearMarkers();
    this.markers = null;
  }

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Confirm Delivery Done',
      message: 'Confirm that this delivery is done?',
      buttons: [
        {
          text: 'NO',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'CONFIRM',
          handler: () => {
            console.log('Buy clicked');

            //update db delivery is done
            var path= `/deliveryStorage/` + <string>this.Cur+ `/`;
            var ref= firebase.database().ref(path)
            ref.update({
              accepted: "done"
            })

            //done alert
            this.presentAlert();

            //go home
            this.navCtrl.setRoot(HomeUPage, {
              username: <string> this.usernamePassed
            });

          }
        }
      ]
    });
    alert.present();
  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'DELIVERY DONE',
      buttons: ['Okay']
    });
    alert.present();
  }

  presentAlertCancel() {
    let alert = this.alertCtrl.create({
      title: 'DELIVERY CANCELLED',
      buttons: ['Okay']
    });
    alert.present();
  }

}
