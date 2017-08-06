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
        this.speed = 8;
        this.w = 128;
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
                    //调用被按下按键注册绑定的函数
                    that.actions[key]();
                }
            }
            that.update();
            that.clearScreen();
            that.draw();
        }, 1000/45);
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
    let game = new Arkanoid('idCanvas');
    
    game.context.drawImage(paddle.image, paddle.x, paddle.y, paddle.w, paddle.h);

    game.registerAction('ArrowLeft', function() {
        paddle.moveLeft();
    });
    game.registerAction('ArrowRight', function() {
        paddle.moveRight();
    });
    game.registerAction('a', function() {
        paddle.moveLeft();
    });
    game.registerAction('d', function() {
        paddle.moveRight();
    });

    game.draw = function() {
        game.drawImage(paddle);
    }

}

main();