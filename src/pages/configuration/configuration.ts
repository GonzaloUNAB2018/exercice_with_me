import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { SQLite } from '@ionic-native/sqlite';
import { StepsDbProvider } from '../../providers/steps-db/steps-db';
import { JumpDbProvider } from '../../providers/jump-db/jump-db';
import { ABSDbProvider } from '../../providers/ABS-db/ABSs-db';
import { AnguarFireProvider } from '../../providers/anguar-fire/anguar-fire';
import { User } from '../../models/user';
import { GoogleFitProvider } from '../../providers/google-fit/google-fit';

@Component({
  selector: 'page-configuration',
  templateUrl: 'configuration.html',
})
export class ConfigurationPage {

  uid : any;
  rates : number = 0;
  user = {} as User;
  loadingObjectDeleteRates: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public sqlite: SQLite,
    public alertCtrl: AlertController,
    public stepsDbService: StepsDbProvider,
    public jumpDbService: JumpDbProvider,
    public ABSDbService: ABSDbProvider,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public afService: AnguarFireProvider,
    public googleFitProvider: GoogleFitProvider
    ) {
    
      this.uid = navParams.get('uid');
      console.log(this.uid);
      this.afService.getUserHearthAllRates(this.uid).valueChanges().subscribe(rts=>{
        if(rts){
          this.rates = rts.length;
          if(this.rates === undefined){
            this.rates = 0;
          }else{
            this.rates = rts.length;
          }
        }
      });
      /*this.afService.getUserInfo(this.uid).valueChanges().subscribe(usr=>{
        let user: any = usr
        if(user){
          console.log(user.googleFit);
          if(user.googleFit === '0'){
            this.googleFitButton = true;
            console.log(this.googleFitButton);
          }else if(user.googleFit === '2'){
            this.googleFitButton = true;
            console.log(this.googleFitButton);
          }else if(user.googleFit === undefined){
            this.googleFitButton = true;
            console.log(this.googleFitButton);
          }else if(user.googleFit === '1'){
            this.googleFitButton = false;
            console.log(this.googleFitButton);
          }
        }
      })*/
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfigurationPage');

  }

  deleteDatabase(uid){
    this.sqlite.deleteDatabase({
      name: uid+'_data.db',
      location: 'default' // the location field is required
    }).then(() =>{
      alert('Base de datos borrada');
      this.createDatabase(this.uid);
    })
    .catch(error =>{
      console.error(error);
    });
  }

  deleteBD() {
    const alert = this.alertCtrl.create({
      title: 'Confirmar',
      message: '¿Desea borrar la base de datos? Se borrarán datos guardados en su celular y BD online',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            
          }
        },
        {
          text: 'OK',
          handler: () => {
            /*let toast = this.toastCtrl.create({
              message: 'Deshabilitado por periodo de pruebas',
              duration: 3000
            });
            toast.present();*/
            this.deleteDatabase(this.uid);
          }
        }
      ]
    });
    alert.present();
  }

  createDatabase(uid){
    this.sqlite.create({
      name: uid+'_data.db',
      location: 'default' // the location field is required
    })
    .then((db) => {
      this.jumpDbService.setDatabase(db);
      this.stepsDbService.setDatabase(db);
      this.ABSDbService.setDatabase(db);
      this.afService.deleteDataBase(this.uid);
      return this.jumpDbService.createTable() && this.stepsDbService.createTable() && this.ABSDbService.createTable();
      
    })
    .catch(error =>{
      console.error(error);
    });
  }

  createDBToast() {
    const toast = this.toastCtrl.create({
      message: 'Se renueva base de datos exitosamente',
      duration: 1000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present()
  }

  loadingDeleteRates(){
    this.loadingObjectDeleteRates = this.loadingCtrl.create({
           content: 'Por Favor espere. Puede tardar unos minutos'
         });
      
         this.loadingObjectDeleteRates.present()
       
         
  }

  deleteRatesToast() {
    const toast = this.toastCtrl.create({
      message: 'Datos removidos exitosamente',
      duration: 1000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present()
  }

  deleteRates(){
    /*let toast = this.toastCtrl.create({
      message: 'Deshabilitado por periodo de pruebas',
      duration: 3000
    });
    toast.present();*/
    this.loadingDeleteRates();
    setTimeout(() => {
      this.user.lastRateSolicitude = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).toString();
      this.afService.deleteRates(this.uid);
      this.afService.updateUserData(this.uid, this.user);
      setTimeout(() => {
        this.afService.getUserHearthAllRates(this.uid).valueChanges().subscribe(rts=>{
          if(rts){
            this.rates = rts.length;
            if(this.rates === undefined){
              this.rates = 0;
              this.loadingObjectDeleteRates.dismiss();
              this.deleteRatesToast();
            }else{
              this.rates = rts.length;
              this.loadingObjectDeleteRates.dismiss();
            }
          }
        })
      }, 500);
    }, 1000);
  }

  initGoogleFit(){
    this.googleFitProvider.getPermissionToHealthData().then(h=>{
      console.log(h);
      if(h===true){
        this.user.googleFit = 1;
        this.afService.updateUserData(this.uid, this.user);
        let toast = this.toastCtrl.create({
          message: 'Google Fit Conectado',
          duration: 1000
        });
        toast.present();
      }
    })
    .catch(e=>{
      alert(e);
      console.log(e)
      this.user.googleFit = 2;
      console.log(this.user.googleFit);
      this.afService.updateUserData(this.uid, this.user);
    })
    
  }
 
}
