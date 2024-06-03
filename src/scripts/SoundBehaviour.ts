import { Behaviour, serializable } from "@needle-tools/engine";
import SoundManager from "./SoundManager";
import { Vector3 } from "three";
import { SoundManagerInstance } from "../main";
// import { }

declare type AudioClip = string;

export class SoundBehaviour extends Behaviour {
  initStatement: boolean = false;

  @serializable(URL)
  soundFileUrl: AudioClip | null = null;

  bufferSourceNode: AudioBufferSourceNode | null = null;
  audioCtx: AudioContext | null = null;

  audioBuffer: AudioBuffer | null = null;

  lowShelfFilter :BiquadFilterNode|null =null ;
  highShelfFilter :BiquadFilterNode|null =null ;
  filterUpdateNeeded:boolean=false;
  highShelfFreq:number=20000;
  lowShelfFreq:number=10;

  audioPanner: PannerNode | null = null;
  pannerVector3: Vector3 = new Vector3(0, 0, 0);

  objectPosition:Vector3|null = null;
  relPositionToCam:Vector3|null = null;


  volumeGain: GainNode | null = null;

  isPlaying: boolean = false;
  volumeValue: number = 1;

  SoundManagerInstance = SoundManager.getSoundManagerInstance();

  onEnable() {}
  // get soundManager(): SoundManager {
  //   return (this.context as any).soundManager;
  // }
  // get audioContext() {
  //   return this.soundManager.audioCtx;
  // }
  async initSound() {
    if (!this.soundFileUrl) {
      throw new Error(
        "--------Sound File " + this.name + " Not Selected--------"
      );
    } else {
      console.log(this.soundFileUrl);
      // this.audioCtx = this.SoundManagerInstance.audioCtx;
      if (!this.audioCtx) {
        console.error("========== Audio Context Not Loaded ==========");
      } else {
        console.log(this);
        const response = await fetch(this.soundFileUrl);
        const arrayBuffer = await response.arrayBuffer();
        this.audioBuffer = await this.audioCtx.decodeAudioData(arrayBuffer);

        this.audioPanner = new PannerNode(this.audioCtx, {
          panningModel: "HRTF",
          distanceModel: "inverse",
          refDistance: 1,
          maxDistance: 1000,
          rolloffFactor: 1,
          coneInnerAngle: 360,
          coneOuterAngle: 0,
          coneOuterGain: 0,
          orientationX: 1,
          orientationY: 0,
          orientationZ: 0,
          positionX: this.pannerVector3.x,
          positionY: this.pannerVector3.y,
          positionZ: this.pannerVector3.z,
        });
        this.lowShelfFilter = this.audioCtx.createBiquadFilter()
        this.highShelfFilter = this.audioCtx.createBiquadFilter()
        this.lowShelfFilter.type = "lowshelf"
        this.highShelfFilter.type = "highshelf"

        this.volumeGain = this.audioCtx.createGain();
        this.volumeGain.gain.setValueAtTime(
          this.volumeValue,
          this.audioCtx.currentTime
        );

        this.bufferSourceNode = this.audioCtx.createBufferSource();
        this.bufferSourceNode.buffer = this.audioBuffer;
        this.bufferSourceNode.connect(this.audioPanner);
        this.audioPanner.connect(this.volumeGain);
        console.log("------- Object Nodes Connected -------");
        this.SoundManagerInstance.addObject(this);
      }
    }
  }
  getPannerSta():Vector3{
    if(!this.context.mainCamera){
      console.error("Camera Not Loaded");
      return new Vector3(0,0,0)
    }else{
    const objectPosition = this.gameObject.position
    const relPositionToCam = new Vector3().subVectors(objectPosition,this.context.mainCamera.position)
    const cameraDirection = new Vector3()
    this.context.mainCamera.getWorldDirection(cameraDirection)
    const rightVector = new Vector3().crossVectors(cameraDirection,this.context.mainCamera.up)
    const normOnX = relPositionToCam.dot(rightVector) / rightVector.length();
    const normOnY = relPositionToCam.dot(this.context.mainCamera.up) / this.context.mainCamera.up.length();
    const normOnZ = relPositionToCam.dot(cameraDirection) / cameraDirection.length();
    var relCoords = new Vector3(normOnX,normOnY,normOnZ);
  }
  return relCoords
}

  update() {
    if (
      this.initStatement === false &&
      SoundManagerInstance.audioCtx !== null
    ) {
      this.initStatement = true;
      // console.log("!!!!! AUDIO CONTEXT LOADED !!!!!");
      // console.log("!!!!! READY TO START PLAYING !!!!!");
      this.audioCtx = this.SoundManagerInstance.audioCtx;
      this.initSound();
    }

    if(this.filterUpdateNeeded===true){
      if(this.audioCtx&&this.lowShelfFilter&&this.highShelfFilter){
      this.lowShelfFilter.frequency.setValueAtTime(this.lowShelfFreq,this.audioCtx.currentTime)
      this.highShelfFilter.frequency.setValueAtTime(this.highShelfFreq,this.audioCtx.currentTime)
      this.filterUpdateNeeded=false;
    }}

    if(!this.audioCtx){
      console.error("AudioContext Error")
    // }else if(!this.audioPanner){
    //   console.error("AudioPanner Error")
    }else{
    this.audioPanner?.positionX.setValueAtTime(this.getPannerSta().x,this.audioCtx.currentTime)
    this.audioPanner?.positionY.setValueAtTime(this.getPannerSta().y,this.audioCtx.currentTime)
    this.audioPanner?.positionZ.setValueAtTime(this.getPannerSta().z,this.audioCtx.currentTime)
    // console.log("position updated")
  }}
  //   boundKeyButtonTriggered() {
  //     if(this.isPlaying===false){
  //     this.bufferSourceNode?.start();
  //     console.log("Playing");
  //     this.isPlaying=true
  //   }if(this.isPlaying===true){
  //     this.bufferSourceNode?.stop();
  //     console.log("Playing");
  //     this.isPlaying=false
  //   }

  // }
  boundKeyButtonTriggered() {
    if (!this.audioPanner || !this.audioCtx) {
      console.error("Audio Nodes not Connected");
    } else {
      if (this.isPlaying === false) {
        this.bufferSourceNode = this.audioCtx.createBufferSource();
        this.bufferSourceNode.buffer = this.audioBuffer;
        this.bufferSourceNode.connect(this.audioPanner);
        this.bufferSourceNode.start(Math.random()*0.5);
        console.log("Playing");
        this.isPlaying = true;
      } else if (this.isPlaying === true && this.bufferSourceNode) {
        this.bufferSourceNode.stop();
        this.bufferSourceNode.disconnect();
        this.bufferSourceNode = null;
        console.log("Paused");
        this.isPlaying = false;
      }
    }
  }
}
