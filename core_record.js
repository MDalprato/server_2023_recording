
const fs = require('fs');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const mongoose = require("mongoose");


ffmpeg.setFfmpegPath(ffmpegPath);

const savePathLive = (__dirname + '/recs/');


function createFolder(camId) {
  var dir = savePathLive + formatCamId(camId) + '/Live';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function formatCamId(camId) {
  return ('0' + camId).slice(-2);
}

function getHlsStreamPath(camId) {
  const data = savePathLive + formatCamId(camId) + "/Live/stream.m3u8";
  console.log(data)
  return data;
}

mongoose.connect('mongodb://localhost:27017/rec_test');


const outputOptions = [

  '-c:v copy',
  '-c:a copy',
  `-segment_time 10`,
  `-segment_list 5`,
  `-hls_time 10`,
  `-hls_init_time 10`,
  `-hls_flags delete_segments`,
];

const prova = [

  "-c:v libx264",
  "-c:a aac",
  "-ac 1",
  "-strict -2",
  "-crf 18",
  "-profile:v baseline",
  "-maxrate 400k",
  "-bufsize 1835k",
  "-pix_fmt yuv420p",
  "-hls_list_size 6",
  "-hls_wrap 10",
  `-segment_time 10`,
  `-segment_list 5`,
  `-hls_time 10`,
  `-hls_init_time 10`,
  `-hls_flags delete_segments`,
]

function loadHLS(url, camId) { // do something when encoding is done }

  console.log("loadHLS, url = " + url + " camId = " + camId)
  createFolder(camId);        // create folder

  ffmpeg(url, { timeout: 432000 })
    .addOptions(prova)
    .output(getHlsStreamPath(camId))
    // .on("end", loadHLS)
    .on('error', function (err) {
      console.log('An error occurred: ' + err.message);
    })
    .on('start', function (commandLine) {
      console.log('Spawned Ffmpeg with command: ' + commandLine);
    })
    .on('codecData', function (data) {
      console.log('Input is ' + data.audio + ' audio ' + 'with ' + data.video + ' video');
    })
    .on('stderr', function (stderrLine) {
      console.log('stderr');

      //writeTsToDb(stderrLine, camId);
    })
    .on('progress', function (progress) {
      console.log("progress")
      //{"frames":37,"currentFps":0,"currentKbps":null,"targetSize":null,"timemark":"00:00:02.30"}
    })
    .run()

};

// function writeTsToDb(stderrLine, camId) {

//   if (stderrLine.includes('Opening')) {

//     var arrStr = stderrLine.split(/(?:^|\s)'([^']*?)'(?:$|\s)/);

//     console.log("Create new file -> " + stderrLine + arrStr[1])

//     const currentDate = new Date();

//     const currentTsData = {
//       cameraId: camId,
//       startTime: currentDate.getTime(),
//       path: arrStr[1],
//     }

//     insertRecFrame.addSingleFrameToDb(currentTsData).then(function (result) {
//       console.log(result)
//     });


//   }

// }

loadHLS("rtsp://root:Abcd123$@192.168.5.126:554/axis-media/media.amp?videocodec=h264&camera=1&resolution=640x360", 1)