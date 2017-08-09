
function loadLevel(o) {
    let blocks = [];
    let count = o.length * o[0].length;
    //for(let i = 0; i < )
}


let paddle = new Paddle('images/paddle.png');
let ball = new Ball('images/ball.png');
let blocks = [];
let game = new Arkanoid('idCanvas');

function main() {
    /*
    for(let i = 0; i < 8; i++) {
        blocks[i] = [];
        for(let j = 0; j < 14; j++) {
            blocks[i][j] = new Block();
            blocks[i][j].x = j * blocks[i][j].w + 32;
            blocks[i][j].y = i * blocks[i][j].h;
        }
    }*/
    //let block = new Block('images/block.png');
    
    //log(LZString.compress(JSON.stringify(blocks)));
    //log(JSON.stringify(blocks))
    //console.dir(JSON.stringify(blocks));

    game.drawModule(paddle);

    game.update = function() {
        ball.move();
        if(paddle.hitBox(ball)) {
            ball.y = paddle.y - ball.h;
            ball.speedY = -ball.speedY;
            //log('重叠');
        }
        // for(let i = 0; i < blocks.length; i++)  {
        //     for(let j = 0; j < blocks[i].length; j++) {
        //         let block = blocks[i][j];
        //         if(block.hitBox(ball)) {
        //             ball.y = block.y + block.h + ball.h;
        //             ball.speedY = -ball.speedY;
        //             //log('重叠');
        //             block.damage();
        //         }
        //     }
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