let levelCode = '';
function loadLevel(levelCode) {
    game.barriers.splice(4, game.barriers.length -  4);
    let blocks = [];
    let jsonStr = LZString.decompress(levelCode);
    let arr = JSON.parse(jsonStr);

    arr.map(function(b) {
        let block = new Block();
        block.width = b.width;
        block.height = b.height;
        block.halfWidth = b.halfWidth;
        block.halfHeight = b.halfHeight;
        block.x = b.x;
        block.y = b.y;
        block.type = b.type;
        block.l = b.l;
        block.restitution = b.restitution;

        game.barriers.push(block);
    });
}



let game = new GameFrame('idCanvas');

function main() {

    game.addModule('paddle', new Paddle());
    game.addModule('ball', new Ball(game.getModule('paddle')));
    let blocks = [];
    let paddle = game.getModule('paddle');
    let ball = game.getModule('ball');

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
