import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { ABSDbProvider } from '../../providers/ABS-db/ABSs-db';
import { JumpDbProvider } from '../../providers/jump-db/jump-db';
import { StepsDbProvider } from '../../providers/steps-db/steps-db';
import { AnguarFireProvider } from '../../providers/anguar-fire/anguar-fire';
import { User } from '../../models/user';

@Component({
  selector: 'page-load-database',
  templateUrl: 'load-database.html',
})
export class LoadDatabasePage {

  user = {} as User;

  jump_tasks: any[] = [];
  steps_tasks: any[] = [];
  ABS_tasks: any[] = [];

  steps_entries: number = 0;
  steps_entries_boolean: boolean = false;
  jumps_entries: number = 0;
  jumps_entries_boolean: boolean = false;
  ABSs_entries: number = 0;
  ABSs_entries_boolean: boolean = false;
  total_entries: number = 0;

  uid: any = null; 

  fbSteps : any[];
  totalSteps: number = 0;
  fbJumps : any[];
  totalJumps: number = 0;
  fbABS : any[];
  totalABS: number = 0;
  steps: number = null;
  jumps: number = null;
  ABS: number = null;
  totalDataOnFirebase: number = 0;
  openSteps1: boolean = false;
  openSteps2: boolean = false;
  openABS1: boolean = false;
  openABS2: boolean = false;
  openJumps1: boolean = false;
  openJumps2: boolean = false;
  diference: number = 0;

  loadingBar: boolean = false;
  ableButtons: boolean = true;
  

  loadInfo: string = "";
  okLoad1: boolean;
  okLoad2: boolean;
  okLoad3: boolean;
  loadSyncData: any;

  public workstarted: boolean = false;

  concat_exercices: any[]=[];
  suma : number = 0;

  stepsinfo = {
    tipo: 'Caminata',
    id: '001'
  }
  jumpsinfo = {
    tipo: 'Saltos',
    id: '002'
  }
   ABSinfo = {
    tipo: 'Abdominales',
    id: '003'
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public afProvider: AnguarFireProvider,
    public jumpDbService: JumpDbProvider,
    public ABSDbService: ABSDbProvider,
    public stepsDbService: StepsDbProvider,
    ) {
      this.uid = navParams.get('uid');      
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoadDatabasePage');
    this.getAll();
    this.afProvider.getUserInfo(this.uid).valueChanges().subscribe(usr=>{
      let usr_ : any = usr
      if(usr){
        if(usr_.lastExerciceLoad===undefined){
          this.user.lastExerciceLoad = 1
        }
      }
    })
  }

  ionViewCanLeave(): boolean{
    console.log(this.workstarted)
    if(this.workstarted===true){
      return false;
    }else if(this.workstarted===false){
      return true;
    };
  }

  getAll(){

  }

  getABS(){
    this.ABSDbService.getAll().then(ABSs=>{
      this.ABS_tasks = ABSs;
      console.log(this.ABS_tasks.length);
    })
    .catch( error => {
      console.error( error );
    });
  }

  getSteps(){
    this.stepsDbService.getAll().then(steps=>{
      this.steps_tasks = steps;
      console.log(this.steps_tasks.length);
    })
    .catch( error => {
      console.error( error );
    });
  }

  getJumps(){
    this.jumpDbService.getAll().then(jumps=>{
      this.jump_tasks = jumps;
      console.log(this.jump_tasks.length);
    })
    .catch( error => {
      console.error( error );
    });
  }

