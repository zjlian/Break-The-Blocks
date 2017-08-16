let log = console.log.bind(console);

function imageFromPath(path) {
    let image = new Image();
    image.src = path;
    return image;
}

function objectClone(o) {
    function F(){}
    F.prototype = o;
    return new F();
}
function inheritPrototype(subType, superType) {
    let prototype = objectClone(superType.prototype);
    prototype.constructor = subType;
    subType.prototype = prototype;
}

function getTimeNow() {
    return +new Date();
}

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

//GameFrame 编辑模式函数用
function drawGrid(ct) {
    for(let i = 0; i < 16; i++) {
        ct.strokeStyle = '#333'
        ct.beginPath();
        ct.moveTo(0, 32 * i);
        ct.lineTo(960, 32 * i);
        ct.stroke();

        ct.beginPath();
        ct.moveTo(64 * i, 0);
        ct.lineTo(64 * i, 32*15);
        ct.stroke();
    }
}
function hasBlock(blocks, x, y) {
    for(let i = 0; i < blocks.length; i++) {
        if(blocks[i].x === x * 64 && blocks[i].y === y * 32) {
            return i;
        }
    }
    return -1;
}
function addBlock(event, blocks, ct) {
    let e = event;
    let curX = Math.floor(e.offsetX / 64),
        curY = Math.floor(e.offsetY / 32);

    let status = hasBlock(blocks, curX, curY);
    if(status !== -1) {
        let tmpBlock = blocks[status];
        tmpBlock.levelUp();

        ct.fillStyle = '#eacd76';
        ct.fillRect(tmpBlock.x, tmpBlock.y, 64, 32);
    } else {
        let tmpBlock = new Block();
        tmpBlock.x = curX * 64;
        tmpBlock.y = curY * 32;
        blocks.push(tmpBlock);

        ct.fillStyle = '#4b5cc4';
        ct.fillRect(tmpBlock.x, tmpBlock.y, 64, 32);
    }
}
