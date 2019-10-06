import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';
import { RecoveryPasswordPage } from '../recovery-password/recovery-password';
import { AngularFireAuth } from '@angular/fire/auth';
//import { WaitingPage } from '../waiting/waiting';

@Component({
  selector: 'page-initial',
  templateUrl: 'initial.html',
})
export class InitialPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    //private afAuth: AngularFireAuth
    ) {
      
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InitialPage');
  } 

  toLoginPage(){
    //this.afAuth.auth.onAuthStateChanged(user=>{
      //if(user){
        //this.navCtrl.setRoot(WaitingPage)
      //}else{
        this.navCtrl.push(LoginPage)
      //}
    //});
  }

  toRegisterPage(){
    this.navCtrl.push(RegisterPage)
  }

  toRecoveryPasswordPage(){
    this.navCtrl.push(RecoveryPasswordPage)
  }

}
