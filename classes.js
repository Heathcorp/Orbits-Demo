function Orbiter (initPos, initVel, radius) {

    this.initPos = initPos;
    this.initVel = initVel;

    this.pos = initPos;
    this.vel = initVel;
    this.acc = createVector(0, 0);
    this.rad = radius;


    //orbiters.push(this);

    this.Update = function (deltaTime) {

        if (deltaTime == null) {
            deltaTime = fixedDeltaTime*1;
        }

        var earthDist = p5.Vector.dist(this.pos, earthPos)
        var accMag = ((G*earthMass) / (earthDist*earthDist)) * timeScale;

        this.vel.add(p5.Vector.sub(earthPos, this.pos).normalize().mult(accMag));

        this.pos.add(p5.Vector.mult(this.vel, deltaTime));

        //print("updated");
    }

    this.Draw = function () {
        push();
        fill(215);

        ellipse(this.pos.x, this.pos.y, this.rad);
        pop();
        //print(this.radius);
    }

}
