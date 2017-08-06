let log = console.log.bind(console);

function imageFromPath(path) {
    let image = new Image();
    image.src = path;
    return image;
}

let Paddle = (function() {
    function paddle(imagePath) {
        this.image = imageFromPath(imagePath);
        this.x = 100;
        this.y = 560;
        this.speed = 4;
        this.w = 256;
        this.h = 16;
    }
    paddle.prototype.setImage = function(image) {
        this.image = image;
    };
    paddle.prototype.moveLeft = function() {
        this.x -= this.speed;
    }
    paddle.prototype.moveRight = function() {
        this.x += this.speed;
    }

    return paddle;
})();

let Ball = (function() {
    function ball(imagePath) {
        this.image = imageFromPath(imagePath);
        this.x = 0;
        this.y = 0;
        this.speedX = 4;
        this.speedY = -4;
        this.w = 16;
        this.h = 16;
        this.fired = false;
    }
    ball.prototype.setImage = function(image) {
        this.image = image;
    };
    ball.prototype.fire = function() {
        this.fired = true;
    }
    ball.prototype.move = function() {
        if(!this.fired) return;

        let rightBorder = this.x + this.w;
        let bottomBorder = this.y + this.h;
        if(this.x < 0.1 || rightBorder > 959.9) {
            this.speedX = -this.speedX;
        }
        if(this.y < 0.1 || bottomBorder > 639.9) {
            this.speedY = -this.speedY;
        }
        this.x += this.speedX;
        this.y += this.speedY;
    }

    return ball;
})();

let Arkanoid = (function () {
    function arkanoid(canvasID) {
        let that = this;
        this.canvas = document.getElementById(canvasID);
        this.context = this.canvas.getContext('2d');

        this.keydowns = [];
        this.actions = [];
        

        window.addEventListener('keydown', function(event) {
            that.keydowns[event.key] = true;
        });

        window.addEventListener('keyup', function(event) {
            that.keydowns[event.key] = false;
        });
        
        setInterval(function() {
            let keys = Object.keys(that.actions);
            for(let i = 0; i < keys.length; i++) {
                let key = keys[i];
                if(that.keydowns[key]) {
                    //调用与被按下按键注册绑定的函数
                    that.actions[key]();
                }
            }
            that.update();
            that.clearScreen();
            that.draw();
        }, 1000/120);
    }

    arkanoid.prototype.registerAction = function(key, callback) {
        this.actions[key] = callback;
    };

    arkanoid.prototype.update = function() {
    };

    arkanoid.prototype.drawImage = function(imageObj) {
        this.context.drawImage(imageObj.image, imageObj.x, imageObj.y, imageObj.w, imageObj.h);
    };
    arkanoid.prototype.clearScreen = function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    arkanoid.prototype.draw = function() {
       this.drawImage(paddle);
    };
    return arkanoid;
})();



function main() {
    let paddle = new Paddle('images/paddle.png');
    let ball = new Ball('images/ball.png');
    let game = new Arkanoid('idCanvas');
    
    game.context.drawImage(paddle.image, paddle.x, paddle.y, paddle.w, paddle.h);

    game.update = function() {
        ball.move();
    };
    game.draw = function() {
        game.drawImage(paddle);
        game.drawImage(ball)
    };

    ball.fire = function() {
        ball.fired = true;
        ball.x = paddle.x + paddle.w / 2 - ball.w;
        ball.y = paddle.y - ball.h / 2;
    }

    game.registerAction('ArrowLeft', function() {
        paddle.moveLeft();
    });
    game.registerAction('ArrowRight', function() {
        paddle.moveRight();
    });
    game.registerAction('ArrowUp', function() {
        ball.fire();
    });


    

    

}

main();