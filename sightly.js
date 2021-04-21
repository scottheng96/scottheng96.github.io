/* 
Object Removal Filter Javascript Code
Filter process:
- code processes video stream frame by frame
- processes the frame with the given model and returns the frame (with objects filtered)
- reconstructs the stream (with delay)
*/

const video = document.getElementById('webcam');
const video_bp = document.getElementById('webcam-bp');

/*
BODYPIX MODEL
*/

// An object to configure parameters to set for the bodypix model.
// See github docs for explanations.
const bodyPixProperties = {
    architecture: 'MobileNetV1',
    outputStride: 16,
    multiplier: 0.75,
    quantBytes: 4
  };

// An object to configure parameters for detection. I have raised
// the segmentation threshold to 90% confidence to reduce the
// number of false positives.
const segmentationProperties = {
    flipHorizontal: false,
    internalResolution: 'high',
    segmentationThreshold: 0.9,
    scoreThreshold: 0.2
  };


/*
MODEL IMPLEMENTATION
*/

function processFrame(canvas, segmentation) {
    var context = canvas.getContext('2d');

    var image_data = context.getImageData(0,0,canvas.height,canvas.width);
    var i_data = image_data.data;

    var reg_data = TempCanvas.getImageData(0,0,canvas.height,canvas.width);
    var r_data = reg_data.data;

    i_data = r_data;

    context.putImageData(i_data,0,0);
};

var ready = true;
var model_loaded = false;

var model = bodyPix.load(bodyPixProperties).then(function (loadedModel) {
    model = loadedModel;
    model_loaded = true;
    // Show demo section now model is ready to use.
    demosSection.classList.remove('invisible');
  });

function filter() {
    if (ready) {

    TempCanvas_context.drawImage(video,0,0);
    ready = false;

    model.segmentPerson(TempCanvas, segmentationProperties).then(function(segmentation) {
        processFrame(webcamCanvas, segmentation);
    });
    ready = true;
    }
    
    window.requestAnimationFrame(filter);
}


// main

//starts all webcam streams
if (navigator.mediaDevices.getUserMedia) {

    const user_params = {
        video: true,
        video_bp: true
    };

    navigator.mediaDevices.getUserMedia(user_params).then(function(stream) {
        video.srcObject = stream;
        video_bp.srcObject = stream;

        video_bp.addEventListener('loadeddata',filter);
    })
    .catch(function (problem) {
        console.log("An Error Occurred")
    });
}

//Temp Canvas to store frames from webcam stream 
var TempCanvas = document.createElement('canvas');
var TempCanvas_context = TempCanvas.getContext('2d');

//Canvas to render results to the DOM
var webcamCanvas = document.createElement('canvas');
webcamCanvas.setAttribute('class', 'overlay');
video_bp.appendChild(webcamCanvas);


// Remember considering time taken for model to load
