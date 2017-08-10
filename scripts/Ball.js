let Ball = (function() {
    function ball() {
        PhysicsEntity.call(this);

        this.w = 32;
        this.h = 32;
        this.x = 960;
        this.y = 960;
        this.vx = 2;
        this.vy = -2;
        this.fired = false;

        this.updateBounds();
    } 
    inheritPrototype(ball, PhysicsEntity);

    ball.prototype.images = (function() {
    return imageFromPath('images/ball.png');
    }());

    ball.prototype.fire = function() {
        this.fired = true;
    }
    ball.prototype.move = function() {
        if(!this.fired) return;
        //log(this.speedX, this.speedY);
        this.x += this.speedX;
        this.y += this.speedY;
        //this.speedY += 0.02;

        let rightBorder = this.x + this.w;
        let bottomBorder = this.y + this.h;
        if(this.x < 0) {
            this.x = 0;
            this.speedX = -this.speedX;
        }
        if(rightBorder > 960) {
            this.x = 960 - this.w;
            this.speedX = -this.speedX;
        }
        if(this.y < 0) {
            this.y = 0;
            this.speedY = -this.speedY;
        }
        if(bottomBorder > 640) {
            this.y = 640 - this.h;
            this.speedY = 0;
            this.speedX = 0.05;
            this.fired = false;
        }
    }
    return ball;
})();