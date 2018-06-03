function Pet(name) {
    this.name = name;
    this.face = {
        scale : 1,
        pan : "center",
        tilt : "center",
        angle : 0,
        height : 80,
        width : 50,
        center : {
            x: 0, 
            y:0
        }
    }
    this.body = {
        pan:"center",
        tilt:"center",
        scale : 1,
    }

    this.parts = {
        "leftEye": {
            "x" : 0, "y": 0
        },
        "rightEye": {
            "x" : 0, "y": 0
        },
        "nose": {
            "x" : 0, "y": 0
        },
        "leftEar": {
            "x" : 0, "y": 0
        },
        "rightEar": {
            "x" : 0, "y": 0
        },
        "leftShoulder": {
            "x" : 0, "y": 0
        },
        "rightShoulder": {
            "x" : 0, "y": 0
        },
        "leftElbow": {
            "x" : 0, "y": 0
        },
        "rightElbow": {
            "x" : 0, "y": 0
        },
        "leftWrist": {
            "x" : 0, "y": 0
        },
        "rightWrist": {
            "x" : 0, "y": 0
        },
        "leftHip": {
            "x" : 0, "y": 0
        },
        "rightHip": {
            "x" : 0, "y": 0
        },
        "leftKnee": {
            "x" : 0, "y": 0
        },
        "rightKnee": {
            "x" : 0, "y": 0
        },
        "rightAnkle": {
            "x" : 0, "y": 0
        },
        "leftAnkle": {
            "x" : 0, "y": 0
        }
    }

    this.load = function(stripes_path) {

    }

    this.update = function(pose, smooth=true) {
       
       if (pose.score >= 0.1) {
            pose.keypoints.forEach(keypoint => {    
                if (keypoint.score >= 0.1) {
                    if (smooth) {
                        var diff = dist(keypoint.position.x, keypoint.position.y,this.parts[keypoint.part].x, this.parts[keypoint.part].y);
                        this.parts[keypoint.part] = diff < 1 ? this.parts[keypoint.part] : { x:keypoint.position.x, y:keypoint.position.y};
                    }
                }
                //else dont update
            });
        } else {
            
            //deafult position
        }

    
        // Update face data
        this.face.center = {
            x:(this.parts.leftEar.x + this.parts.rightEar.x)/2, 
            y:(this.parts.leftEar.y + this.parts.rightEar.y)/2
        } 
        this.face.angle = atan((this.parts.leftEar.y-this.parts.rightEar.y)/(this.parts.leftEar.x-this.parts.rightEar.x));
        this.face.scale = dist(this.parts.leftEar.x, this.parts.leftEar.y, this.parts.rightEar.x, this.parts.rightEar.y);
        
        // Update pan
        var diff_x = (this.face.center.x - this.parts.nose.x)/(this.face.center.x - this.parts.rightEar.x);
        if (diff_x > 0.3) {
            this.face.pan = "left";            
        } else if (diff_x < -0.3) {
            this.face.pan = "right";
        } else {
            this.face.pan = "center";
        }

        switch (this.face.pan) {
            case "left":
                this.face.width = 1*this.face.scale*0.7;                    
                break;
            case "right":
                this.face.width = 1*this.face.scale*0.7;                
                break;
            case "center":
            default:
                this.face.width = 1*this.face.scale;        
            break;
        }

        // Update tilt
        var diff_y = (this.face.center.y - this.parts.nose.y)/this.face.scale;
        if (diff_y > 0.20) {
            this.face.tilt = "up";            
        } else if (diff_y < -0.20) {
            this.face.tilt = "down";
        } else {
            this.face.tilt = "center";
        }

        switch (this.face.tilt) {
            case "up":
            this.face.height = 1.618*this.face.scale*0.6;                 
                break;
            case "down":
                this.face.height = 1.618*this.face.scale*0.6;            
                break;
            case "center":
            default:
                this.face.height = 1.618*this.face.scale;
                break;
        }
        // body data
        this.body.scale = dist(this.parts.leftShoulder.x, this.parts.leftShoulder.y,this.parts.rightShoulder.x, this.parts.rightShoulder.y );
    
       console.log(this.face);
       console.log(this.body);
       console.log(this.parts);
    }

    this.draw = function() {

    }

    this.draw_dots = function() {
        background(230);

        var center_head = {
            x:(this.parts.leftEar.x + this.parts.rightEar.x)/2, 
            y:(this.parts.leftEar.y + this.parts.rightEar.y)/2
        };
        
        var center_eyes = {
            x:(this.parts.leftEye.x + this.parts.rightEye.x)/2, 
            y:(this.parts.leftEye.y + this.parts.rightEye.y)/2
        };
        // HEAR
        ellipse(this.parts.leftEar.x, this.parts.leftEar.y, 5,10); 
        ellipse(this.parts.rightEar.x, this.parts.rightEar.y, 5, 10);    
        line(this.parts.leftEar.x, this.parts.leftEar.y,this.parts.rightEar.x, this.parts.rightEar.y);
        
        // HEAD
        translate(center_eyes.x, this.parts.nose.y);
        rotate(this.face.angle);
        ellipse(0,0, this.face.width, this.face.height);
        line(-this.face.width/2, 0, this.face.width/2, 0);
        line(0, -this.face.height/2, 0, this.face.height/2);
        rotate(0);
        translate(-center_eyes.x, -this.parts.nose.y);        

        // RATIOS
        line(this.parts.leftEye.x, this.parts.leftEye.y,this.parts.rightEye.x, this.parts.rightEye.y);
        line(center_eyes.x, center_eyes.y, this.parts.nose.x,this.parts.nose.y);
        
        // EYES
        ellipse(this.parts.leftEye.x, this.parts.leftEye.y, this.face.scale * (1/5)); 
        ellipse(this.parts.leftEye.x, this.parts.leftEye.y, this.face.scale * (1/5) * (1/3)); 

        ellipse(this.parts.rightEye.x, this.parts.rightEye.y, this.face.scale * (1/5));    
        ellipse(this.parts.rightEye.x, this.parts.rightEye.y, this.face.scale * (1/5)* (1/3));    
        

        // NOSE
        ellipse(this.parts.nose.x, this.parts.nose.y, this.face.scale * (1/5) * (1/3));

        // BODY
        //ellipse(this.parts.leftAnkle.x, this.parts.leftAnkle.y, this.body.scale * (1/10));
        // ellipse(this.parts.rightAnkle.x, this.parts.rightAnkle.y, this.body.scale * (1/10));
        // ellipse(this.parts.leftElbow.x, this.parts.leftElbow.y, this.body.scale * (1/10));
        // ellipse(this.parts.rightElbow.x, this.parts.rightElbow.y, this.body.scale * (1/10));
        // ellipse(this.parts.leftHip.x, this.parts.leftHip.y, this.body.scale * (1/10));
        // ellipse(this.parts.rightHip.x, this.parts.rightHip.y, this.body.scale * (1/10));
        // ellipse(this.parts.leftKnee.x, this.parts.leftKnee.y, this.body.scale * (1/10));
        // ellipse(this.parts.rightKnee.x, this.parts.rightKnee.y, this.body.scale * (1/10));
        ellipse(this.parts.leftShoulder.x, this.parts.leftShoulder.y, this.body.scale * (1/10));
        ellipse(this.parts.rightShoulder.x, this.parts.rightShoulder.y, this.body.scale * (1/10));
        // ellipse(this.parts.leftWrist.x, this.parts.leftWrist.y, this.body.scale * (1/10));
        // ellipse(this.parts.rightWrist.x, this.parts.rightWrist.y, this.body.scale * (1/10));
    }
        
}