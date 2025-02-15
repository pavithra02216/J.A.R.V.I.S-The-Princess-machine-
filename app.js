const turn_on = document.querySelector("#turn_on");
const princess_intro = document.querySelector("#j_intro");
const time = document.querySelector("#time");
const machine = document.querySelector(".machine");
let stoppingR = false;
let princessComs = [];
princessComs.push("hi princess");
princessComs.push("what are your commands");
princessComs.push("close this - to close opened popups");
princessComs.push("change my information - information regarding your accounts and you");
princessComs.push("are you there - to check princess's presence");
princessComs.push("shut down - stop voice recognition");
princessComs.push("open google");
princessComs.push('search for "your keywords" - to search on google ');
princessComs.push("open whatsapp");
princessComs.push("open youtube");
princessComs.push('play "your keywords" - to search on youtube ');
princessComs.push("close this youtube tab - to close opened youtube tab");
princessComs.push("open instagram");
princessComs.push("open my instagram profile");
let ytbWindow;

console.warn('*to check for the commands speak "what are your commands"');

let date = new Date();
let hrs = date.getHours();
let mins = date.getMinutes();
let secs = date.getSeconds();
let charge, chargeStatus, connectivity, currentTime;
chargeStatus = "unplugged";

window.onload = () => {
  turn_on.addEventListener("ended", () => {
    setTimeout(() => {
      readOut("Ready to go sir");
      if (localStorage.getItem("princess_setup") === null) {
        readOut("Sir, kindly fill out the form on your screen so that you could access most of my features and if you want to see my commands see a warning in the console");
      }
    }, 200);
  });

  princessComs.forEach((e) => {
    document.querySelector(".commands").innerHTML += `<p>#${e}</p><br />`;
  });

  let batteryPromise = navigator.getBattery();
  batteryPromise.then(batteryCallback);

  if (navigator.onLine) {
    document.querySelector("#internet").textContent = "online";
    connectivity = "online";
  } else {
    document.querySelector("#internet").textContent = "offline";
    connectivity = "offline";
  }

  setInterval(() => {
    if (navigator.onLine) {
      document.querySelector("#internet").textContent = "online";
      connectivity = "online";
    } else {
      document.querySelector("#internet").textContent = "offline";
      connectivity = "offline";
    }
  }, 60000);

  function batteryCallback(batteryObject) {
    printBatteryStatus(batteryObject);
    setInterval(() => {
      printBatteryStatus(batteryObject);
    }, 5000);
  }

  function printBatteryStatus(batteryObject) {
    document.querySelector("#battery").textContent = `${(batteryObject.level * 100).toFixed(2)}%`;
    charge = batteryObject.level * 100;
    if (batteryObject.charging === true) {
      document.querySelector(".battery").style.width = "200px";
      document.querySelector("#battery").textContent = `${(batteryObject.level * 100).toFixed(2)}% Charging`;
      chargeStatus = "plugged in";
    }
  }
};

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? 12 : 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  currentTime = strTime;
  time.textContent = strTime;
}

formatAMPM(date);
setInterval(() => {
  formatAMPM(date);
}, 60000);

function autoPrincess() {
  setTimeout(() => {
    recognition.start();
  }, 1000);
}

document.querySelector("#start_princess_btn").addEventListener("click", () => {
  recognition.start();
});

document.querySelector("#stop_princess_btn").addEventListener("click", () => {
  stoppingR = true;
  recognition.stop();
});

const setup = document.querySelector(".princess_setup");
setup.style.display = "none";
if (localStorage.getItem("princess_setup") === null) {
  setup.style.display = "flex";
  setup.querySelector("button").addEventListener("click", userInfo);
}

function userInfo() {
  let setupInfo = {
    name: setup.querySelectorAll("input")[0].value,
    bio: setup.querySelectorAll("input")[1].value,
    location: setup.querySelectorAll("input")[2].value,
    instagram: setup.querySelectorAll("input")[3].value,
    twitter: setup.querySelectorAll("input")[4].value,
    github: setup.querySelectorAll("input")[5].value,
  };

  let testArr = [];

  setup.querySelectorAll("input").forEach((e) => {
    testArr.push(e.value);
  });

  if (testArr.includes("")) {
    readOut("sir enter your complete information");
  } else {
    localStorage.clear();
    localStorage.setItem("princess_setup", JSON.stringify(setupInfo));
    setup.style.display = "none";
  }
}

let speech_lang = "en-US";
if (localStorage.getItem("lang") === null) {
  localStorage.setItem("lang", "en-US");
}

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.lang = localStorage.getItem("lang");

var synth = window.speechSynthesis;

recognition.onstart = function () {
   
  console.log("voice recognition activated");
  document.querySelector("#stop_princess_btn").style.display = "flex";
};

let windowsB = [];

