class Gojo extends Player {
    constructor({playerNumber, position, velocity, color='white', offset, stats={}, framesMax=1, scale=1, animations={}},spriteSize=false,animationScales) {
        super({playerNumber, position, velocity, color, offset, stats, imageSrc: animations.left.idle[0], framesMax, scale});
        this.height = stats.height || 180;
        this.color = stats.color || 'white';
        this.health = stats.health || 100;
        this.cursedEnergy = stats.cursedEnergy || 1000;
        this.strength = stats.strength || 50;
        this.speed = stats.speed || 20;
        this.endurance = stats.endurance || 50;
        this.techniqueMastery = stats.techniqueMastery || 10;
        this.cursedObjects = stats.cursedObjects || ['Ryomen Sukuna’s Finger'];
        this.direction = 'right'; // default direction
        this.spriteSize=spriteSize;
        this.framesMax = framesMax;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 30;
        this.loopAnimation = false;
        this.animationScales=animationScales
        this.currentAnimation=[]

        // this.images = imageSrcs.map(src => {
        //     const img = new Image();
        //     img.src = src;
        //     return img;
        // });
        this.animations = {};
        for (const direction in animations) {
            this.animations[direction] = {};
            for (const anim in animations[direction]) {
                this.animations[direction][anim] = animations[direction][anim].map(src => {
                    const img = new Image();
                    img.src = src;
                    return img;
                });
            }
        }
        // for (const anim in animations) {
        //     this.animations[anim] = animations[anim].map(src => {
        //         const img = new Image();
        //         img.src = src;
        //         return img;
        //     });
        // }
        this.currentAnimation = 'idle';
        this.framesMax = framesMax[this.currentAnimation];
    }

    // Gojo's special attack: Infinite Void
    infiniteVoidAttack() {
        if (this.cursedEnergy > 200) {
            this.isAttacking = true;
            this.cursedEnergy -= 200;

            // Logic for the Infinite Void attack

            setTimeout(() => {
                this.isAttacking = false;
            }, 500); // Longer attack duration for this special move
        }
    }

    passiveHealing() {
        this.healingInterval = setInterval(() => {
            if (this.health < 100) {
                this.health += 1; // Heal by 1 unit. Adjust as needed.
                player_health.style.width = this.health + '%'; // Update the health bar
            }
        }, 1000); // Heal every second. Adjust the interval as needed.
    }
    attack() {
        if (this.cursedEnergy > 20) { 
            this.isAttacking = true;
            this.cursedEnergy -= 20; 

            // Logic for a stronger attack

            setTimeout(() => {
                this.isAttacking = false;
            }, 150); // Slightly longer attack duration
        }
    }

    // Overriding the moving attack for Gojo's speed
    movingAttack() {
        if (this.cursedEnergy > 10) { 
            let projectileDirection = (this.lastKey === 'd' || this.lastKey === 'ArrowRight') ? 'right' : 'left';
            let startX = (projectileDirection === 'right') ? this.position.x + this.width : this.position.x;
            projectiles.push(new Projectile(startX, this.position.y + (this.height / 2), projectileDirection, 15)); // Faster projectile
            this.cursedEnergy -= 10; 
        }
    }
    pullOpponent(opponent) {
        if (!(this instanceof Gojo)) return;

        let pullSpeed = 3;
        const acceleration = 0.1;
        const pullDuration = 500;
        const pullDirection = (this.position.x < opponent.position.x) ? 1 : -1;

        opponent.position.y -= 10; // Lift the opponent off the ground

        const pullInterval = setInterval(() => {
            opponent.position.x -= pullSpeed * pullDirection;
            pullSpeed += acceleration;
        }, 1000/60);

        setTimeout(() => {
            clearInterval(pullInterval);
            opponent.position.y += 10; // Reset the opponent to the ground
        }, pullDuration);
    }
    pushOpponent(opponent) {
        if (!(this instanceof Gojo)) return;
    
        let pushSpeed = 5;  // Initial push speed
        const pushAcceleration = 0.2;  // Acceleration to increase push speed
        const pushDuration = 500;  // Duration of the push in milliseconds
        const pushVertical = 5;  // Vertical lift during the push
    
        // Determine the direction of the push based on the player's position relative to the opponent
        const pushDirection = (this.position.x < opponent.position.x) ? 1 : -1;
    
        opponent.isBeingPushed = true;  // Set the flag to prevent opponent from moving towards the player
    
        const pushInterval = setInterval(() => {
            opponent.position.x += pushSpeed * pushDirection;  // Push the opponent horizontally
            opponent.position.y -= pushVertical;  // Lift the opponent vertically
            pushSpeed += pushAcceleration;  // Increase the push speed
        }, 1000/60);
    
        setTimeout(() => {
            clearInterval(pushInterval);  // Stop the push after the specified duration
            opponent.isBeingPushed = false;  // Reset the flag
        }, pushDuration);
    }

