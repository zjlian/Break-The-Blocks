// let Paddle = (function() {
//     function paddle(imagePath) {
//         this.image = imagePath;
//         this.w = 256;
//         this.h = 8;
//         this.halfWidth = this.width * 0.5;
//         this.halfHeight = this.height * 0.5;

//         this.x = 0;
//         this.y = 640- this.h;
//         this.vx = 32;
//         this.vy =  0;

//         this.restitution = 1;
//     }
//     paddle.prototype.images = (function() {
//         return imageFromPath('images/paddle.png');
//     }());
//     paddle.prototype.setImage = function(imagePath) {
//         this.image = imagePath;
//     };
//     paddle.prototype.moveLeft = function() {
//         if(this.x <= 0) return;
//         this.x -= this.speed;
//     };
//     paddle.prototype.moveRight = function() {
//         if(this.x + this.w >= 960) return;
//         this.x += this.speed;
//     };
//     paddle.prototype.hitBox = function(target) {
//         let CD = new CollisionDetector();
//         if(CD.collideRect(target, this)) {
//             CD.resolveElastic(target, this);
//         }
//     };
//     paddle.prototype.widen = function() {
//         this.w += 16;
//     }

//     return paddle;
// })();
let Paddle = (function() {
    function paddle() {
        PhysicsEntity.call(this);

        this.width = 256;
        this.height = 16;

        this.x = 0;
        this.y = 640 - this.height * 2;
        this.vx = 16;

        this.restitution = 2;
        this.updateBounds();
    }
    inheritPrototype(paddle, PhysicsEntity);
    
    paddle.prototype.images = (function() {
        return imageFromPath('images/paddle.png');
    }());

    paddle.prototype.moveLeft = function() {
        if(this.x <= 0) return;
        this.x -= this.vx;
    };
    paddle.prototype.moveRight = function() {
        if(this.x + this.width >= 960) return;
        this.x += this.vx;
    };

    return paddle;
})();
