
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
        //log(game.collision.collideRect(ball, paddle));
        if(game.collision.collideRect(ball, paddle)) {
            game.collision.resolveElastic(ball, paddle);
        }

        blocks.map((b) => {
            if(game.collision.collideRect(ball, b)) {
                game.collision.resolveElastic(ball, b);
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
            game.drawModule(b);
        });
    };

    ball.fire = function() {
        if(ball.fired) return;
        ball.fired = true;
        ball.x = paddle.x + paddle.width / 2 - ball.width;
        ball.y = paddle.y - ball.height;
        ball.vx = 2;
        ball.vy = -8;
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
