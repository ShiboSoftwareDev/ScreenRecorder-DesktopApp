const videoElement = document.querySelector("video");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const videoSelectBtn = document.getElementById("videoSelectBtn");
videoSelectBtn.onclick = getVideoSources;

startBtn.onclick = (e) => {
  mediaRecorder.start();
  startBtn.classList.add("is-danger");
  startBtn.innerText = "Recording";
  stopBtn.disabled = false;
};

stopBtn.onclick = (e) => {
  mediaRecorder.stop();
  startBtn.classList.remove("is-danger");
  startBtn.innerText = "Start";
  stopBtn.disabled = true;
};

async function getVideoSources() {
  const inputSources = await window.electronAPI.videoSelectBtnClicked();
}

let mediaRecorder;

async function selectSource(source) {
  videoSelectBtn.innerText = source.name;
  startBtn.disabled = false;
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

  const options = { mimeType: "video/webm; codecs=vp9" };
  mediaRecorder = new MediaRecorder(stream, options);

  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.onstop = handleStop;
}

let recordedChunks = [];

function handleDataAvailable(e) {
  recordedChunks.push(e.data);
}

async function handleStop(e) {
  const blob = new Blob(recordedChunks, {
    type: "video/webm; codecs=vp9",
  });
  let buffer = await blob.arrayBuffer();
  recordedChunks = [];
  const whatever = await window.electronAPI.sendStream(buffer);
}

window.electronAPI.sourceSelected((value) => {
  selectSource(value);
});
