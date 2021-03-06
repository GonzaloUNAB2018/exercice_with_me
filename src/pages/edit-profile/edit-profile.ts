import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { AnguarFireProvider } from '../../providers/anguar-fire/anguar-fire';
import { User } from '../../models/user';
import { Observable } from 'rxjs';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

  user = {} as User;
  usr : Observable<any>;
  edit: boolean = false;
  usr_: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afProvider : AnguarFireProvider,
    public loadingCtrl : LoadingController,
    public toastCtrl : ToastController
    ) {

      this.user.uid = this.navParams.get('uid');
      this.edit = this.navParams.get('edit');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditProfilePage');
    this.getUserData();
  }

  getUserData(){
    this.usr = this.afProvider.getUserInfo(this.user.uid).valueChanges();
    this.afProvider.getUserInfo(this.user.uid).valueChanges().subscribe(user=>{
      this.usr_ = user;
      if(this.usr_){
        
        if(!this.usr_.profilePhoto){
          this.afProvider.updateUserData(this.user.uid, this.user);
        }
      }
    })
  }
  

  editUserData(){
    const load = this.loadingCtrl.create({
      content : 'Editando datos...',
    });
    load.present();
    this.afProvider.updateUserData(this.user.uid, this.user);
    if(this.edit){
      this.navCtrl.setRoot(HomePage).then(()=>{
        load.dismiss().then(()=>{
          const toast = this.toastCtrl.create({
            message: 'Datos editados',
            duration: 1000
          });
          toast.present();
        })
      })
    }else{
      this.navCtrl.pop().then(()=>{
        load.dismiss().then(()=>{
          const toast = this.toastCtrl.create({
            message: 'Datos editados',
            duration: 1000
          });
          toast.present();
        })
      })
    }
    
  }



}



