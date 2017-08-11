
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
        //game.context.fillStyle = '#F0FFF0';
        //game.context.fillRect(0, 0, game.canvas.width, game.canvas.height);
        game.drawModule(paddle);
        game.drawModule(ball);

        blocks.map((b) => {
            game.drawModule(b);
        });
    };


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
