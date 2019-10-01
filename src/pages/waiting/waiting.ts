import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-waiting',
  templateUrl: 'waiting.html',
})
export class WaitingPage {

  logo: string = null

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WaitingPage');
    this.showImage();
  }

  showImage(){
    setTimeout(() => {
      this.logo = './assets/imgs/icon.png';
      setTimeout(() => {
        let load = this.loadingCtrl.create({
          content: 'Iniciando Sesión',
          dismissOnPageChange: true
        });
        load.present();
        setTimeout(() => {
          this.navCtrl.setRoot(HomePage);
        }, 1000);
      }, 2000);      
    }, 1000);
  }

}