    animateFrames() {
        this.framesElapsed++;
        if (this.framesElapsed > this.framesHold) {
            this.framesCurrent++;
            this.framesElapsed = 0;
        }
        if (this.framesCurrent >= this.framesMax[this.currentAnimation]) {
            if (this.loopAnimation) {
                this.framesCurrent = 0; // If looping is allowed, reset to the first frame
            } else {
                this.framesCurrent = this.framesMax[this.currentAnimation] - 1; // Otherwise, stay on the last frame
            }
        }
    }
    

    // switchAnimation(animation) {
    //     if (this.currentAnimation !== animation) {
    //         this.currentAnimation = animation;
    //         this.image = this.animations[animation][0];
    //         this.framesMax = this.animations[animation].length;
    //         this.framesCurrent = 0;
    //     }
    // }
    switchAnimation(animation, direction) {
        // this.currentAnimation=[animation,direction]
            // this.scale=this.animationScales[animation]
        
        // console.log(this.animations[direction]['run'])
        // console.log(this.animationScales)
        // if(animation=='run'){
        //     console.log('hello')
        //     this.scale=4.5
        // }
       
        if (this.currentAnimation !== animation || this.direction !== direction) {
            this.currentAnimation = animation;
            this.direction = direction;
            // console.log(this.animations[this.direction][animation][0])
            this.image = this.animations[direction][animation][0];
            this.framesMax = this.animations[direction][animation].length;
            this.framesCurrent = 0;
        }
    }
    
//     draw() {
//     if (this.animations[this.currentAnimation][this.framesCurrent]) {
//         // const img = this.animations[this.currentAnimation][this.framesCurrent];
//         const img = this.animations[this.direction][this.currentAnimation][this.framesCurrent];
//         const aspectRatio = img.width / img.height;
//         const newHeight = this.width / aspectRatio;
        
//         c.drawImage(
//             img,
//             this.position.x,
//             this.position.y - this.offset.y,
//             this.width * this.scale,
//             newHeight * this.scale
//         );
//     } else {
//         console.error('Image not found:', this.framesCurrent);
//     }
// }
    draw() {
        if (this.animations[this.direction][this.currentAnimation][this.framesCurrent]) {
            const img = this.animations[this.direction][this.currentAnimation][this.framesCurrent];
            const aspectRatio = img.width / img.height;
            const newHeight = this.width / aspectRatio;
            if(this.spriteSize!=false){
                newHeight = this.spriteSize
            }
          
            
            c.drawImage(
                img,
                this.position.x,
                this.position.y - this.offset.y,
                this.width * this.scale,
                newHeight * this.scale
            );
        } else {
            console.error('Image not found:', this.framesCurrent);
        }
    }

    update() {
        super.update();
        // this.framesCurrent = (this.framesCurrent + 1) % this.framesMax;

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    
        if (this.position.y + this.height >= canvas.height) {
            this.position.y = canvas.height - this.height; // Align Gojo with the ground
            this.velocity.y = 0;
            this.levitating = false; // Reset levitating state when player touches the ground
        } else {
            if (this.levitating) {
                this.velocity.y = -0.2; // Reduce the effect of gravity when levitating
            } else {
                this.velocity.y += this.gravity;
            }
        }
    
        if (this.position.x < 0) this.position.x = 0;
        if (this.position.x + this.width > canvas.width) this.position.x = canvas.width - this.width;
        if (this.position.y < 0) this.position.y = 0;
    }
    
    static fromObject(obj) {
        const gojo = Object.create(Gojo.prototype);
        return Object.assign(gojo, obj);
    }
    
}




