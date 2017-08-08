
let Arkanoid = (function () {
    function arkanoid(canvasID) {
        let that = this;
        this.canvas = document.getElementById(canvasID);
        this.context = this.canvas.getContext('2d');

        this.keydowns = [];
        this.actions = [];

        //status
        this.paused = false;
        
        window.addEventListener('keydown', function(event) {
            that.keydowns[event.key] = true;
        });

        window.addEventListener('keyup', function(event) {
            that.keydowns[event.key] = false;
        });
        
        this.timers = setInterval(function() {
            if(that.paused) return;
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
        }, 1000/this.FPS);
    }
    arkanoid.prototype.FPS = 30;
    //按下时按键行为注册
    arkanoid.prototype.registerAction = function(key, callback) {
        this.actions[key] = callback;
    };

    //update()和draw()需要自己覆盖定义逻辑
    arkanoid.prototype.update = function() {
    };
    arkanoid.prototype.draw = function() {
       this.drawImage(paddle);
    };

    arkanoid.prototype.run = function() {}

    arkanoid.prototype.drawImage = function(imageObj) {
        //log(imageObj.image);
        this.context.drawImage(imageObj.image, imageObj.x, imageObj.y, imageObj.w, imageObj.h);
    };
    arkanoid.prototype.clearScreen = function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    

    arkanoid.prototype.editMode = function() {
        let that = this;
        this.paused = true;
        this.clearScreen();
        drawGrid(this.context);
        let tmpBlocks = [];

        function addBlock(e) {
            let curX = Math.floor(e.offsetX / 64),
                curY = Math.floor(e.offsetY / 32);
            log('x:' + curX + ' y:' +curY);

            let status = hasBlock(tmpBlocks, curX, curY);
            if(status !== -1) {
                let tmpBlock = tmpBlocks[status];
                tmpBlock.levelUp();

                that.context.fillStyle = '#eacd76';
                that.context.fillRect(tmpBlock.x, tmpBlock.y, 64, 32);
            } else {
                let tmpBlock = new Block();
                tmpBlock.x = curX * 64;
                tmpBlock.y = curY * 32;
                tmpBlocks.push(tmpBlock);

                that.context.fillStyle = '#4b5cc4';
                that.context.fillRect(tmpBlock.x, tmpBlock.y, 64, 32);
            }

        }
        this.canvas.addEventListener('mousedown', addBlock);

        window.addEventListener('keyup', (event) => {
            if(event.key === 'q') {
                that.canvas.removeEventListener('mousedown',addBlock);
                blocks = tmpBlocks;
                log(tmpBlocks);
                that.exitEditMode();
            }
        });
    };
    
    arkanoid.prototype.exitEditMode = function() {
        let that = this;
        this.clearScreen();

        this.paused = false;

        // this.timers = setInterval(function() {
        //     let keys = Object.keys(that.actions);
        //     for(let i = 0; i < keys.length; i++) {
        //         let key = keys[i];
        //         if(that.keydowns[key]) {
        //             //调用与被按下按键注册绑定的函数
        //             that.actions[key]();
        //         }
        //     }
        //     that.update();
        //     that.clearScreen();
        //     that.draw();
        // }, 1000/this.FPS);

        main();
    };

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