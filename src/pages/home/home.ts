import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, ToastController, NavParams, Platform } from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { InitialPage } from '../initial/initial';
import { ConfigurationPage } from '../configuration/configuration';
import { TasksService } from '../../providers/tasks-service/tasks-service';
import { SQLite } from '@ionic-native/sqlite';
import { StepsDbProvider } from '../../providers/steps-db/steps-db';
import { CaminataPage } from '../caminata/caminata';
import { SaltosPage } from '../saltos/saltos';
import { JumpDbProvider } from '../../providers/jump-db/jump-db';
import { LoadDatabasePage } from '../load-database/load-database';
import { AbdominalesPage } from '../abdominales/abdominales';
import { User } from '../../models/user';
import { AnguarFireProvider } from '../../providers/anguar-fire/anguar-fire';
import { ProfilePage } from '../profile/profile';
import { HealthStatusResumePage } from '../health-status-resume/health-status-resume';
import { GoogleFitProvider } from '../../providers/google-fit/google-fit';
import { ExercisesPage } from '../exercises/exercises';
import { ABSDbProvider } from '../../providers/ABS-db/ABSs-db';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  afUser = this.afAuth.auth.currentUser
  user = {} as User;
  uid: any = null;
  requiereUpdate: any;
  versionApp = '0.1.1.1';
  health : boolean = false;
  soliciteHealth : boolean = true;
  updateUserLoader: any;
  usr : any;
  data: any;
  firstT: boolean = true;

  constructor(
    private platform: Platform,
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private afAuth: AngularFireAuth,
    private alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public tasksService: TasksService,
    public stepsDbService: StepsDbProvider,
    public jumpDbService: JumpDbProvider,
    public ABSDbService: ABSDbProvider,
    public sqlite: SQLite,
    public afProvider: AnguarFireProvider,
    public googleFitProvider: GoogleFitProvider
    ) {

      if(this.afUser.displayName){
        let toast = this.toastCtrl.create({
          message: 'Bienvenido '+this.afUser.displayName,
          duration: 2000
        });
        toast.present();
      }

      this.afProvider.requiereUpdateApp().valueChanges().subscribe(requiereUpdate=>{
        this.requiereUpdate = requiereUpdate;
        if(this.requiereUpdate.requiere==='0.1.1.1'){
          console.log('No requiere actualizar');
        }else{
          this.requiereUpdateAppFunction()
        }
      });

      
      
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
        return this.jumpDbService.createTable() && this.stepsDbService.createTable() && this.ABSDbService.createTable();
      })
      .catch(error =>{
        console.error(error);
      });
    }

    ionViewDidLoad(){
      this.uid = this.afUser.uid;
      if(this.uid){
        console.log(this.uid);
        this.getUserData(this.uid);
      };
    }

    getUserData(uid){
      
      let load = this.loadingCtrl.create({
        content : 'Cargando datos...'
      });
      load.present();
      this.afProvider.getUserInfo(uid).valueChanges().subscribe(usr=>{
        this.usr = usr;
        if(this.usr){
          console.log(this.usr.name);
          console.log(this.usr.lastExerciceLoad);
          this.user.lastExerciceLoad = this.lastExercice(this.usr.lastExerciceLoad);
          console.log(this.user.lastExerciceLoad);
          this.afProvider.updateUserData(uid, this.user);
          load.dismiss();
          if(this.firstT===true){
            if(this.usr.firstTime==='0'||this.usr.firstTime===undefined){
              this.firstT = false;
              this.user.firstTime = 1;
              this.afProvider.updateUserData(uid, this.user);
              let alert = this.alertCtrl.create({
                title: 'Bienvenido',
                subTitle: 'A Exercice With Me',
                message: 'Para conocer detalles de la aplicación presione "OK"',
                buttons: [
                  {
                    text: 'OK',
                    handler: data=>{
                      this.user.firstTime
                      window.open("https://github.com/GonzaloUNAB2018/exercice_with_me");
                    }
                  },
                  {
                    text: 'Se usarla',
                    handler: data=>{
  
                    }
                  }
                ]
              });
              alert.present();
              alert.onDidDismiss(()=>{
                console.log(this.usr.firstTime);
                if(this.platform.is('cordova')){
                  this.connectGoogleFit(this.usr, uid);
                }
              })
            }else if(this.usr.firstTime === '1'){
              this.firstT = false;
              this.afProvider.updateUserData(uid, this.user);
              console.log(this.usr.firstTime);
              load.onDidDismiss(()=>{
                if(this.platform.is('cordova')){
                  this.connectGoogleFit(this.usr, uid);
                }
              })
            };
          };
          this.createDatabase(uid);
        };
      });
    }

    connectGoogleFit(usr, uid){
      //"0" o "undefined" => intentará conectar a Google Fit
      //"1" Significa conectado
      //"2" No volverá a conectar a menos que lo solicite desde opciones
      console.log(usr.googleFit);
      if(usr.googleFit === '0'|| usr.googleFit === undefined){
        console.log('Conectando con google fit');
        let alert = this.alertCtrl.create({
          title: 'Conectar con Google Fit',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                this.user.googleFit = 2;
                console.log('No se conectará a Google Fit');
                console.log(this.user.googleFit);
                this.user.lastExerciceLoad = Date.now();
                this.user.lastRateSolicitude = new Date(new Date().getTime()).toString();
                this.afProvider.updateUserData(uid, this.user);
              }
            },
            {
              text: 'OK',
              handler: () => {
                this.user.googleFit = 1;
                console.log('Conectando a Google Fit');
                console.log(this.user.googleFit);
                this.googleFitProvider.accesToHealth().then(health=>{
                  console.log(health);
                  this.health = health;
                  this.initGoogleFit(this.health, uid);
                });
              }
            }
          ]
        });
        alert.present();
      }else if(usr.googleFit === '1'){
        console.log('Iniciando conexión con Google Fit');
        this.googleFitProvider.accesToHealth().then(health=>{
          this.health = health
          console.log(this.health);
          this.initGoogleFit(this.health, uid);
        }).catch(e=>{
          alert(e);
          console.log(e);
          this.user.googleFit = 2;
          console.log(this.user.googleFit);
        });
      }else if(usr.googleFit === '2'){
        console.log('No se conectará con Google Fit');
      }
    };

    initGoogleFit(health, uid){
      if(health===true){
        this.googleFitProvider.getPermissionToHealthData().then(h=>{
          console.log(h);
          this.afProvider.updateUserData(uid, this.user);
        }).catch(e=>{
          alert(e);
          console.log(e)
          this.user.googleFit = 2;
          console.log(this.user.googleFit);
          this.afProvider.updateUserData(uid, this.user);
        })
      }
    }

    lastExercice(lastExercice){
      if(lastExercice < Date.now()*0.5 || lastExercice === undefined){
        return Date.now();
      }else{
        return lastExercice
      }
    }

    logout(){
      let alert = this.alertCtrl.create({
        title: 'Cerrar sesión',
        message: 'Saldrá de la sesión de la aplicación',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              
            }
          },
          {
            text: 'OK',
            handler: () => {
              this.loadLogout();
            }
          }
        ]
      });
      alert.present()
      
    }

    loadLogout() {
      const loader = this.loadingCtrl.create({
        content: "Cerrando Sesión",
      });
      loader.present();
      setTimeout(() => {
        this.afAuth.auth.signOut().then(()=>{
          this.navCtrl.setRoot(InitialPage);
          loader.dismiss();
        })
      }, 1000);
      
    }

    toOptionPage(){
      this.navCtrl.push(ConfigurationPage, {uid: this.uid})
    }
  
    toProfilePage(){
      //alert('Página de Perfil de Usuario en desarrollo')
      //this.navCtrl.push(ProfilePage, {uid: this.uid, nickName: this.user.nickName})
      this.navCtrl.push(ProfilePage, {uid: this.uid});
    }
  
    toExercicesList(){
      this.navCtrl.push(ExercisesPage, {uid:this.uid});
    }
  
    toHealthPage(){
      this.navCtrl.push(HealthStatusResumePage, {health:this.health, uid:this.uid})
    }
  
    toStepsPage(){
      this.navCtrl.push(CaminataPage);
    }
  
    toJumpPage(){
      this.navCtrl.push(SaltosPage);
    }
  
    toABSPage(){
      this.navCtrl.push(AbdominalesPage);
    }

    loadDb(){
      this.navCtrl.push(LoadDatabasePage, {uid:this.uid});
    }

    requiereUpdateAppFunction(){

      let alert = this.alertCtrl.create({
        title: 'Actualice la aplicación',
        message: 'Su versión es '+this.versionApp+', actualice la aplicación a la versión '+this.requiereUpdate.requiere,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              this.afAuth.auth.signOut().then(()=>{
                this.navCtrl.setRoot(InitialPage);
              })
            }
          },
          {
            text: 'OK',
            handler: () => {
              window.open("https://github.com/GonzaloUNAB2018/exercice_with_me/tree/master/APK");
            }
          }
        ]
      });
      alert.present()
    }


      /*this.afProvider.requiereUpdateApp().valueChanges().subscribe(requiereUpdate=>{
        this.requiereUpdate = requiereUpdate;
        if(this.requiereUpdate.requiere==='0.1.1.0'){
          console.log('No requiere actualizar');
        }else{
          this.requiereUpdateAppFunction()
        }
      });
      console.log('Solicite conectar con google fit: '+this.soliciteHealth);
      this.uid = this.afUser.uid;
      if(this.uid){
        
      }
      if(this.platform.is('cordova')&&this.uid!=null){
        this.createDatabase(this.uid);
        console.log('Base de datos creada');
      };    
  }

  ionViewDidEnter(){
    
  }

  getUserInfo(uid){
    this.afProvider.getUserInfo(uid).valueChanges().subscribe(usr=>{
      let user: any = usr;

      if(user){
        console.log(user.revised);
        if(user.revised===undefined||user.revised===0){
          this.user.lastExerciceLoad = user.lastExerciceLoad;
          this.user.lastRateSolicitude = user.lastRateSolicitude;
          console.log(this.user.lastExerciceLoad, this.user.lastRateSolicitude);
          if(this.user.lastExerciceLoad < Date.now()*0.5){
            this.user.lastExerciceLoad = Date.now();
            this.afProvider.updateUserData(this.uid, this.user);
          };
          if(this.user.lastRateSolicitude===undefined){
            this.user.lastRateSolicitude = new Date(new Date().getTime()).toString();
            this.afProvider.updateUserData(this.uid, this.user);
          };
        }else{
          this.toast(this.afUser.displayName);
        };
      /*if(user.googleFit==='1'){
        this.accesToHealth()
      };
      };
    });
  }

  getAppIsFirst(uid){
    let usr : any;
    this.afProvider.getUserInfo(uid).valueChanges().subscribe(usr=>{
      return usr
    })
  }

  toGoogleFit(user: any){
    console.log(user.googleFit)
    if(user.googleFit==='0'||user.googleFit===undefined){
      this.connectToHealth(this.uid);
    }else if(user.googleFit==='1'){
      this.accesToHealth()
    }else if(user.googleFit==='2'){
      
    }
  }*/

  /*addDataUser(){
    this.afProvider.getUserInfo(this.uid).valueChanges().subscribe(user=>{
      let usr : any = user;
      this.user.lastExerciceLoad = usr.lastExerciceLoad;
      this.user.lastRateSolicitude = usr.lastRateSolicitude;
      if(user){
        
      }
    });  
  }

  alertIfNotData(){
    alert('Rellene los datos')
  }

  accesToHealth(){
    let loading = this.loadingCtrl.create({
      content: 'Conectando con Google Fit'
    });
    loading.present();
    this.googleFitProvider.accesToHealth()
    .then(available=>{
      if(available){
        this.health=true;
        console.log('Solicite conectar con google fit: '+this.soliciteHealth)
        this.googleFitProvider.getPermissionToHealthData();
        loading.dismiss();
        this.soliciteHealth = false;
      }else{
        this.health=false;
        console.log('Solicite conectar con google fit: '+this.soliciteHealth)
        var alert = this.alertCtrl.create({
          title: 'No habrá conexión con datos de Google Fit',
          buttons: [
            {
              text: 'Ok',
              role: 'ok',
              handler(){
                loading.dismiss();
                this.soliciteHealth = false;
              }
            }
          ]
        });
        alert.present();
      };
    })
    .then(()=>{
      console.log(this.health)
    }).catch(e=>{
      alert(e.code);
      loading.dismiss();
    })
  }

  
  logout(){
    let alert = this.alertCtrl.create({
      title: 'Cerrar sesión',
      message: 'Saldrá de la sesión de la aplicación',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            
          }
        },
        {
          text: 'OK',
          handler: () => {
            this.loadLogout();
          }
        }
      ]
    });
    alert.present()
    
  }

  toast(nickName){
    const toast = this.toastCtrl.create({
           message: 'Bienvenido '+nickName,
           duration: 2000,
           position: 'bottom'
         });
      
         toast.present();
  }

  toOptionPage(){
    this.navCtrl.push(ConfigurationPage, {uid: this.uid})
  }

  toProfilePage(){
    //alert('Página de Perfil de Usuario en desarrollo')
    //this.navCtrl.push(ProfilePage, {uid: this.uid, nickName: this.user.nickName})
    this.navCtrl.push(ProfilePage, {uid: this.uid});
  }

  toExercicesList(){
    this.navCtrl.push(ExercisesPage, {uid:this.uid});
  }

  toHealthPage(){
    this.navCtrl.push(HealthStatusResumePage, {health:this.health, uid:this.uid})
  }

  toStepsPage(){
    this.navCtrl.push(CaminataPage);
  }

  toJumpPage(){
    this.navCtrl.push(SaltosPage);
  }

  toABSPage(){
    this.navCtrl.push(AbdominalesPage);
  }

  loadUpdateUserData() {
    this.updateUserLoader = this.loadingCtrl.create({
      content: "Actualizando datos...",
    });
    this.updateUserLoader.present();
  }


  loadLogout() {
    const loader = this.loadingCtrl.create({
      content: "Cerrando Sesión",
    });
    loader.present();
    setTimeout(() => {
      this.afAuth.auth.signOut().then(()=>{
        this.navCtrl.setRoot(InitialPage);
        loader.dismiss();
      })
    }, 1000);
    
  }


  ////////// +++++++++ LIMPIEZA DE BASE DE DATOS +++++++++ //////////

  requiereUpdateAppFunction(){

    let alert = this.alertCtrl.create({
      title: 'Actualice la aplicación',
      message: 'Su versión es '+this.versionApp+', actualice la aplicación a la versión '+this.requiereUpdate.requiere,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.afAuth.auth.signOut().then(()=>{
              this.navCtrl.setRoot(InitialPage);
            })
          }
        },
        {
          text: 'OK',
          handler: () => {
            window.open("https://github.com/GonzaloUNAB2018/exercice_with_me/tree/master/APK");
          }
        }
      ]
    });
    alert.present()
  }
  
  loadDb(){
    this.navCtrl.push(LoadDatabasePage, {uid:this.uid});
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
      return this.jumpDbService.createTable() && this.stepsDbService.createTable() && this.ABSDbService.createTable();
    })
    .catch(error =>{
      console.error(error);
    });
  }

  connectToHealth(uid){
    let alert = this.alertCtrl.create({
      title: 'Conexión con Google Fit',
      message: 'A continuación se iniciará conexiópn con Google Fit',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
            let toast = this.toastCtrl.create({
              message: 'No se conectará con Google Fit',
              duration: 5000,
              showCloseButton: true,
              closeButtonText: 'Ok'
            });
            toast.present();
            this.user.googleFit = 2;
            this.user.revised = 1;
            this.afProvider.updateUserData(uid, this.user);
          }
        },
        {
          text: 'Conectar',
          handler: data => {
            if(this.soliciteHealth === true){
              this.accesToHealth();
              this.user.googleFit = 1;
              this.user.revised = 1;
              this.afProvider.updateUserData(uid, this.user);
            }
          }
        }
      ]
    });
    alert.present();
  }*/

  
}