function Orbiter (initPos, initVel, radius) {

    this.active = true;

    this.mass = radius*2;

    this.initPos = p5.Vector.mult(initPos, 1);
    this.initVel = p5.Vector.mult(initVel, 1);

    this.pos = p5.Vector.mult(initPos, 1);
    this.vel = p5.Vector.mult(initVel, 1);
    this.acc = createVector(0, 0);
    this.rad = radius*1;


    //orbiters.push(this);

    this.Update = function (deltaTime) {

        if(this.active || true) {
            if (deltaTime == null) {
                deltaTime = fixedDeltaTime*1;
            }

            var earthDist = p5.Vector.dist(this.pos, earthPos)
            var accMag = ((G*earthMass) / (earthDist*earthDist)) * deltaTime;

            this.vel.add(p5.Vector.sub(earthPos, this.pos).normalize().mult(accMag));

            this.pos.add(p5.Vector.mult(this.vel, deltaTime));

        }
        //print("updated");
    }

    this.EarthCollisionCheck = function() {



        let dist = p5.Vector.dist(this.pos, earthPos);
        let radii = this.rad + earthRadius;
        //let earthRad = earthMass/8;
        if (Math.abs(dist) < radii) {
            this.delete = true;

            //print("collision");

            //let dir = p5.Vector.sub(earthPos, this.pos).normalize();
            //this.pos = p5.Vector.mult(earthPos, 1);
            //this.pos.sub(p5.Vector.mult(dir, radii));

            //let colPoint = p5.Vector.mult(dir, this.rad).add(this.pos);

            //let VelX1 = (this.vel.x * (this.mass - earthMass)) / (this.mass + earthMass);
            //let VelY1 = (this.vel.y * (this.mass - earthMass)) / (this.mass + earthMass);
            //this.vel = createVector(VelX1, VelY1);
            //this.pos.add(p5.Vector.mult(this.vel, 1).normalize());
        }

    }

    this.CheckCollisions = function() {

        if(this.active) {
            this.EarthCollisionCheck();

            for (var i = 0; i < orbiters.length; i++) {
                if (orbiters[i] != this) {
                    if ((this.pos.x + this.rad + orbiters[i].rad > orbiters[i].pos.x && this.pos.x < orbiters[i].pos.x + this.rad + orbiters[i].rad && this.pos.y + this.rad + orbiters[i].rad > orbiters[i].pos.y && this.pos.y < orbiters[i].pos.y + this.rad + orbiters[i].rad)) {
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

                            if(this.rad >= 2 && Math.round(random(Math.round((this.rad - orbiters[i].rad) / this.rad))) == 0) {

                                this.Fragment();

                            }
                        }
                    }
                }
            }
        }
    }

    this.Draw = function () {
        push();
        if(this.delete) {
            fill(255, 195, 195, 31);
            this.rad = this.rad * 3;
            ellipse(this.pos.x, this.pos.y, this.rad*4);
            fill(255, 195, 195, 255);
        } else {
            fill(215);
        }

        ellipse(this.pos.x, this.pos.y, this.rad);
        pop();
        //print(this.radius);
    }

    this.Fragment = function () {

        nextOrbiters.push(new Orbiter(p5.Vector.add(this.pos, createVector(-this.rad/2-1, -this.rad/2-1)), p5.Vector.mult(this.vel, 1), this.rad/2));
        nextOrbiters.push(new Orbiter(p5.Vector.add(this.pos, createVector(this.rad/2+1, this.rad/2+1)), p5.Vector.mult(this.vel, 1), this.rad/2));

        for( var i = 0; i < orbiters.length; i++){
            if ( orbiters[i] == this) {
                orbiters[i].delete = true;
                orbiters[i].active = false;
            }
        }

    }

    this.Clone = function () {

        return new Orbiter(this.initPos, this.initVel, this.rad);

    }

}
