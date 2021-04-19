const video = document.getElementById('webcam');

if (navigator.mediaDevices.getUserMedia) {

    const user_params = {
        video: true
    };

    navigator.mediaDevices.getUserMedia(user_params).then(function(stream) {
        video.srcObject = stream;
    })
    .catch(function (problem) {
        console.log("An Error Occurred")
    });
}


// Remember considering time taken for model to loadshoyu