recognition.onresult = async function (event) {
  let current = event.resultIndex;
  let transcript = event.results[current][0].transcript;
  transcript = transcript.toLowerCase();
  let userData = localStorage.getItem("princess_setup");
  console.log(transcript);

  if (localStorage.getItem("lang") === "en-US") {
    if (transcript.includes("hi, princess.")) {
      readOut("hello sir");
    }

    if (transcript.includes("what's the current charge")) {
      readOut(`the current charge is ${charge}`);
    }
    if (transcript.includes("what's the charging status")) {
      readOut(`the current charging status is ${chargeStatus}`);
    }
    if (transcript.includes("current time")) {
      readOut(currentTime);
    }
    if (transcript.includes("connection status")) {
      readOut(`you are ${connectivity} sir`);
    }
    if (transcript.includes("what are your commands")) {
      readOut("sir here's the list of commands i can follow");
      if (window.innerWidth <= 400) {
        window.resizeTo(screen.width, screen.height);
      }
      document.querySelector(".commands").style.display = "block";
    }
    if (transcript.includes("tell about yourself")) {
      readOut("sir, i am princess, your personal assistant,created by prince chand i can help you with your daily tasks, i can open websites for you, i can search for you, i can do a lot of things for you, just tell me what to do ");
    }
    if (transcript.includes("close this")) {
      readOut("closing the tab sir");
      document.querySelector(".commands").style.display = "none";
      if (window.innerWidth >= 401) {
        window.resizeTo(250, 250);
      }
      setup.style.display = "none";
    }
    if (transcript.includes("change my information")) {
      readOut("Opening the information tab sir");
      localStorage.clear();
      if (window.innerWidth <= 400) {
        window.resizeTo(screen.width, screen.height);
      }
      setup.style.display = "flex";
      setup.querySelector("button").addEventListener("click", userInfo);
    }
    if (transcript.includes("are you there")) {
      readOut("yes sir");
    }
    if (transcript.includes("shut down")) {
      readOut("Ok sir i will take a nap");
      stoppingR = true;
      recognition.stop();
    }
    if (transcript.includes("open whatsapp")) {
      readOut("opening whatsapp");
      let a = window.open("https://web.whatsapp.com/");
      windowsB.push(a);
    }
  
    if (transcript.includes("what's my name")) {
      readOut(`Sir, I know that you are ${JSON.parse(userData).name}`);
    }
    if (transcript.includes("what's my bio")) {
      readOut(`Sir, I know that you are ${JSON.parse(userData).bio}`);
    }
    if (transcript.includes("open google")) {
      readOut("opening google");
      let a = window.open("https://www.google.com/");
      windowsB.push(a);
    }
    if (transcript.includes("search for")) {
      readOut("here's your result");
      let input = transcript.split("");
      input.splice(0, 11);
      input.pop();
      input = input.join("").split(" ").join("+");
      let a = window.open(`https://www.google.com/search?q=${input}`);
      windowsB.push(a);
    }
    if (transcript.includes("open youtube")) {
      readOut("opening youtube sir");
      let a = window.open("https://www.youtube.com/");
      windowsB.push(a);
    }
    if (transcript.includes("play")) {
      let playStr = transcript.split("");
      playStr.splice(0, 5);
      let videoName = playStr.join("");
      playStr = playStr.join("").split(" ").join("+");
      readOut(`searching youtube for ${videoName}`);
      let a = window.open(`https://www.youtube.com/search?q=${playStr}`);
      windowsB.push(a);
    }
    if (transcript.includes("open instagram")) {
      readOut("opening instagram sir");
      let a = window.open("https://www.instagram.com");
      windowsB.push(a);
    }
    if (transcript.includes("open my instagram profile")) {
      if (JSON.parse(userData).instagram) {
        readOut("opening your instagram profile");
        let a = window.open(`https://www.instagram.com/${JSON.parse(userData).instagram}/`);
        windowsB.push(a);
      } else {
        readOut("sir i didn't found your instagram information");
      }
    }
   
    if (transcript.includes("close all tabs")) {
      readOut("closing all tabs sir");
      windowsB.forEach((e) => {
        e.close();
      });
    }
  }
};

recognition.onend = function () {
  if (stoppingR === false) {
    setTimeout(() => {
      recognition.start();
    }, 500);
  } else if (stoppingR === true) {
    recognition.stop();
    document.querySelector("#stop_princess_btn").style.display = "none";
  }
};

function readOut(message) {
  const speech = new SpeechSynthesisUtterance();
  const allVoices=speechSynthesis.getVoices();
  speech.text = message;
  speech.voice=allVoices[4];
  speech.volume = 1;
  window.speechSynthesis.speak(speech);
  console.log("Speaking out");
}



const smallPrincess = document.querySelector("#small_princess");

smallPrincess.addEventListener("click", () => {
  window.open(`${window.location.href}`, "newWindow", "menubar=true,location=true,resizable=false,scrollbars=false,width=200,height=200,top=0,left=0");
  window.close();
});

document.querySelector("#princess_start").addEventListener("click", () => {
  recognition.start();
});


// const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
// const recognition = new SpeechRecognition();
// recognition.continuous = true;
// recognition.lang = localStorage.getItem("lang");

// recognition.onresult = async function (event) {
//     let current = event.resultIndex;
//     let transcript = event.results[current][0].transcript;
//     transcript = transcript.toLowerCase();
//     console.log(transcript);

// recognition.onend = function () {
//     if (stoppingR === false) {
//       setTimeout(() => {
//         recognition.start();
//       }, 500);
//     }
//   };
  
  
