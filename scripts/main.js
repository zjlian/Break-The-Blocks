let log = console.log.bind(console);

function imageFromPath(path) {
    let image = new Image();
    image.src = path;
    return image;
}

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

let Block = (function() {
    function block(imagePath) {
        this.image.src = imagePath;
        this.x = 200;
        this.y = 200;
        this.w = 64;
        this.h = 32;
        this.liveValue = 1;
    }
    block.prototype.image = new Image();

    block.prototype.setImage = function(image) {
        this.image = image;
    };
    block.prototype.hitBox = function(target) {
        if(target.x && target.y && target.w && target.h) {
            return !(
                ((this.y + this.h) < target.y)   ||
                (this.y > (target.y + target.h)) ||
                ((this.x + this.w) < target.x )  ||
                (this.x > (target.x + target.w))
            );
        }
    };
    block.prototype.damage = function() {
        --this.liveValue;
        if(this.liveValue <= 0) {
            this.x = this.y = this.w = this. h = 0;
        }
    };

    return block;
})();

let Ball = (function() {
    function ball(imagePath) {
        this.image = imageFromPath(imagePath);
        this.x = 0;
        this.y = 0;
        this.speedX = 2;
        this.speedY = -2;
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
        }, 1000/60);
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
    let blocks = [];
    for(let i = 0; i < 8; i++) {
        blocks[i] = [];
        for(let j = 0; j < 14; j++) {
            blocks[i][j] = new Block('images/block.png');
            blocks[i][j].x = j * blocks[i][j].w + 32;
            blocks[i][j].y = i * blocks[i][j].h;
        }
    }
    //let block = new Block('images/block.png');


    let game = new Arkanoid('idCanvas');
    
    game.context.drawImage(paddle.image, paddle.x, paddle.y, paddle.w, paddle.h);

    game.update = function() {
        ball.move();
        if(paddle.hitBox(ball)) {
            ball.y = paddle.y - ball.h;
            ball.speedY = -ball.speedY;
            //log('重叠');
        }
        for(let i = 0; i < blocks.length; i++)  {
            for(let j = 0; j < blocks[i].length; j++) {
                let block = blocks[i][j];
                if(block.hitBox(ball)) {
                    ball.y = block.y + block.h + ball.h;
                    ball.speedY = -ball.speedY;
                    //log('重叠');
                    block.damage();
                }
            }
        }
    };
    game.draw = function() {
        game.drawImage(paddle);
        game.drawImage(ball);
        //game.drawImage(block)
        for(let i = 0; i < blocks.length; i++)  {
            for(let j = 0; j < blocks[i].length; j++) {
                game.drawImage(blocks[i][j]);
            }
        }
    };

    ball.fire = function() {
        if(ball.fired) return;
        ball.fired = true;
        ball.x = paddle.x + paddle.w / 2 - ball.w;
        ball.y = paddle.y - ball.h;
        ball.speedX = 2;
        ball.speedY = -8;
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