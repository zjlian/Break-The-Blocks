let game = new GameFrame('idCanvas');

let paddle = {};
let ball = {};

let mainScenes = new Scenes(game, function(game) {
    game.addModule('paddle', new Paddle());
    game.addModule('ball', new Ball(game.getModule('paddle')));
    paddle = game.getModule('paddle');
    ball = game.getModule('ball');
    
    game.registerAction('ArrowLeft', function() {
        paddle.moveLeft();
    });
    game.registerAction('ArrowRight', function() {
        paddle.moveRight();
    });
    game.registerAction('ArrowUp', function() {
        ball.fire();
    });
});

mainScenes.update = function() {
    let game = mainScenes.frame;
    let collision = game.collision;

    if(collision.collideRect(ball, paddle)) {
        collision.resolveElastic(ball, paddle);
        ball.ay = (Math.random() < 0.5 ? -Math.random() : Math.random()) * 4;
    }
    if(collision.collideRect(ball, game.barriers[2])) {
        ball.vy = 0;
        ball.vx = 0;
        ball.fired = false;
    }
};

window.addEventListener('keyup', function(event) {
    if(event.key === 'p') {
        game.togglePaused();
    }
});

mainScenes.apply();
