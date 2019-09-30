import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from '../../models/user';

@Component({
  selector: 'page-recovery-password',
  templateUrl: 'recovery-password.html',
})
export class RecoveryPasswordPage {


  user = {} as User

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    public toastCtrl: ToastController
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecoveryPasswordPage');
  }

  recoveryPssw(){
    this.afAuth.auth.sendPasswordResetEmail(this.user.email).then(()=>{
      this.navCtrl.pop();
      this.toast('Se ha enviado correo eletrónico a '+this.user.email);
    }).catch(e=>{
      if(e.code === 'auth/user-not-found'){
        this.toast('Usuario no se encuentra registrado. Error en email o debe registrarse');
      }else{
        this.toast('Error desconocido. Intente nuevamente')
      };
      this.navCtrl.pop();
    })
  }

  toast(message: string){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 5000,
      showCloseButton: true,
      closeButtonText: 'Close'
    });
    toast.present();
  }

}
