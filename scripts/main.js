let log = console.log.bind(console);

function imageFromPath(path) {
    let image = new Image();
    image.src = path;
    return image;
}
function loadLevel(o) {
    let blocks = [];
    let count = o.length * o[0].length;
    //for(let i = 0; i < )
}

let game = new Arkanoid('idCanvas');
function main() {
    let paddle = new Paddle('images/paddle.png');
    let ball = new Ball('images/ball.png');
    let blocks = [];
    for(let i = 0; i < 8; i++) {
        blocks[i] = [];
        for(let j = 0; j < 14; j++) {
            blocks[i][j] = new Block();
            blocks[i][j].x = j * blocks[i][j].w + 32;
            blocks[i][j].y = i * blocks[i][j].h;
        }
    }
    //let block = new Block('images/block.png');
    
    //log(LZString.compress(JSON.stringify(blocks)));
    log(JSON.stringify(blocks))
    //console.dir(JSON.stringify(blocks));

    
    
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