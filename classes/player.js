class Player extends SpriteObject{
    constructor({playerNumber,position,velocity,color='red',offset,stats={}, imageSrc,framesMax=1,scale=1,sprites}){
        super({position,imageSrc,scale,framesMax})
        this.isBeingPushed = false;
        this.sprites=sprites
        for(const sprite in this.sprites){
            sprites[sprite].image=new Image()
            sprites[sprite].image.src=sprites[sprite].imageSrc
        }
        console.log(this.sprites)
        this.playerNumber = playerNumber;
        // this.position=position
        this.offset=offset
        this.velocity=velocity
        this.height=150
        this.isAttacking=false
        this.width=50
        this.gravity=0.7
        this.lastKey
        this.color=color
        this.attackBox={
            position:{
                x:this.position.x,
                y:this.position.y,     
            },
            offset,
            width:100,
            height:50,
        }
        this.attackBalls = [];  
        this.health = stats.health || 100;
        this.cursedEnergy = stats.cursedEnergy || 100;
        this.strength = stats.strength || 10;
        this.speed = stats.speed || 5;
        this.endurance = 100;
        this.techniqueMastery = stats.techniqueMastery || 1;
        this.cursedObjects = stats.cursedObjects || [];
        this.cursedWounds = stats.cursedWounds || false;
        this.levitating = false;
    }
   
    update(){
        this.draw()
        super.animateFrames()
        this.attackBox.position.x=this.position.x+this.attackBox.offset.x
        this.attackBox.position.y=this.position.y
        this.position.x+=this.velocity.x
        this.position.y+=this.velocity.y
        if(this.position.y + this.height + this.velocity.y>=canvas.height){
            this.velocity.y=0
        }else{
            this.velocity.y+=this.gravity
        }
        if (this.velocity.y < 0) {
            this.switchAnimation('jump');
        }
        
        if (this.position.x < 0) this.position.x = 0;
        if (this.position.x + this.width > canvas.width) this.position.x = canvas.width - this.width;
        if (this.position.y < 0) this.position.y = 0;
        if (this.position.y + this.height > canvas.height) this.position.y = canvas.height - this.height;
    }
    attack(opponent) {
        this.isAttacking = true;
        const damage = this.calculateDamage(5, opponent); // Pass opponent as an argument
        opponent.health -= damage;
        opponent_health.style.width = opponent.health + '%';
        setTimeout(() => {
            this.isAttacking = false;
        }, 100);
    }
    
    movingAttack(){
        let projectileDirection = (this.lastKey === 'd' || this.lastKey === 'ArrowRight') ? 'right' : 'left';
        let startX = (projectileDirection === 'right') ? this.position.x + this.width : this.position.x;
        projectiles.push(new Projectile(startX, this.position.y + (this.height / 2), projectileDirection, 7));
    }
 
    switchAnimation(animation){
        switch(animation){
            case 'idle':
                if (this.image !== this.sprites.idle.image) {
                  this.image = this.sprites.idle.image
                  this.framesMax = this.sprites.idle.framesMax
                  this.framesCurrent = 0
                }
                break
            case 'run':
            if (this.image !== this.sprites.run.image) {
                this.image = this.sprites.run.image
                this.framesMax = this.sprites.run.framesMax
                this.framesCurrent = 0
            }
            break
            case 'jump':
            if (this.image !== this.sprites.jump.image) {
                this.image = this.sprites.jump.image
                this.framesMax = this.sprites.jump.framesMax
                this.framesCurrent = 0
            }
            break
    
        }

    }
    resizeImage(newWidth, newHeight) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        for (const sprite in this.sprites) {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
            ctx.drawImage(this.sprites[sprite].image, 0, 0, newWidth, newHeight);
            
            // Create a new image from the resized canvas
            const resizedImage = new Image();
            resizedImage.src = canvas.toDataURL();
            
            // Update the sprite's image with the resized version
            this.sprites[sprite].image = resizedImage;
        }
    }

    handleCollisionWith(otherPlayer) {
        if (this.isCollidingWith(otherPlayer)) {
            const overlapX = (this.width + otherPlayer.width) / 2 - Math.abs(this.position.x - otherPlayer.position.x);
            const overlapY = (this.height + otherPlayer.height) / 2 - Math.abs(this.position.y - otherPlayer.position.y);
    
            if (overlapX < overlapY) {
                if (this.position.x < otherPlayer.position.x) {
                    this.position.x -= overlapX / 2;
                    otherPlayer.position.x += overlapX / 2;
                } else {
                    this.position.x += overlapX / 2;
                    otherPlayer.position.x -= overlapX / 2;
                }
            } else {
                if (this.position.y < otherPlayer.position.y) {
                    this.position.y -= overlapY / 2;
                    otherPlayer.position.y += overlapY / 2;
                } else {
                    this.position.y += overlapY / 2;
                    otherPlayer.position.y -= overlapY / 2;
                }
            }
        }
    }
    isCollidingWith(otherPlayer) {
    return (
        this.position.x < otherPlayer.position.x + otherPlayer.width &&
        this.position.x + this.width > otherPlayer.position.x &&
        this.position.y < otherPlayer.position.y + otherPlayer.height &&
        this.position.y + this.height > otherPlayer.position.y
    );
}

}