const videoElement = document.querySelector("video");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const videoSelectBtn = document.getElementById("videoSelectBtn");
videoSelectBtn.onclick = getVideoSources;

async function getVideoSources() {
  const inputSources = await window.electronAPI.videoSelectBtnClicked();
}

async function selectSource(source) {
  videoSelectBtn.innerText = source.name;
  const constraints = {
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: "desktop",
        chromeMediaSourceId: source.id,
      },
    },
  };
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  videoElement.srcObject = stream;
  videoElement.play();
}

window.electronAPI.sourceSelected((value) => {
  selectSource(value);
});
