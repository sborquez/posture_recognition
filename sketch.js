var capture;
var imageScaleFactor = 0.5;
var outpuStride = 16;
var flipHorizontal = false;
const net = posenet.load(); 
const pet = new Pet("test");
var img;
//var img = loadImage('assets/laDefense.jpg');

function setup() {
    Webcam.set({
        width: 320,
        height: 240,
        image_format: 'jpeg',
        jpeg_quality: 70,
        flip_horiz: true
    });
    Webcam.attach( '#Camera' );
    var canvas = createCanvas(320, 240);
    canvas.parent("Canvas");
    background(51);    
    frameRate(15);
}

function draw() {
    while (frameCount < 100) {
        return;
    }
    try {

        //Update posture from webcam
        Webcam.snap( function(data_uri) {
            document.getElementById('Image').innerHTML = '<img id=source src="'+data_uri+'"/>';
            img = document.getElementById('source');
            
            net.then(function(n) {
                return n.estimateSinglePose(img, imageScaleFactor, flipHorizontal, outpuStride);
            }).then(
                function (pose) {
                    pet.update(pose);
                }
            )
        } );

        //draw order
        pet.draw_dots();

    } catch (error) {
        console.log(error);
    }
    //img = loadImage();
    //image(img, 0, 0);
}