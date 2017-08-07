let Paddle = (function() {
    function paddle(imagePath) {
        this.image = imageFromPath(imagePath);
        this.w = 256;
        this.h = 8;
        this.x = 0;
        this.y = 640- this.h;
        this.speed = 32;   
    }
    paddle.prototype.setImage = function(image) {
        this.image = image;
    };
    paddle.prototype.moveLeft = function() {
        if(this.x <= 0) return;
        this.x -= this.speed;
    };
    paddle.prototype.moveRight = function() {
        if(this.x + this.w >= 960) return;
        this.x += this.speed;
    };
    paddle.prototype.hitBox = function(target) {
        if(target.x && target.y && target.w && target.h) {
            return !(
                ((this.y + this.h) < target.y)   ||
                (this.y > (target.y + target.h)) ||
                ((this.x + this.w) < target.x )  ||
                (this.x > (target.x + target.w))
            );
        }
    };
    paddle.prototype.widen = function() {
        this.w += 16;
    }

    return paddle;
})();