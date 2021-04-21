/* Object Removal Filter Javascript Code
Filter process:
- code processes video stream frame by frame
- processes the frame with the given model and returns the frame (with objects filtered)
- reconstructs the stream (with delay)
*/

const video = document.getElementById("webcam");

var canvas_bp = document.getElementById("canvas-bp");
var canvas_bp_ctx = canvas_bp.getContext("2d");


/*
BODYPIX MODEL
*/

const bodyPixProperties = {
  //can also be ResNet archtecture
  architecture: "MobileNetV1",
  outputStride: 16,
  multiplier: 0.75,
  quantBytes: 4
};

const segmentationProperties = {
  flipHorizontal: false,
  internalResolution: "high",
  segmentationThreshold: 0.9,
  scoreThreshold: 0.2
};

/*
MODEL IMPLEMENTATION
*/

var ready = true;
var model = undefined;

bodyPix.load(bodyPixProperties).then(function (model_bp) {
  model = model_bp;
});

// function filter(model) {
//   if (ready) {
//     sourceCanvas_ctx.drawImage(video, 0, 0);
//     ready = false;

//     var segmentation = model.segmentPerson(sourceCanvas, segmentationProperties);

//     //copy-pasted
//     const coloredPartImage = bodyPix.toMask(segmentation);
//     const opacity = 0.7;
//     const flipHorizontal = false;
//     const maskBlurAmount = 0;
//     const canvas = document.getElementById("canvas");
//     // Draw the mask image on top of the original image onto a canvas.
//     // The colored part image will be drawn semi-transparent, with an opacity of
//     // 0.7, allowing for the original image to be visible under.
//     var mask_imagedata = bodyPix.drawMask(
//       canvas,
//       img,
//       coloredPartImage,
//       opacity,
//       maskBlurAmount,
//       flipHorizontal
//     );

//     processFrame(webcamCanvas, mask_imagedata);
//     ready = true;
//   }

//   window.requestAnimationFrame(filter(model));
// }

function paintToCanvas() {
  setInterval(() =>{ canvas_bp_ctx.drawImage(video,0,0,video.videoWidth, video.videoHeight);
  }, 16);
  }

// main

//starts all webcam streams
if (navigator.mediaDevices.getUserMedia) {
  const user_params = {
    video: true,
    // video_bp: true
  };

  navigator.mediaDevices
    .getUserMedia(user_params)
    .then(function (stream) {
      video.srcObject = stream;

    //   video_bp.addEventListener("loadeddata", filter(model));
      // setInterval(() =>{ 
      //   canvas_bp_ctx.drawImage(video,0,0,canvas_bp.width, canvas_bp.height);
      // }, 16);
      paintToCanvas();
    })
    .catch(function (problem) {
      console.log("An Error Occurred");
    });
}

//sourceCanvas contains the original webcam data
var sourceCanvas = document.createElement("canvas");
var sourceCanvas_ctx = sourceCanvas.getContext("2d");

// Remember considering time taken for model to load

