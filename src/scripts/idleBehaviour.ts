import { serializable } from "@needle-tools/engine";
// import SoundManager from "./SoundManager";
import  {SoundBehaviour} from "./SoundBehaviour";

export class idle extends SoundBehaviour {
    processIndex:number = 0
    @serializable()
    processLength:number = 100;
    movementSpeed:number = 0.002
    smoothenThreshold:number = 0.6
    direction:boolean = true;
    smoothenedSpeed:number = 0

    awake(){
        super.onEnable();
    }
    
    update(){
        super.update();
        if(this.isPlaying){
            this.spinAndFloat();
        }
        
    }
    spinAndFloat(){
        this.gameObject.rotateY(this.context.time.deltaTime)
        
        this.processIndex+=1;
        if(this.processIndex>this.processLength){
            this.processIndex=0
            this.direction=!this.direction
        }

        let smoothFactor = 1
        if(this.processIndex<this.smoothenThreshold){
            smoothFactor = this.processIndex/(this.processLength * this.smoothenThreshold)
        }else if(this.processIndex>this.processLength*(1-this.smoothenThreshold)){
            smoothFactor = (this.processLength - this.processIndex)/(this.processLength*this.smoothenThreshold)
        }

        this.smoothenedSpeed = this.movementSpeed * smoothFactor;

        const deltaTime = this.context.time.deltaTime
        const distanceToMove = this.smoothenedSpeed * deltaTime;

        if(this.direction===true){
            this.gameObject.position.y +=this.smoothenedSpeed
        }
        if(this.direction===false){
            this.gameObject.position.y -=this.smoothenedSpeed
        }
    }
}


