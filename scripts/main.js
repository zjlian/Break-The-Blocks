
function loadLevel(o) {
    let blocks = [];
    let count = o.length * o[0].length;
    //for(let i = 0; i < )
}


let paddle = new Paddle();
let ball = new Ball();
let blocks = [];
let game = new Arkanoid('idCanvas');

function main() {

    //log(LZString.compress(JSON.stringify(blocks)));
    //log(JSON.stringify(blocks))
    //console.dir(JSON.stringify(blocks));

    game.drawModule(paddle);

    game.update = function() {
        ball.move();
        // if(paddle.hitBox(ball)) {
        //     ball.y = paddle.y - ball.h;
        //     ball.speedY = -ball.speedY;
        //     //log('重叠');
        // }

        blocks.map((b) => {
            if(b.hitBox(ball)) {
                ball.y = b.y + b.h + ball.h;
                ball.speedY = -ball.speedY;
                b.damage(); 
            }
        });
    };
    game.draw = function() {
        game.context.fillStyle = '#F0FFF0';
        game.context.fillRect(0, 0, 960, 960);
        game.drawModule(paddle);
        game.drawModule(ball);
        //game.drawModule(block)
        // for(let i = 0; i < blocks.length; i++)  {
        //     for(let j = 0; j < blocks[i].length; j++) {
        //         game.drawModule(blocks[i][j]);
        //     }
        // }
        blocks.map((b) => {
            //log(b);
            game.drawModule(b);
        });
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