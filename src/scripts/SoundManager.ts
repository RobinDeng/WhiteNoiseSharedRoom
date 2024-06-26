import { serializable } from "@needle-tools/engine";
import { SoundBehaviour } from "./SoundBehaviour";

export class SoundManager {
  private static instance: SoundManager;

  public static getSoundManagerInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }
  @serializable(URL)
  IRSmall:URL|null=null;
  IRMedium:URL|null=null;
  IRLarge:URL|null=null;
  // audioCtx = new AudioContext();
  audioCtx: AudioContext | null = null;

  masterGain: GainNode | null = null;

  convolverSmall: ConvolverNode | null = null;
  convolverMedium: ConvolverNode | null = null;
  convolverLarge: ConvolverNode | null = null;
  convolverNone: GainNode | null = null;
  convovlerActivated:number=0;
  switchCoolDown:boolean=false;

  fadeGainSmall: GainNode | null = null;
  fadeGainMedium: GainNode | null = null;
  fadeGainLarge: GainNode | null = null;

  behaviours: SoundBehaviour[] = [];

  // awake(){
  // this.audioCtx = new AudioContext();
  // this.masterGain = this.audioCtx.createGain();

  // this.convolverSmall = this.audioCtx.createConvolver();
  // this.convolverMedium = this.audioCtx.createConvolver();
  // this.convolverLarge = this.audioCtx.createConvolver();
  // this.convolverNone = this.audioCtx.createGain()

  // this.fadeGainSmall = this.audioCtx.createGain();
  // this.fadeGainMedium = this.audioCtx.createGain();
  // this.fadeGainLarge= this.audioCtx.createGain();

  // }

  public createAudioCtx() {
    this.audioCtx = new AudioContext();
    // this.audioCtx = new AudioContext();
    this.masterGain = this.audioCtx.createGain();

    this.convolverSmall = this.audioCtx.createConvolver();
    this.convolverMedium = this.audioCtx.createConvolver();
    this.convolverLarge = this.audioCtx.createConvolver();
    this.convolverNone = this.audioCtx.createGain();
    this.convovlerActivated = 0;

    this.fadeGainSmall = this.audioCtx.createGain();
    this.fadeGainMedium = this.audioCtx.createGain();
    this.fadeGainLarge = this.audioCtx.createGain();
    if (
      !this.convolverSmall ||
      !this.convolverMedium ||
      !this.convolverLarge ||
      !this.convolverNone ||
      !this.masterGain ||
      !this.fadeGainSmall ||
      !this.fadeGainMedium ||
      !this.fadeGainLarge
    ) {
      console.log("Node Not Loaded");
    } else {
      this.convolverNone.gain.setValueAtTime(1., this.audioCtx.currentTime);
      this.masterGain.gain.setValueAtTime(1, this.audioCtx.currentTime);
      this.fadeGainSmall.gain.setValueAtTime(0,this.audioCtx.currentTime)
      this.fadeGainMedium.gain.setValueAtTime(0,this.audioCtx.currentTime)
      this.fadeGainLarge.gain.setValueAtTime(0,this.audioCtx.currentTime)

      this.masterGain.connect(this.convolverSmall);
      this.masterGain.connect(this.convolverMedium);
      this.masterGain.connect(this.convolverLarge);
      this.masterGain.connect(this.convolverNone);
      this.convolverSmall.connect(this.fadeGainSmall);
      this.convolverMedium.connect(this.fadeGainMedium);
      this.convolverLarge.connect(this.fadeGainLarge);
      this.fadeGainSmall.connect(this.audioCtx.destination);
      this.fadeGainMedium.connect(this.audioCtx.destination);
      this.fadeGainLarge.connect(this.audioCtx.destination);
      this.convolverNone.connect(this.audioCtx.destination);
      console.log("======= Sound Manager Nodes Connected ======");
      const convolverButton = document.getElementById('ConvolverSwitchButton');
      this.setUpConvolvers()
      if (convolverButton) {
        // 添加点击事件监听器
        convolverButton.addEventListener('click', () => {
          this.switchConvolver()
      });
    } else {
        console.error('Button element not found!');
    }
    }
  }
  switchConvolver(){
    if(!this.fadeGainSmall||!this.fadeGainMedium||!this.fadeGainLarge||!this.convolverNone||!this.audioCtx){
      return
    }else{
    if(this.switchCoolDown===false){
        this.switchCoolDown=true
        setTimeout(()=>{
          this.switchCoolDown=false
        },1000)
        this.convovlerActivated+=1
        
        const gainNodes:GainNode[]=[this.convolverNone,this.fadeGainSmall,this.fadeGainMedium,this.fadeGainLarge]
        gainNodes[(this.convovlerActivated-1)%gainNodes.length].gain.exponentialRampToValueAtTime(0.01,this.audioCtx.currentTime+1)
        gainNodes[this.convovlerActivated%gainNodes.length].gain.exponentialRampToValueAtTime(1,this.audioCtx.currentTime+1)
  }
  }}

  async setUpConvolvers() {
    if (
      !this.audioCtx ||
      !this.convolverSmall ||
      !this.convolverMedium ||
      !this.convolverLarge
    ) {
      console.log("Convolvers Not Yet Created");
    // } else if(!this.IRSmall||!this.IRMedium||!this.IRLarge){
    //   console.error("Unable to load IR Files")
    }else{
      const responseSmall = await fetch("../../assets/0_8s_small.mp3");
      const responseMeidum = await fetch("../../assets/2_0s_medium.mp3");
      const responseLarge = await fetch("../../assets/2_9s_large.wav");

      const arrayBuffer_convolverSmall = await responseSmall.arrayBuffer();
      const arrayBuffer_convolverMedium = await responseMeidum.arrayBuffer();
      const arrayBuffer_convolverLarge = await responseLarge.arrayBuffer();

      this.convolverSmall.buffer = await this.audioCtx.decodeAudioData(
        arrayBuffer_convolverSmall
      );
      this.convolverMedium.buffer = await this.audioCtx.decodeAudioData(
        arrayBuffer_convolverMedium
      );
      this.convolverLarge.buffer = await this.audioCtx.decodeAudioData(
        arrayBuffer_convolverLarge
      );
    }
  }

  public get volume() {
    if (!this.masterGain) {
      return 0;
    } else {
      return this.masterGain.gain.value;
    }
  }
  public set volume(val: number) {
    if (!this.masterGain) {
      return;
    }
    if (!this.audioCtx) {
      return;
    }
    this.masterGain.gain.setValueAtTime(val, this.audioCtx.currentTime);
  }

  addObject(behaviour: SoundBehaviour) {
    if (!this.masterGain) {
      return;
    }
    this.behaviours.push(behaviour);
    if (behaviour.volumeGain) {
      behaviour.volumeGain.connect(this.masterGain);
    }
    if (behaviour.soundFileUrl) {
      console.log(behaviour.soundFileUrl);
    }
  }
}

export default SoundManager;
