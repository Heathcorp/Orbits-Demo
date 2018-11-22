//TODO:
//adding velocity mid-flight if that makes sense

var fixedDeltaTime = 0, tempDeltaTime = 0;
var frameTime = 0;

var timeScale = 8;

var G = 32;

var trail = 0;

var earthPos = null;
var earthMass = 2048;
var earthRadius = 64;
var orbiters = [], nextOrbiters = [];

var collisionDrag = 1;
var collisions = true;

var GSlider, massSlider, timeSlider, trailSlider;

var mousePressedPos = null, mouseReleasedPos = null, mousePos = null;

var lastOrbit;

var isOverDiv = false, divs = [];

function reset() {

    orbiters = [];
    nextOrbiters = [];

    GSlider.value = 32;
    massSlider.value = 2048;
    timeSlider.value = 16;
    trailSlider.value = 127;

    trail = trailSlider.value;
    G = GSlider.value;
    earthMass = massSlider.value;
    timeScale = timeSlider.value;

}

function closeInfo() {
    divs[1].parentNode.removeChild(divs[1]);
    //quick and dirty delete
    divs.pop();
}

function setup() {

    print("setup function called");
    //frameRate(30);

    createCanvas(window.innerWidth, window.innerHeight).elt.style.zIndex="-5";
    fill(215);
    strokeJoin(ROUND);
	rectMode(RADIUS);
	ellipseMode(RADIUS);
    noStroke();

    divs = [document.getElementById("Parameters"), document.getElementById("Info")];

    GSlider = document.getElementById("G");
    massSlider = document.getElementById("Mass");
    timeSlider = document.getElementById("Time");
    trailSlider = document.getElementById("Trail");

    reset();

    orbiters = [];
    earthPos = createVector(width/2, height/2);

    //orbiters.push(new Orbiter (createVector (earthPos.x, earthPos.y - 128), createVector (95, 0), 8));

    background (47);

    frameTime = Date.now()/1000;
}

function draw() {

    orbiters = nextOrbiters.slice(0);

    mousePos = createVector(mouseX*1, mouseY*1);

    G = GSlider.value;
    earthMass = massSlider.value;
    timeScale = timeSlider.value;
    trail = trailSlider.value;



    fixedDeltaTime = ((Date.now()/1000 - frameTime) * timeScale);
    //print(fixedDeltaTime);
    frameTime = Date.now()/1000;

    //background (47);
    push();
    fill(47, trail*1);
    rect(earthPos.x, earthPos.y, width/2, height/2);
    pop();

    if (collisions) {
        for (var i = 0; i < orbiters.length; i++) {
            orbiters[i].CheckCollisions();
        }
    }
    for (var i = 0; i < orbiters.length; i++) {
        if(orbiters[i].delete == true) {
            nextOrbiters.splice(nextOrbiters.indexOf(orbiters[i]), 1);
        }
        orbiters[i].Update();
    }



    push();
    fill(63);
    ellipse(earthPos.x, earthPos.y, earthRadius*8/6);
    fill(215);
    ellipse(earthPos.x, earthPos.y, earthRadius);
    pop();



    for (var i = 0; i < orbiters.length; i++) {
        orbiters[i].Draw();
    }

    if (mouseIsPressed && isOverDiv == false) {
        //background(47);

        predictOrbit();
    }

    if (Date.now()/1000 - frameTime >= 3) {
        noLoop();
    }
}

function predictOrbit() {
    let obj = new Orbiter(p5.Vector.mult(mousePressedPos, 1), p5.Vector.sub(mousePos, mousePressedPos).mult(tempDeltaTime), 8);

    print("tracing orbit");

    push();
    noFill();
    stroke(215, 143, 143, 255);
    strokeWeight(4);
    line(mousePressedPos.x, mousePressedPos.y, mousePos.x, mousePos.y);
    ellipse(mousePos.x, mousePos.y, 8, 8);

    let iters = Math.round((100000/tempDeltaTime) * (obj.initVel.magSq()/(G*earthMass)));

    print(iters);

    for (i = 0; i < iters; i++) {
        let pos = p5.Vector.mult(obj.pos, 1);
        obj.Update(tempDeltaTime);
        line(pos.x, pos.y, obj.pos.x, obj.pos.y);
    }
    pop();
}

function mousePressed() {
    print("mouse pressed");

    mousePressedPos = createVector(mouseX*1, mouseY*1);
    tempDeltaTime = fixedDeltaTime*1;

    for(let i = 0; i < divs.length; i++) {
        let divDim = [parseInt(divs[i].style.left,10), parseInt(divs[i].style.top,10), parseInt(divs[i].style.width,10), parseInt(divs[i].style.height,10)];

        if (mousePressedPos.x >= divDim[0] && mousePressedPos.x <= divDim[0] + divDim[2] && mousePressedPos.y >= divDim[1] && mousePressedPos.y <= divDim[1] + divDim[3]) {
            isOverDiv = true;
            break;
        }
    }
    //return false;
}

function mouseReleased() {
    print("mouse released");
    mouseReleasedPos = createVector(mouseX*1, mouseY*1);
    if(isOverDiv) {
        isOverDiv = false;
        return false;
    }
    lastOrbit = new Orbiter(mousePressedPos, p5.Vector.sub(mousePos, mousePressedPos).mult(tempDeltaTime), 8);
    nextOrbiters.push(lastOrbit.Clone());

    //return false;
}

function keyTyped() {
    if (key === 'r') {
        nextOrbiters.push(lastOrbit.Clone());
    }
}

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
    earthPos = createVector(width/2, height/2);
}
