//最低速度
const STICKY_THRESHOLD = 0.0004;
//引力
const GRAVITY_Y =  0.99;
const GRAVITY_X =  0;
//常量，标记物体是否受引力影响
const KINEMATIC = 'kinematic'; //不受
const DYNAMIC   = 'dynamic';

//矩形 物理实体
let PhysicsEntity = (function() {
    function physicsEntity() {
        this.width = 0;
        this.height = 0;
        this.halfWidth = this.width * 0.5;
        this.halfHeight = this.height * 0.5;

        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy =  0;
        //加速度
        this.ax = 0;
        this.ay = 0;

        //弹力
        this.restitution = 1;
        this.physicsType = KINEMATIC;
    }
    physicsEntity.prototype.updateBounds = function() {
        this.halfWidth = this.width * 0.5;
        this.halfHeight = this.height * 0.5;
    };
    //返回矩形中点所在的x轴坐标
    physicsEntity.prototype.getMidX = function() {
        return this.halfWidth + this.x;
    };
    //返回矩形中点所在的y轴坐标
    physicsEntity.prototype.getMidY = function() {
        return this.halfHeight + this.y;
    };
    //获取矩形边界的坐标
    physicsEntity.prototype.getTop = function() {
        return this.y;
    };
    physicsEntity.prototype.getLeft = function() {
        return this.x;
    };
    physicsEntity.prototype.getRight = function() {
        return this.x + this.width;
    };
    physicsEntity.prototype.getBottom = function() {
        return this.y + this.height;
    };

    return physicsEntity;
})();

//碰撞检测和处理
let CollisionDetector = (function() {
    function cd() { }

    cd.prototype.collideRect = function(collider, collidee) {
        var l1 = collider.getLeft();
        var t1 = collider.getTop();
        var r1 = collider.getRight();
        var b1 = collider.getBottom();

        var l2 = collidee.getLeft();
        var t2 = collidee.getTop();
        var r2 = collidee.getRight();
        var b2 = collidee.getBottom();

        //判断俩个矩形的四条边是否超过彼此对边的坐标
        //例如 矩形1 的底边坐标 小于 矩形2 的上边，那么这两个矩形肯定没重合
        //其余判断同理
        if(b1 < t2 || t1 > b2 || r1 < l2 || l1 > r2) {
            return false;
        }
        //上面的判断不符合 俩个矩形就发生了碰撞
        return true;
    };

    cd.prototype.resolveElastic = function(moving, entity) {
        let pMidX = moving.getMidX();
        let pMidY = moving.getMidY();
        let aMidX = entity.getMidX();
        let aMidY = entity.getMidY();
        //获取 碰撞物 与 被撞物 之间重合的量
        let dx = (aMidX - pMidX) / entity.halfWidth;
        let dy = (aMidY - pMidY) / entity.halfHeight;

        let absDX = Math.abs(dx);
        let absDY = Math.abs(dy);

        //当重叠量相减小于0.1时，那么两个对象的两个角发生了碰撞
        if(Math.abs(absDX - absDY) < 0.03) {
            //从x轴靠近
            if(dx < 0) {
                moving.x = entity.getRight();
            } else {
                moving.x = entity.getLeft() - moving.width;
            }
            //从y轴靠近
            if(dy < 0) {
                moving.y = entity.getBottom();
            } else {
                moving.y = entity.getTop() - moving.height;
            }
            //随机朝一个方向进行反转
            if(Math.random() < 0.5) {
                moving.vx = -moving.vx * entity.restitution;
                //如果速度低于阀值，直接设置为0
                if(Math.abs(moving.vx) < STICKY_THRESHOLD) {
                    moving.vx = 0;
                }
            } else {
                 moving.vy = -moving.vy * entity.restitution;
                //如果速度低于阀值，直接设置为0
                if(Math.abs(moving.vy) < STICKY_THRESHOLD) {
                    moving.vy = 0;
                }
            }
        //碰撞物 从侧面接近 被撞物
        } else if(absDX > absDY) {
            if(dx < 0) {
                moving.x = entity.getRight();
            } else {
                moving.x = entity.getLeft() - moving.width;
            }
            moving.vx = -moving.vx * entity.restitution;
            if(Math.abs(moving.vx) < STICKY_THRESHOLD) {
                moving.vx = 0;
            }
        } else {
            if(dy < 0) {
                moving.y = entity.getBottom();
            } else {
                moving.y = entity.getTop() - moving.height;
            }
            moving.vy = -moving.vy * entity.restitution;
            if(Math.abs(moving.vy) < STICKY_THRESHOLD) {
                moving.vy = 0;
            }
        }
    };

    return cd;
})();
let lastTime = 0;
let Engine = (function() {
    function engine(entities) {
        this.collision = new CollisionDetector();
        this.entities = entities;
    }

    engine.prototype.step = function(time) {
        if(lastTime == undefined) {
            lastTime = (+new Date());
        }
        let elapsed = time - lastTime;
        elapsed = elapsed / 1000;
        //log(elapsed);
        let gx = GRAVITY_X * elapsed;
        let gy = GRAVITY_Y * elapsed;
        //let entity;

        this.entities.forEach(function(val, key) {
            //log(key, val);
            entity = val;
            //log(entity);
            switch (val.physicsType) {
                case DYNAMIC:
                   
                    entity.x  += entity.vx * elapsed;
                    entity.y  += entity.vy * elapsed;
                    entity.vx += entity.ax * elapsed;
                    entity.vy += entity.ay * elapsed;
                    entity.vy *= .99;
                    //log(entity.x, entity.y);
                    break;
                case KINEMATIC:
                    //log(entity);
                    //entity.vx += entity.ax * elapsed;
                    //entity.vy += entity.ay * elapsed;
                    entity.x  += entity.vx * elapsed;
                    entity.y  += entity.vy * elapsed;
                    break;
            }

        });
        lastTime = time;
    }

    return engine;
})();