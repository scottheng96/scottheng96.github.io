/* Object Removal Filter Javascript Code
Filter process:
- code processes video stream frame by frame
- processes the frame with the given model and returns the frame (with objects filtered)
- reconstructs the stream (with delay)
*/
console.log(tf.getBackend());

const video = document.getElementById("webcam");

const width = video.videoWidth;
const height = video.videoHeight;

var canvas_bp = document.getElementById("canvas-bp");
var canvas_bp_ctx = canvas_bp.getContext("2d");

canvas_bp_ctx.width = width;
canvas_bp_ctx.height = height;


/*
BODYPIX MODEL
*/

const bodyPixProperties = {
  //can also be ResNet archtecture
  architecture: "MobileNetV1",
  outputStride: 16,
  quantBytes: 4
};

const segmentationProperties = {
  flipHorizontal: false,
  internalResolution: "high",
  segmentationThreshold: 0.5,
  scoreThreshold: 0.2
};


/*
MODEL IMPLEMENTATION
*/


const loadBodyPixModel = async () => {
  try {
    console.log("trying to load model");
    const model_load = await bodyPix.load();
    console.log("Body-Pix model loaded.");
    ready = true;
    return model_load;
  }catch (error) {
    console.log("Body-Pix model not loaded successfully");
    console.log(error);
    return undefined;
  }
};

var ready = false;
const model = loadBodyPixModel();
console.log(model);

function filter() {
  if (ready) {
    var frame = getNextFrame();
    var personSegment = frameSegmentation(frame);
    console.log("personSegmentSuccessful");
    console.log(personSegment);
    // updateFeed(personSegment, frame);
    canvas_bp_ctx.drawImage(video,0,0,canvas_bp.width, canvas_bp.height)
  }
}

function filterInterval() {
  setInterval(() =>{ filter();
  }, 16);
}

//gets the nextframe in the webcam
function getNextFrame() {
  return sourceCanvas_ctx.drawImage(video,0,0,canvas_bp.width,canvas_bp.height);
};

const frameSegmentation = async (frame) => {
  var segmentation = await model.segmentPerson(sourceCanvas, segmentationProperties);
  // const segmentation = await model.segmentMultiPerson(frame, {
  //   flipHorizontal: false,
  //   internalResolution: 'medium',
  //   segmentationThreshold: 0.7,
  //   maxDetections: 10,
  //   scoreThreshold: 0.2,
  //   nmsRadius: 20,
  //   minKeypointScore: 0.3,
  //   refineSteps: 10
  // });
  // var segmentation = await model.estimatePersonSegmentation(frame,16,0.5);
  return segmentation;
};

const maskFrame = async (personSegment) => {
  const coloredPartImage = await bodyPix.toMask(personSegment);
  return coloredPartImage;
};

const drawMask = async(coloredPartImage, opacity, maskBlueAmount, flipHorizontal) => {
    bodyPix.drawMask(canvas_bp, sourceCanvas, coloredPartImage, opacity, maskBlueAmount, flipHorizontal);
    // canvas_bp_ctx.drawImage(video,0,0,canvas_bp.width, canvas_bp.height);
    console.log("masking completed");
};

function updateFeed(personSegment, frame) {
  const coloredPartImage = maskFrame(personSegment);
  const opacity = 0.7;
  const flipHorizontal = false;
  const maskBlurAmount = 0;
  drawMask(coloredPartImage,opacity, flipHorizontal, maskBlurAmount);
}

// main


//starts webcam stream
if (navigator.mediaDevices.getUserMedia) {
  const user_params = {
    video: true,
  };

  navigator.mediaDevices
    .getUserMedia(user_params)
    .then(function (stream) {
      video.srcObject = stream;
      video.addEventListener("loaddeddata", filterInterval());
    })
    .catch(function (problem) {
      console.log("An Error Occurred");
    });
}

//sourceCanvas contains the original webcam data
var sourceCanvas = document.createElement("canvas");
var sourceCanvas_ctx = sourceCanvas.getContext("2d");

// Remember considering time taken for model to load

 