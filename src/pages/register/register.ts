import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from '../../models/user';
import { AnguarFireProvider } from '../../providers/anguar-fire/anguar-fire';
import { validate } from 'rut.js';
import { InitialPage } from '../initial/initial';
import { WaitingPage } from '../waiting/waiting';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  user = {} as User;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private afAuth: AngularFireAuth,
    public afProvider: AnguarFireProvider,
    public toastCtrl: ToastController
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  registre(){
    if(this.user.email != null){
      if(this.user.password != null){
        if(this.user.confirm_password != null){
          if(this.user.name&&this.user.surname&&this.user.dateBirth&&this.user.sex&&this.user.phone&&this.user.weight&&this.user.height){
            if(this.user.phone.toString().length >= 9){
              if(this.user.run){
                if(validate(this.user.run)){
                  if(this.user.password === this.user.confirm_password){
                    const loader = this.loadingCtrl.create({
                      content: "Registrando Usuario...",
                    });
                    loader.present();
                    this.user.phoneNumber = '+56'+this.user.phone;
                    setTimeout(() => {
                      this.afAuth.auth.createUserWithEmailAndPassword(
                        this.user.email,
                        this.user.password
                      )
                      .then(user=>{
                        if(user){
                          this.user.uid = this.afAuth.auth.currentUser.uid;
                          this.afProvider.updateUserData(this.user.uid, this.user);
                          this.afAuth.auth.currentUser.updateProfile({
                            displayName : this.user.name
                          })
                            loader.dismiss()
                            loader.onDidDismiss(()=>{
                              this.afAuth.auth.signOut().then(()=>{

                                this.navCtrl.setRoot(InitialPage);
                                let toast = this.toastCtrl.create({
                                  message: 'Inicie sesión con las credenciales registradas',
                                  duration: 2000,
                                });
                                toast.present();
                              });                           
                          });
                        }
                      }
                      )
                      .catch(e=>{
                        this.navCtrl.setRoot(InitialPage);
                        let toast = this.toastCtrl.create({
                          message: e.code,
                          duration: 3000
                        });
                        toast.present();
                        loader.dismiss()
                      })
                    }, 1000);
                  }else{
                    alert('Contraseñas ingresadas no coinciden. Intente nuevamente');
                  }
                }else{
                  alert('RUN no validado')
                }
              }else{
                alert('Agregar RUN')
              }
            }else{
              alert('Número de teléfono debe contar con 9 dígitos');
            }
          }else{
            alert('Faltan datos');
          }
        }else{
          alert('Ingrese de nuevo la contraseña');
        }
      }else{
        alert('Ingrese una contraseña');
      }
    }else{
      alert('Ingrese email');
    }
    
  }

  presentLoading() {
    const loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000
    });
    loader.present();
  }


}
