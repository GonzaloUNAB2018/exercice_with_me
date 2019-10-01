import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from '../../models/user';
import { WaitingPage } from '../waiting/waiting';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user = {} as User;
  ok: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private afAuth: AngularFireAuth,
    ) {

      
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login(){
    if(this.user.email&&this.user.password){
      const loader = this.loadingCtrl.create({
        content: "Please wait...",
      });
      loader.present();
      this.afAuth.auth.signInWithEmailAndPassword(this.user.email, this.user.password).then(user=>{
        if(user){
          loader.dismiss();
          this.navCtrl.setRoot(WaitingPage);
        }
      }).catch(error=>{
        loader.dismiss();
        console.log(error);
        alert(error);
        this.navCtrl.pop();
      })
    }
  }
  
}
