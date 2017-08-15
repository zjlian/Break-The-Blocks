
function loadLevel(o) {
    let blocks = [];
    let count = o.length * o[0].length;
    //for(let i = 0; i < )
}



let game = new Arkanoid('idCanvas');

function main() {

    game.addModule('paddle', new Paddle());
    game.addModule('ball', new Ball(game.getModule('paddle')));
    let blocks = [];
    let paddle = game.getModule('paddle');
    let ball = game.getModule('ball');

    //log(LZString.compress(JSON.stringify(blocks)));
    //log(JSON.stringify(blocks))
    //console.dir(JSON.stringify(blocks));


    game.drawModule(paddle);

    game.update = function() {
        if(game.collision.collideRect(ball, paddle)) {
            game.collision.resolveElastic(ball, paddle);
            //ball.ax = (Math.random() < 0.5 ? -Math.random() : Math.random()) * 2;
            ball.ay = (Math.random() < 0.5 ? -Math.random() : Math.random()) * 4;
        }
        if(game.collision.collideRect(ball, game.barriers[2])) {
            ball.vy = 0;
            ball.vx = 0;
            ball.fired = false;
        }
        
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

    window.addEventListener('keyup', function(event) {
        if(event.key === 'p') {
            game.togglePaused();
        }
    })

}

main();
