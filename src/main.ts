import SoundManager from "./scripts/SoundManager";
export var userNumber:number = 0 ;
export var overlay;
export var content;
document.addEventListener("DOMContentLoaded", () => {
  overlay = document.getElementById("overlay") as HTMLDivElement;
  content = document.getElementById("content") as HTMLDivElement;

  overlay.addEventListener("click", () => {
    userNumber+=1;
    overlay.style.display = "none";
    content.style.display = "block";
    initApp();
    
  });
});

export const SoundManagerInstance = SoundManager.getSoundManagerInstance();

function initApp() {
  // async () => {
  // const { onInitialized } = await import("@needle-tools/engine") /* async import of needle engine */;

  // onInitialized((context) => {
  // console.log(context);
  // const scene = context.scene;
  // const soundManager = new SoundManager();
  // (window as any).soundManager = soundManager;
  // (context as any).soundManager = soundManager;
  // });

  console.log("App Initialization Started");
  SoundManagerInstance.createAudioCtx();
}
// }
