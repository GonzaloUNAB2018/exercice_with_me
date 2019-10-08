import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Platform, ToastController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { StepsDbProvider } from '../../providers/steps-db/steps-db';
import { Stepcounter } from '@ionic-native/stepcounter';
import { BackgroundMode } from '@ionic-native/background-mode';

@Component({
  selector: 'page-caminata',
  templateUrl: 'caminata.html',
})
export class CaminataPage {
  
  lat: number = 0;
  lng: number = 0;
  alt: number = 0;
  speed: number = 0;
  steps_tasks: any[] = [];
  startingOffset = 0;
  steps: number = 0;
  heading: number = 0;
  today: any;
  save_time: string;
  latlng: string = '0'

  private interval: any;
  private dataInterval: any;
  private seconds: number = 0;
  public time: string = '00:00';
  public bg_time: string = '00:00';
  public showSeconds: boolean = true;
  public workstarted: boolean = false;
  cdown_ok: boolean;
  cdown: any;
  cdown_ss: number = 5;
  date: string;
  hour: string;
  stepSensorTrue: string;
  formatted_time: string = '00:00';
  provider: any;
  excercise = {
    id: null
  };

  watch : any;

  geo: any;

  st: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private geolocation: Geolocation,
    private stepsDbService: StepsDbProvider,
    private stepcounter: Stepcounter,
    private platform: Platform,
    private backgroundMode: BackgroundMode,
    public toastCtrl: ToastController
    )
    {
      
      if(this.platform.is('cordova')){
        this.getGeolocation();
        if(this.st === true){
          this.countDown()
        }       
      }
      
    }

    ionViewCanLeave(): boolean{
      console.log(this.workstarted)
      if(this.workstarted===true){
        return false;
      }else if(this.workstarted===false){
        return true;
      };
    }

    stopAll(){
      this.workstarted = false;
      this.stop();
      //this.watch.unsuscribe();      
    }

    stop() {
      window.clearInterval(this.interval);
      window.clearInterval(this.dataInterval);
      this.seconds = 0;
      if(this.platform.is('cordova')){
        this.stopSteps();
        this.backgroundMode.disable();
        this.watch.unsubscribe();      
      };
    }

    stopSteps(){
      this.loadStopGetData();
      if(this.platform.is('cordova')){
        this.stepcounter.stop();
      }
    }

    loadStopGetData() {
      const loader = this.loadingCtrl.create({
        content: "Finalizando toma de datos...",
        duration: 1000
      });
      loader.present();
  
      loader.onDidDismiss(()=>{
          this.navCtrl.pop();
      })
    }

    getGeolocation(){
      this.workstarted=true
        let load = this.loadingCtrl.create({
          content: 'Obteniendo información de GPS',
        });
        load.present();
        this.watch = this.geolocation.watchPosition({
          enableHighAccuracy: true,
          maximumAge: 1000,
        }).subscribe(location => {
          this.lat = location.coords.latitude;
          this.lng = location.coords.longitude;
          this.alt = location.coords.altitude;
          console.log(this.lat, this.lng)
          if(location.coords.speed===undefined||location.coords.speed===null){
            this.speed = 0;
          }else{
            this.speed = location.coords.speed;
          };
            this.latlng = this.lat+', '+this.lng;
            load.dismiss();
        });
        load.onDidDismiss(()=>{
          this.countDown()
        })
    }

    countDown(){
      this.cdown_ok = true;
      this.cdown = setInterval(()=>{
        this.cdown_ss=this.cdown_ss-1;
        if(this.cdown_ss<1){
          this.stopCountDown();
          this.start();
          if(this.platform.is('cordova')){
            this.initSteps();
          }        
          this.cdown_ok=false;
        }
      },1000);
    }

    start() {
      //this.workstarted = true;
      this.interval = window.setInterval(() => {
        this.seconds++;
        this.time = this.getTimeFormatted();
        document.getElementById('time').innerHTML=this.time;
        if(this.platform.is('cordova')){
          this.backgroundMode.configure({
            title: '¡Caminando!',
            text: this.time+' Presione notificación para continuar',
            color: 'primary',
            hidden: false,
            bigText: true,
          });
        }
      }, 1000);
      this.bgNotify();
    }
  
    bgNotify(){
      if(this.platform.is('cordova')){
        this.backgroundMode.enable();
        if(this.backgroundMode.isEnabled()){
          this.backgroundMode.on('enable')
        }else{
        }
      }
    }
  
    stopCountDown(){
      this.excercise.id = Math.trunc(Date.now()*0.5);
      clearInterval(this.cdown);
    }

    initSteps(){
      console.log('Se inicia Caminata');
  
      this.stepcounter.start(this.startingOffset)
      .then(
        onSuccess => 
        console.log('stepcounter-start success', onSuccess), 
        onFailure => 
        console.log('stepcounter-start error', onFailure)
      );
  
      this.dataInterval = window.setInterval(()=>{
        this.onInterval();
      }, 500)
  
    }

    onInterval(){
      this.stepcounter.getStepCount().then(steps =>{
        this.steps = steps;
        console.log(this.steps)
      });
      this.today = new Date().toString();   
      this.dateTime();
      var data_steps ={
        eid : this.excercise.id,
        id : Date.now(),
        date : this.today,
        save_time: this.save_time,
        type : 'Caminata',
        steps : this.steps,
        lat : this.lat,
        lng : this.lng,
        alt : this.alt,
        speed : this.speed,
      };
      if(this.platform.is('cordova')){
        this.stepsDbService.create(data_steps).then(response => {
          this.steps_tasks.unshift( data_steps );
        });
      }
    }
    
    dateTime(){
      //this.today = new Date();
      var myDay = new Date()
      var m = myDay.getMonth()+1
      this.save_time = myDay.getDate()+'-'+m+'-'+myDay.getFullYear()
      /*var seg = Number(today.getSeconds());
      var ss = String(today.getSeconds());
      var min = Number(today.getMinutes());
      var mi = String(today.getMinutes());
      var hh = String(today.getHours());
      var dd = String(today.getDate());
      var mm = String(today.getMonth() + 1); //January is 0!
      var yyyy = today.getFullYear();
      this.date = yyyy+'-'+mm+'-'+dd;
      if(min>=0&&min<10){
        mi = 0+mi
      };
      if(seg>=0&&seg<10){
        ss = 0+ss
      };
      this.hour = hh+':'+mi+':'+ss;*/
    }

    getTimeFormatted() {
      var hours   = Math.floor(this.seconds / 3600);
      var minutes = Math.floor((this.seconds - (hours * 3600)) / 60);
      var seconds = this.seconds - (hours * 3600) - (minutes * 60);
  
      var hours_st = hours.toString();
      var minutes_st = minutes.toString();
      var seconds_st = seconds.toString();
      if (hours   < 10) {
        hours_st   = "0" + hours.toString();
      }
      if (minutes < 10) {
        minutes_st = "0" + minutes.toString();
      }
      if (seconds < 10) {
        seconds_st = "0" + seconds.toString();
      }
  
      this.formatted_time = '';
      if (hours > 0) {
        this.formatted_time += hours_st + ':';
      }
      this.formatted_time += minutes_st;
      if (this.showSeconds) {
        this.formatted_time += ':' + seconds_st;
      }
      return this.formatted_time;
    }
  /*ionViewDidLoad() {
    this.workstarted=true
    this.countDown();
  }

  ionViewCanLeave(): boolean{
    console.log(this.workstarted)
    if(this.workstarted===true){
      return false;
    }else if(this.workstarted===false){
      return true;
    };
  }

  stopAll(){
    this.workstarted = false;
    this.stop();
    
  }

  countDown(){
    this.cdown_ok = true;
    this.cdown = setInterval(()=>{
      this.cdown_ss=this.cdown_ss-1;
      if(this.cdown_ss<1){
        this.stopCountDown();
        this.start();
        if(this.platform.is('cordova')){
          this.initSteps();
        }        
        this.cdown_ok=false;
      }
    },1000);
  }

  stopCountDown(){
    this.excercise.id = Math.trunc(Date.now()*0.5);
    clearInterval(this.cdown);
  }

  getGeolocationData(){
    let load = this.loadingCtrl.create({
      content: 'Obteniendo información de GPS',
    });
    load.present();
    this.watch = this.geolocation.watchPosition({
      enableHighAccuracy: true
    });
    this.watch.subscribe(location => {
      this.lat = location.latitude;
      this.lng = location.longitude;
      this.alt = location.altitude;
      if(location.speed===undefined||location.speed===null){
        this.speed = 0;
      }else{
        this.speed = location.speed;
      };
      if(this.lat===undefined&&this.lng === undefined){
        this.latlng = 'Buscando Coordenadas';
      }
      if(this.latlng === ''){

      }
      
    });
  }

  start() {
    //this.workstarted = true;
    this.interval = window.setInterval(() => {
      this.seconds++;
      this.time = this.getTimeFormatted();
      document.getElementById('time').innerHTML=this.time;
      if(this.platform.is('cordova')){
        this.backgroundMode.configure({
          title: '¡Caminando!',
          text: this.time+' Presione notificación para continuar',
          color: 'primary',
          hidden: false,
          bigText: true,
        });
      }
    }, 1000);
    this.bgNotify();
  }

  bgNotify(){
    if(this.platform.is('cordova')){
      this.backgroundMode.enable();
      if(this.backgroundMode.isEnabled()){
        this.backgroundMode.on('enable')
      }else{
      }
    }
  }

  stopNotify(){
    if(this.platform.is('cordova')){
      this.backgroundMode.disable();
    }
  }

  initSteps(){
    console.log('Se inicia Caminata');

    this.stepcounter.start(this.startingOffset)
    .then(
      onSuccess => 
      console.log('stepcounter-start success', onSuccess), 
      onFailure => 
      console.log('stepcounter-start error', onFailure)
    );

    this.dataInterval = window.setInterval(()=>{
      this.onInterval();
    }, 500)

  }

  stop() {
    window.clearInterval(this.interval);
    window.clearInterval(this.dataInterval);
    this.seconds = 0;
    if(this.platform.is('cordova')){
      this.stopSteps();
      this.stopNotify();
      this.watch.unsuscribe();      
    };
    setTimeout(() => {
      this.navCtrl.pop()
    }, 1000);
  }

  getTimeFormatted() {
    var hours   = Math.floor(this.seconds / 3600);
    var minutes = Math.floor((this.seconds - (hours * 3600)) / 60);
    var seconds = this.seconds - (hours * 3600) - (minutes * 60);

    var hours_st = hours.toString();
    var minutes_st = minutes.toString();
    var seconds_st = seconds.toString();
    if (hours   < 10) {
      hours_st   = "0" + hours.toString();
    }
    if (minutes < 10) {
      minutes_st = "0" + minutes.toString();
    }
    if (seconds < 10) {
      seconds_st = "0" + seconds.toString();
    }

    this.formatted_time = '';
    if (hours > 0) {
      this.formatted_time += hours_st + ':';
    }
    this.formatted_time += minutes_st;
    if (this.showSeconds) {
      this.formatted_time += ':' + seconds_st;
    }
    return this.formatted_time;
  }

  stopSteps(){
    this.loadStopGetData();
    if(this.platform.is('cordova')){
      this.stepcounter.stop();
    }
  }

  loadInitGetData() {
    const loader = this.loadingCtrl.create({
      content: "Iniciando toma de datos...",
      duration: 1000
    });
    loader.present();
  }

  loadStopGetData() {
    const loader = this.loadingCtrl.create({
      content: "Finalizando toma de datos...",
      duration: 1000
    });
    loader.present();

    loader.onDidDismiss(()=>{
        this.navCtrl.pop();
    })
  }

  dateTime(){
    //this.today = new Date();
    var myDay = new Date()
    var m = myDay.getMonth()+1
    this.save_time = myDay.getDate()+'-'+m+'-'+myDay.getFullYear()
    /*var seg = Number(today.getSeconds());
    var ss = String(today.getSeconds());
    var min = Number(today.getMinutes());
    var mi = String(today.getMinutes());
    var hh = String(today.getHours());
    var dd = String(today.getDate());
    var mm = String(today.getMonth() + 1); //January is 0!
    var yyyy = today.getFullYear();
    this.date = yyyy+'-'+mm+'-'+dd;
    if(min>=0&&min<10){
      mi = 0+mi
    };
    if(seg>=0&&seg<10){
      ss = 0+ss
    };
    this.hour = hh+':'+mi+':'+ss;*/
  /*}

  onInterval(){
    this.stepcounter.getStepCount().then(steps =>{
      this.steps = steps;
      console.log(this.steps)
    });
    this.today = new Date().toString();   
    this.dateTime();
    var data_steps ={
      eid : this.excercise.id,
      id : Date.now(),
      date : this.today,
      save_time: this.save_time,
      type : 'Caminata',
      steps : this.steps,
      lat : this.lat,
      lng : this.lng,
      alt : this.alt,
      speed : this.speed,
    };
    if(this.platform.is('cordova')){
      this.stepsDbService.create(data_steps).then(response => {
        this.steps_tasks.unshift( data_steps );
      });
    }
  }*/

}
