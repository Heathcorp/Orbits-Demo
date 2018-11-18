function Orbiter (initPos, initVel, radius) {

    this.mass = radius*2;

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

        if (Math.abs(dist) < radii) {
            print("collision");

            let dir = p5.Vector.sub(earthPos, this.pos).normalize();
            this.pos = p5.Vector.mult(earthPos, 1);
            this.pos.sub(p5.Vector.mult(dir, radii));

            let colPoint = p5.Vector.mult(dir, this.rad).add(this.pos);

            let VelX1 = (this.vel.x * (this.mass - earthMass)) / (this.mass + earthMass);
            let VelY1 = (this.vel.y * (this.mass - earthMass)) / (this.mass + earthMass);

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
                if (Math.abs(dist) < radii) {
                    print("collision");

                    let dir = p5.Vector.sub(orbiters[i].pos, this.pos).normalize();
                    this.pos = p5.Vector.mult(orbiters[i].pos, 1);
                    this.pos.sub(p5.Vector.mult(dir, radii));

                    let colPoint = p5.Vector.mult(dir, this.rad).add(this.pos);

                    let VelX1 = (this.vel.x * (this.mass - orbiters[i].mass) + (2 * orbiters[i].mass * orbiters[i].vel.x)) / (this.mass + orbiters[i].mass);
                    let VelY1 = (this.vel.y * (this.mass - orbiters[i].mass) + (2 * orbiters[i].mass * orbiters[i].vel.y)) / (this.mass + orbiters[i].mass);
                    let VelX2 = (orbiters[i].vel.x * (orbiters[i].mass - this.mass) + (2 * this.mass * this.vel.x)) / (orbiters[i].mass + this.mass);
                    let VelY2 = (orbiters[i].vel.y * (orbiters[i].mass - this.mass) + (2 * this.mass * this.vel.y)) / (orbiters[i].mass + this.mass);

                    this.vel = createVector(VelX1, VelY1).mult(collisionDrag);
                    orbiters[i].vel = createVector(VelX2, VelY2).mult(collisionDrag);

                    this.pos.add(p5.Vector.mult(this.vel, 1).normalize());
                    orbiters[i].pos.add(p5.Vector.mult(orbiters[i].vel, 1).normalize());

                    //this.Update();
                    //orbiters[i].Update();

                    //this.Fragment();
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

    this.Fragment = function () {

        orbiters.push(new Orbiter(p5.Vector.add(this.pos, createVector(-this.rad/2, -this.rad/2)), p5.Vector.mult(this.vel, 1), this.rad/2));
        orbiters.push(new Orbiter(p5.Vector.add(this.pos, createVector(this.rad/2, this.rad/2)), p5.Vector.mult(this.vel, 1), this.rad/2));

        for( var i = 0; i < orbiters.length; i++){
            if ( orbiters[i] == this) {
                orbiters.splice(i, 1);
            }
        }

    }

}
