
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
        
        this.run = setInterval(function() {
            let keys = Object.keys(that.actions);
            for(let i = 0; i < keys.length; i++) {
                let key = keys[i];
                if(that.keydowns[key]) {
                    //调用与被按下按键注册绑定的函数
                    that.actions[key]();
                }
            }
            that.update();
            that.clearScreen();
            that.draw();
        }, 1000/60);
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

    arkanoid.prototype.editMode = function() {
        let that = this;
        clearInterval(this.run);
        this.clearScreen();
        drawGrid(this.context);
        let blocks = [];

        function addBlock(e) {
            let curX = Math.floor(e.offsetX / 64),
                curY = Math.floor(e.offsetY / 32);
            log('x:' + curX + ' y:' +curY);

            let status = hasBlock(blocks, curX, curY);
            if(status !== -1) {
                let tmpBlock = blocks[status];
                if(tmpBlock.l === 2) return;
                tmpBlock.l = 2;
                tmpBlock.typr = 1;

                that.context.fillStyle = '#eacd76';
                that.context.fillRect(tmpBlock.x, tmpBlock.y, 64, 32);
            } else {
                let tmpBlock = new Block();
                tmpBlock.x = curX * 64;
                tmpBlock.y = curY * 32;
                blocks.push(tmpBlock);

                that.context.fillStyle = '#4b5cc4';
                that.context.fillRect(tmpBlock.x, tmpBlock.y, 64, 32);
            }

        }
        this.canvas.addEventListener('mousedown', addBlock);


    };
    /*
    arkanoid.prototype.exitEditMode = function() {
        this.clearScreen();

        this.run = setInterval(function() {
            let keys = Object.keys(that.actions);
            for(let i = 0; i < keys.length; i++) {
                let key = keys[i];
                if(that.keydowns[key]) {
                    //调用与被按下按键注册绑定的函数
                    that.actions[key]();
                }
            }
            that.update();
            that.clearScreen();
            that.draw();
        }, 1000/60);
    };*/

    //helper function
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
    return arkanoid;
})();