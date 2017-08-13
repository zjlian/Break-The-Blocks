let Ball = (function() {
    function ball(paddle) {
        PhysicsEntity.call(this);

        this.width = 16;
        this.height = 16;
        this.x = 960;
        this.y = 960;
        this.vx = 4;
        this.vy = -8;
        this.ax = 0;
        this.ay = 0;

        this.fired = false;
        this.paddle = paddle;

        this.restitution = 1;
        this.physicsType = DYNAMIC;

        this.updateBounds();
    } 
    inheritPrototype(ball, PhysicsEntity);

    ball.prototype.images = (function() {
    return imageFromPath('images/ball.png');
    }());

    ball.prototype.fire = function() {
        if(this.fired) return;
        this.fired = true;
        this.x = this.paddle.getLeft() + this.paddle.halfWidth - this.halfWidth;
        this.y = this.paddle.getTop() - this.height;
        this.vx = 4;
        this.vx = (Math.abs(this.vx) < 16 ? this.vx : 8) * (Math.random() < 0.5 ? 1 : -1);
        this.vy = -8;
    }

    return ball;
})();