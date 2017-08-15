
let GameFrame = (function () {
    let lestTime;
    function arkanoid(canvasID) {
        let that = this;
        this.canvas = document.getElementById(canvasID);
        this.context = this.canvas.getContext('2d');
        this.pixelsPerMeter = this.canvas.width / 10;
        
        this.keydowns = [];
        this.actions = [];

        //status
        this.FPS = 0;
        this.startTime=0;           //当前游戏开始的时间
        this.lastTime=0;            //上一次requestAnimationFrame()调用的时间
        this.gameTime=0;            //游戏经过的时间
        this.paused = false;
        this.startedPauseAt = 0;    //调用暂停时的时间
 
        this.modules = new Map();   //储存可动的对象
        this.barriers = [];         //储存不可动的障碍对象

        this.collision = new CollisionDetector();
        this.engine = new Engine(this);
        
        window.addEventListener('keydown', function(event) {
            that.keydowns[event.key] = true;
        });

        window.addEventListener('keyup', function(event) {
            that.keydowns[event.key] = false;
        });
        
        this.loop = function (time) {
            let that = this;
            if(that.paused) {
                setTimeout(()=>{
                    window.requestAnimationFrame(function(time) {
                        that.loop(time);
                        that.lastTime = time;
                    }) ; 
                },100);
            } else {
                let keys = Object.keys(that.actions);
                for(let i = 0; i < keys.length; i++) {
                    let key = keys[i];
                    if(that.keydowns[key]) {
                        //调用与被按下按键注册绑定的函数
                        that.actions[key]();
                    }
                }
                that.tick(time);
                that.engine.step(time);
                
                that.update();
                that.clearScreen();
                that.draw();
    
                that.updateFrameRate(time);
    
                that.lastTime = time;
                window.requestAnimationFrame(function(time) {
                    that.loop(time);
                });
            }
        }
        
        this.timers = window.requestAnimationFrame(function(time) {
            that.startTime = getTimeNow();
            that.loop(time);
        });
        this.createEdge();
    }
    
    arkanoid.prototype.tick = function(time) {
        this.updateFrameRate(time);
        this.gameTime = getTimeNow() - this.startTime;
    };
    arkanoid.prototype.updateFrameRate = function(time) {
        if(this.lastTime === 0) {
            this.FPS = 60;
        } else {
            this.FPS = 1000 / (time - this.lastTime);
        }

        this.context.fillStyle = '#222';
        this.context.fillText(this.FPS.toFixed() + ' FPS', 10, 20);
    };

    arkanoid.prototype.togglePaused = function() {
        let now = getTimeNow();
        this.paused = !this.paused;
        if(this.paused) {
            this.startedPauseAt = now;
        } else {
            this.startTime = this.startTime + now - this.startedPauseAt;
        }
    };

    //按下时按键行为注册
    arkanoid.prototype.registerAction = function(key, callback) {
        this.actions[key] = callback;
    };

    arkanoid.prototype.addModule = function(string, module) {
        this.modules.set(string, module);
    };
    arkanoid.prototype.getModule = function(string) {
        return this.modules.get(string);
    };

    //update()和draw()需要自己覆盖定义逻辑
    arkanoid.prototype.update = function() {};
    arkanoid.prototype.draw = function() {
        this.modules.forEach((val, key) => {
            this.drawModule(val);
        })
        this.barriers.map(b => {
            if(b.images !== undefined) {
                this.drawModule(b);
            }
        });
    };
    //arkanoid.prototype.run = function() {}

    arkanoid.prototype.drawModule = function(module) {
        let img;
        if(module.images.length) {
            img = module.images[module.type];
        } else {
            img = module.images;
        }
        this.context.drawImage(img, module.x, module.y, module.width, module.height);
    };
    arkanoid.prototype.clearScreen = function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    arkanoid.prototype.createEdge = function() {
        let topEdge = new PhysicsEntity();
        let rightEdge = new PhysicsEntity();
        let bottomEdge = new PhysicsEntity();
        let leftEdge = new PhysicsEntity();

        topEdge.width = this.canvas.width + 100;
        topEdge.height = 200;
        topEdge.x = -50;
        topEdge.y = -topEdge.height;

        rightEdge.width = 200;
        rightEdge.height = this.canvas.height + 100;
        rightEdge.x = this.canvas.width;
        rightEdge.y = -50;

        bottomEdge.width = this.canvas.width + 100;
        bottomEdge.height = 200;
        bottomEdge.x = -50;
        bottomEdge.y = this.canvas.height;

        leftEdge.width = 200;
        leftEdge.height = this.canvas.height + 100;
        leftEdge.x = -leftEdge.width;
        leftEdge.y = -50;

        topEdge.updateBounds();
        rightEdge.updateBounds();
        bottomEdge.updateBounds();
        leftEdge.updateBounds();
        
        this.barriers.push(topEdge, rightEdge, bottomEdge, leftEdge);
    };

    arkanoid.prototype.editMode = function() {
        if(this.paused) return;
        this.togglePaused();
        let that = this;

        this.clearScreen();
        drawGrid(this.context);
        let tmpBlocks = [];

        this.canvas.addEventListener('mousedown', function(e) {
            addBlock(e, tmpBlocks, that.context)
        });

        window.addEventListener('keyup', function(event) {
            if(event.key === 'q') {
                if(!that.paused) return;
                that.canvas.removeEventListener('mousedown',addBlock);
                levelCode =  LZString.compress(JSON.stringify(tmpBlocks));
                that.exitEditMode();
            }
        });
    };
    
    arkanoid.prototype.exitEditMode = function() {
        let that = this;
        this.clearScreen();
        this.togglePaused();
        
        loadLevel(levelCode);
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


    return arkanoid;
})();