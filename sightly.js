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
    //can also be ResNet archtecture
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

function processFrame(canvas, mask_imagedata) {

    var context = canvas.getContext('2d');

    var image_data = context.getImageData(0,0,canvas.height,canvas.width);
    var i_data = image_data.data;

    var reg_data = TempCanvas.getImageData(0,0,canvas.height,canvas.width);
    var r_data = reg_data.data;

    i_data = mask_imagedata.data;

    context.putImageData(i_data,0,0);
};

var ready = true;

var model = await bodyPix.load(bodyPixProperties);

function filter() {
    if (ready) {

    TempCanvas_context.drawImage(video,0,0);
    ready = false;

    var segmentation = await model.segmentPerson(TempCanvas,segmentationProperties);

    //copy-pasted 
    const coloredPartImage = bodyPix.toMask(segmentation);
    const opacity = 0.7;
    const flipHorizontal = false;
    const maskBlurAmount = 0;
    const canvas = document.getElementById('canvas');
    // Draw the mask image on top of the original image onto a canvas.
    // The colored part image will be drawn semi-transparent, with an opacity of
    // 0.7, allowing for the original image to be visible under.
    var mask_imagedata = bodyPix.drawMask(
        canvas, img, coloredPartImage, opacity, maskBlurAmount,
        flipHorizontal);

    processFrame(webcamCanvas, mask_imagedata);
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
