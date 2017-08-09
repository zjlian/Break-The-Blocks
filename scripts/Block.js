let Block = (function() {
    function block() {
        this.x = 0;
        this.y = 0;
        this.w = 64;
        this.h = 32;
        this.type = 0;
        this.l = 1; //方块生命值
    }
    block.prototype.levelLimit = 1;
    block.prototype.images = (function() {
        let imgs = [];
        let num = 2; 
        for(let i = 0; i < num; i++)
            imgs[i] = new Image();
        
        imgs[0].src = 'images/wood.png';
        imgs[1].src = 'images/stone.png';
        return imgs;
    }());

    // block.prototype.updateImage = function() {
    //     this.image = this.images[this.type];
    // };
    block.prototype.levelUp = function() {
        //log(this);
        if(this.l > this.levelLimit) return;
        ++this.l;
        ++this.type;
    }
    block.prototype.hitBox = function(target) {
        if(target.x && target.y && target.w && target.h) {
            return !(
                ((this.y + this.h) < target.y)   ||
                (this.y > (target.y + target.h)) ||
                ((this.x + this.w) < target.x )  ||
                (this.x > (target.x + target.w))
            );
        }
    };
    block.prototype.damage = function() {
        --this.l;
        //log('撞 ',this.l)
        if(this.l <= 0) {
            this.x = this.y = this.w = this. h = 0;
        }
    };

    return block;
})();

