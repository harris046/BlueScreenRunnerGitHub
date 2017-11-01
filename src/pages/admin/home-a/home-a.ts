import { Component } from '@angular/core';
import { NavController, Events} from 'ionic-angular';

@Component({
  selector: 'page-home-a',
  templateUrl: 'home-a.html'
})
export class HomeAPage {

  constructor(public navCtrl: NavController, public events: Events) {
    events.publish('user:entered');
  }

}