  syncDb(){
    let alert = this.alertCtrl.create({
      title: 'SINCRONIZAR INFORMACION',
      message: 'Se sincronizará sus datos',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.cancelToast();
            console.log('Se cancela carga');
            this.navCtrl.pop();
          }
        },
        {
          text: 'OK',
          handler: () => {
            this.ableButtons = false;
            //this.loadNewSync();
            setTimeout(()=>{
              this.okLoadToDatabase();
            },300);
          }
        }
      ]
    });
    alert.present();
  }

  move(){
    var elem = document.getElementById('myBar');
    var width = 1;
    var id = setInterval(()=>{
      if (width >= 100) {
        clearInterval(id);
        this.loadInfo = 'Datos sincronizados exitosamente';
        this.okToast();
        this.ableButtons = true;
      } else {
        width++; 
        elem.style.width = width + '%';
        this.loadInfo = 'Sincronizando datos...';
        this.loadSyncData.dismiss();
      }  
    }, 10);
  }

  okLoadToDatabase(){
    let load = this.loadingCtrl.create({
      content: 'Calculando...'
    });
    load.present();
    this.workstarted = true;
    this.getABS();
    this.getJumps();
    this.getSteps();
    setTimeout(() => {
      load.dismiss();
      load.onDidDismiss(()=>{
      this.suma = this.ABS_tasks.length+this.steps_tasks.length+this.jump_tasks.length;
      console.log(this.suma);
      if(this.suma){
        let load3 = this.loadingCtrl.create({
          content: 'Iniciando Carga'
        });
        load3.present();
        console.log('Comienza la carga');
        console.log(this.ABS_tasks);
        console.log(this.steps_tasks);
        console.log(this.jump_tasks);
        this.concat_exercices = this.ABS_tasks.concat(this.steps_tasks, this.jump_tasks);
        if(this.concat_exercices){
          console.log(this.concat_exercices);
          if(load3){
            setTimeout(() => {
              for(var n = 0 ; n <= this.suma ; n++){
                let m : number = 0;
                let exDay = {
                  eid : this.concat_exercices[n].eid,
                  type : this.concat_exercices[n].type,
                  save_time : this.concat_exercices[n].save_time,
                };
                let ex = {
                  id : null,
                  type : exDay.type
                };
                if(ex.type === 'Caminata'){
                  ex.id = '001'
                }else if(ex.type === 'Saltos'){
                  ex.id = '002'
                }else if(ex.type === 'Abdominales'){
                  ex.id = '003'
                }
                //if(this.concat_exercices[n].id > this.user.lastExerciceLoad){
                  console.log(this.concat_exercices[n].id);
                  this.afProvider.updateExercices(this.uid, ex, exDay, this.concat_exercices[n]);
                //}
                console.log(n);
                if(n===this.suma-1){
                  console.log(n + ' datos revisados');
                  console.log(m + ' datos no cargados');
                  this.user.lastExerciceLoad = Date.now();
                  this.afProvider.updateUserData(this.uid, this.user);
                  console.log('finish')
                  load3.dismiss().then(()=>{
                    this.workstarted = false;
                    let toast = this.toastCtrl.create({
                      message: 'Carga finalizada',
                      duration: 2000
                    });
                    toast.present();
                    toast.onDidDismiss(()=>{
                      this.navCtrl.pop();
                    });
                  });
                  break
                };
              };
            }, 2000);
          };
        };
      };
      })
    }, 2000);
    
    /*setTimeout(() => {
      this.suma = this.ABS_tasks.length+this.steps_tasks.length+this.jump_tasks.length;
      console.log(this.suma);
      if(this.suma >= 0){
        load.dismiss();
        this.concat_exercices = this.ABS_tasks.concat(this.steps_tasks.concat(this.jump_tasks));
        console.log(this.concat_exercices);
        let load_ = this.loadingCtrl.create({
          content: 'Cargando Datos'
        });
        load_.present();
        console.log(this.user.lastExerciceLoad);
        for(var n = 0 ; n <= this.suma ; n++){
          let m : number = 0;
          let exDay = {
            eid : this.concat_exercices[n].eid,
            type : this.concat_exercices[n].type,
            save_time : this.concat_exercices[n].save_time,
          };
          let ex = {
            id : null,
            type : exDay.type
          };
          if(ex.type === 'Caminata'){
            ex.id = '001'
          }else if(ex.type === 'Saltos'){
            ex.id = '002'
          }else if(ex.type === 'Abdominales'){
            ex.id = '003'
          }
          if(this.concat_exercices[n].id > this.user.lastExerciceLoad){
            this.afProvider.updateExercices(this.uid, ex, exDay, this.concat_exercices[n]);
          }
          console.log(n);
          if(n=this.suma){
            console.log(n + ' datos revisados');
            console.log(m + ' datos no cargados');
            this.user.lastExerciceLoad = Date.now();
            this.afProvider.updateUserData(this.uid, this.user);
            console.log('finish')
            load_.dismiss();
            this.workstarted = false;
            let toast = this.toastCtrl.create({
              message: 'Carga finalizada',
              duration: 2000
            });
            toast.present();
            toast.onDidDismiss(()=>{
              this.navCtrl.pop();
            });
          };
        };
      }else{
        this.workstarted = false;
        let load = this.loadingCtrl.create({
          content: 'Sin sincronizar',
          duration: 1000,
        });
        load.present()
        load.onDidDismiss(() => {
          this.navCtrl.pop();
        });
      } 
    }, 3000);*/
  }

  cancelToast() {
    const toast = this.toastCtrl.create({
      message: 'Sincronización cancelada',
      duration: 1000,
      position: 'bottom'
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }

  okToast() {
    const toast = this.toastCtrl.create({
      message: 'Sincronización exitosa',
      duration: 1000,
      position: 'bottom'
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present()
  }

  noLoadToast() {
    const toast = this.toastCtrl.create({
      message: 'Nada que sincronizar',
      duration: 2000,
      position: 'bottom'
    });
    toast.present()
  }

  load(){
    const loading = this.loadingCtrl.create({
       content: 'Please wait...',
       duration: 2000
     });
     loading.present();
     setTimeout(() => {
      this.okToast();
      loading.dismiss();
    }, 1300);
  }

  loadNewSync(){
    this.loadSyncData = this.loadingCtrl.create({
       content: 'Calculando datos...',
     });
     this.loadSyncData.present();
  }
}
