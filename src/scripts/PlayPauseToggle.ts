import { serializable } from "@needle-tools/engine";
import { idle } from "./idleBehaviour";

export class PlayPauseToggle extends idle {
  @serializable()
  boundKey: string = "";
  start() {
    window.addEventListener("keydown", (e) => {
      if (e.key === this.boundKey) {
        this.boundKeyButtonTriggered();
        this.context.connection.send(this.boundKey+" Button Remote Clicked")
        console.log(this.boundKey + " Triggered");
      }
    });
  }
    onEnable(): void {
        this.context.connection.beginListen(this.boundKey+" Button Remote Clicked", this.buttonRemoteToggled);
    }
    onDisable(): void {
        this.context.connection.stopListen(this.boundKey+" Button Remote Clicked" , this.buttonRemoteToggled);
    }

    buttonRemoteToggled(){
        if(!this.audioCtx||!this.audioPanner||!this.volumeGain){
            this.buttonRemoteToggled()
        }else{
            this.boundKeyButtonTriggered()
        }
    }
}
