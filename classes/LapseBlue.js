class BlueProjectile extends Projectile {
    constructor(x, y, direction, speed, target, playerHeight) {
        super(x, y, direction, speed);
        this.target = target;
        this.width = 50;  // Initial size
        this.height = 50;
        this.growthRate = 5;  // Growth rate
        this.magneticPullBaseStrength = 10;  // Base pull strength
        this.verticalLiftStrength = 15;  // Vertical lift strength
        this.growing = true;  // New property to determine if the projectile should grow
        this.maxHeight = 2 * playerHeight;  // Maximum growth height
        this.launched = false;  
    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2, false);
        c.fillStyle = 'blue';
        c.fill();
        c.closePath();

        // Spiral effect
        const spiralRadius = this.width / 2;
        for (let i = 0; i < 2 * Math.PI; i += 0.2) {
            const offsetX = spiralRadius * Math.cos(i);
            const offsetY = spiralRadius * Math.sin(i);
            c.beginPath();
            c.arc(this.x + offsetX, this.y + offsetY, 5, 0, Math.PI * 2, false);  // Adjust the "5" for the size of the spiral dots
            c.fillStyle = 'white';
            c.fill();
            c.closePath();
        }
    }
    update() {
        super.update();
    
        // Increase size over time only if it's growing and hasn't reached max height
        if (this.growing && this.height < this.maxHeight) {
            this.width += this.growthRate;
            this.height += this.growthRate;
        } else if (!this.growing && this.width > 50) {  // Dissipation logic
            this.width -= this.growthRate / 2;
            this.height -= this.growthRate / 2;
        }
    
        // Move the projectile based on its direction
        if (this.direction === 'd' || this.direction === 'ArrowRight') {
            this.x += this.speed;
            this.launched = true; 
        } else {
            this.x -= this.speed;
            this.launched = true; 
        }
        
        if (this.launched) {
            const dx = this.x - this.target.position.x;
            const dy = this.y - this.target.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const pullStrength = this.magneticPullBaseStrength * (this.height / this.maxHeight) / distance;
    
            this.target.velocity.x += dx * pullStrength;
            this.target.velocity.y += dy * pullStrength;
        }
        

        // Prevent projectile from going below the ground
        if (this.y + this.height / 2 > canvas.height) {
            this.y = canvas.height - this.height / 2;
        }

    

    }

    calculateDamage(baseDamage, opponent, player) {
        if (this.hasImpacted) {
            return 0; // If the projectile has already impacted, return 0 damage
        }
        // Size Modifier for BlueProjectile
        const sizeModifier = this.height / this.maxHeight;

        // Offensive Modifiers
        const strengthModifier = player.strength / 10;
        const techniqueMasteryModifier = player.techniqueMastery * 2;
        const cursedEnergyModifier = player.cursedEnergy * 0.01;

        // Defensive Modifiers
        const enduranceModifier = opponent.endurance / 10;
        const cursedWoundsPenalty = opponent.cursedWounds ? baseDamage * 0.1 : 0;

        // Special Modifiers
        let cursedObjectsBonus = 0;
        if (opponent.cursedObjects.includes('Ryomen Sukuna’s Finger')) {
            cursedObjectsBonus = baseDamage * 0.2;
        }

        // Gojo's Special Abilities
        let gojoBonus = 0;
        if (this instanceof Gojo) {
            gojoBonus = baseDamage * 0.5;
        }

        const totalDamage = (baseDamage + strengthModifier + techniqueMasteryModifier + cursedEnergyModifier + cursedObjectsBonus + gojoBonus + sizeModifier) - enduranceModifier - cursedWoundsPenalty;

        return Math.max(totalDamage, 0);
    }
}