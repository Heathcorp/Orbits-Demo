//TODO:
//Collisions, labels

//github test

var fixedDeltaTime = 0, tempDeltaTime = 0;
var frameTime = 0;

var timeScale = 6;

var G = 32;

var earthPos = null;
var earthMass = 512;
var orbiters = [];

var GSlider, massSlider, timeSlider;

var mousePressedPos = null, mouseReleasedPos = null, mousePos = null;

function reset() {

    orbiters = [];

    GSlider.value(32);
    massSlider.value(512);
    timeSlider.value(6);
    G = GSlider.value();
    earthMass = massSlider.value();
    timeScale = timeSlider.value();

}

function setup() {

    print("setup function called");
    //frameRate(30);

    createCanvas(window.innerWidth, window.innerHeight);
    fill(215);
    strokeJoin(ROUND);
	rectMode(RADIUS);
	ellipseMode(RADIUS);
    noStroke();

    GSlider = createSlider(0.1, 100, 32);
    GSlider.position(24, 24);
    massSlider = createSlider(0.1, 4096, 512);
    massSlider.position(24, 44);
    timeSlider = createSlider(-40, 32, 6);
    timeSlider.position(24, 64);
    G = GSlider.value();
    earthMass = massSlider.value();
    timeScale = timeSlider.value();

    orbiters = [];
    earthPos = createVector(width/2, height/2);

    orbiters.push(new Orbiter (createVector (earthPos.x, earthPos.y - 128), createVector (95, 0), 8));

    background (47);

    frameTime = Date.now()/1000;
}

function draw() {

    mousePos = createVector(mouseX*1, mouseY*1);

    G = GSlider.value();
    earthMass = massSlider.value();
    timeScale = timeSlider.value();

    fixedDeltaTime = ((Date.now()/1000 - frameTime) * timeScale);
    //print(fixedDeltaTime);
    frameTime = Date.now()/1000;

    //background (47);
    if (mouseIsPressed && mouseButton === RIGHT) {
        background(47);

        predictOrbit(new Orbiter(p5.Vector.mult(mousePressedPos, 1), p5.Vector.sub(mousePos, mousePressedPos), 8));
    } else {
        push();
        fill(47, 127);
        rect(earthPos.x, earthPos.y, width/2, height/2);
        pop();
        for (var i = 0; i < orbiters.length; i++) {
            orbiters[i].Update();
        }

        mousePressedPos = null;
        mouseReleasedPos = null;
    }

    push();
    ellipse(earthPos.x, earthPos.y, earthMass/8);
    pop();

    for (var i = 0; i < orbiters.length; i++) {
        orbiters[i].Draw();
    }
}

function predictOrbit(obj) {
    print("tracing orbit");

    push();
    noFill();
    strokeWeight(2);
    stroke(215, 143, 143);

    //print(mousePressedPos);
    //print(mousePos);

    line(mousePressedPos.x, mousePressedPos.y, mousePos.x, mousePos.y);
    let iters = Math.round((p5.Vector.dist(mousePressedPos, earthPos) * obj.initVel.mag()) / 16);

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
    //return false;
}

function mouseReleased() {
    print("mouse released");
    mouseReleasedPos = createVector(mouseX*1, mouseY*1);
    if(mouseButton === RIGHT) {
        orbiters.push(new Orbiter(p5.Vector.mult(mousePressedPos, 1), p5.Vector.sub(mousePos, mousePressedPos), 8));
    }
    //return false;
}

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
    earthPos = createVector(width/2, height/2);
}
