// import SoundManager from "./scripts/SoundManager";
import { overlay, content , SoundManagerInstance } from "./main";
var userNumber: number = 0;

document.addEventListener("DOMContentLoaded", () => {
    console.log(userNumber+" USER(S) IN THE ROOM !");
    overlay.addEventListener("click", () => {
    userNumber+=1;
  //   overlay.style.display = "none";
  //   content.style.display = "block";
      
  });
});
