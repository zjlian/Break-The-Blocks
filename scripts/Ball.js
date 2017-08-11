let Ball = (function() {
    function ball() {
        PhysicsEntity.call(this);

        this.width = 16;
        this.height = 16;
        this.x = 960;
        this.y = 960;
        this.vx = 4;
        this.vy = -16;
        this.fired = false;

        this.restitution = 1;        

        this.updateBounds();
    } 
    inheritPrototype(ball, PhysicsEntity);

    ball.prototype.images = (function() {
    return imageFromPath('images/ball.png');
    }());

    ball.prototype.fire = function() {
        if(this.fired) return;
        this.fired = true;
        this.x = paddle.getLeft() + paddle.halfWidth - this.halfWidth;
        this.y = paddle.getTop() - this.height;
        this.vx = (Math.abs(this.vx) < 16 ? this.vx : 8) * (Math.random() < 0.5 ? 1 : -1);
        this.vy = -18;
    }

    ball.prototype.move = function() {
        if(!this.fired) return;
        //log(this.speedX, this.speedY);
        this.x += this.vx;
        this.y += this.vy
        this.vy *= .99;
        this.vy += this.restitution * 0.1;

        let rightBorder = this.x + this.width;
        let bottomBorder = this.y + this.height;
        if(this.x < 0) {
            this.x = 0;
            this.vx = -this.vx;
        }
        if(rightBorder > 960) {
            this.x = 960 - this.width;
            this.vx = -this.vx;
        }
        if(this.y < 0) {
            this.y = 0;
            this.vy = -this.vy;
        }
        if(bottomBorder > 640) {
            this.y = 640 - this.height;
            this.vy = 0;
            this.vy = 0.05;
            this.fired = false;
        }   
    }
    return ball;
})();