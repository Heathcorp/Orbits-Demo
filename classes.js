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

    this.EarthCollisionCheck = function() {
        let dist = p5.Vector.dist(this.pos, earthPos);
        let radii = this.rad + earthMass/8;
        let earthRad = earthMass/8;

        if (Math.abs(dist) <= radii) {
            print("collision");

            let dir = p5.Vector.sub(earthPos, this.pos).normalize();
            this.pos = p5.Vector.mult(earthPos, 1);
            this.pos.sub(p5.Vector.mult(dir, radii));

            let colPoint = p5.Vector.mult(dir, this.rad).add(this.pos);

            let VelX1 = (this.vel.x * (this.rad - earthRad)) / (radii);
            let VelY1 = (this.vel.y * (this.rad - earthRad)) / (radii);

            this.vel = createVector(VelX1, VelY1);
            this.pos.add(p5.Vector.mult(this.vel, 1).normalize());
        }
    }

    this.CheckCollisions = function() {

        this.EarthCollisionCheck();

        for (var i = 0; i < orbiters.length; i++) {
            if (orbiters[i] != this) {
                let dist = p5.Vector.dist(this.pos, orbiters[i].pos);
                let radii = this.rad + orbiters[i].rad;
                if (Math.abs(dist) <= radii) {
                    print("collision");

                    let dir = p5.Vector.sub(orbiters[i].pos, this.pos).normalize();
                    this.pos = p5.Vector.mult(orbiters[i].pos, 1);
                    this.pos.sub(p5.Vector.mult(dir, radii));

                    let colPoint = p5.Vector.mult(dir, this.rad).add(this.pos);

                    let VelX1 = (this.vel.x * (this.rad - orbiters[i].rad) + (2 * orbiters[i].rad * orbiters[i].vel.x)) / (this.rad + orbiters[i].rad);
                    let VelY1 = (this.vel.y * (this.rad - orbiters[i].rad) + (2 * orbiters[i].rad * orbiters[i].vel.y)) / (this.rad + orbiters[i].rad);
                    let VelX2 = (orbiters[i].vel.x * (orbiters[i].rad - this.rad) + (2 * this.rad * this.vel.x)) / (orbiters[i].rad + this.rad);
                    let VelY2 = (orbiters[i].vel.y * (orbiters[i].rad - this.rad) + (2 * this.rad * this.vel.y)) / (orbiters[i].rad + this.rad);

                    this.vel = createVector(VelX1, VelY1).mult(collisionDrag);
                    orbiters[i].vel = createVector(VelX2, VelY2).mult(collisionDrag);

                    this.pos.add(p5.Vector.mult(this.vel, 1).normalize());
                    orbiters[i].pos.add(p5.Vector.mult(orbiters[i].vel, 1).normalize());

                    //this.Update();
                    //orbiters[i].Update();
                }
            }
        }

    }

    this.Draw = function () {
        push();
        fill(215);

        ellipse(this.pos.x, this.pos.y, this.rad);
        pop();
        //print(this.radius);
    }

}
