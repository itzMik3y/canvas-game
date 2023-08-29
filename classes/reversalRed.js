class RedProjectile extends Projectile {
    constructor(x, y, direction, speed, target, playerHeight) {
        super(x, y, direction, speed);
        this.target = target;
        this.width = 50;  // Initial size
        this.height = 50;
        this.growthRate = 5;  // Growth rate
        this.magneticPushBaseStrength = 10;  // Base push strength (opposite of pull)
        this.growing = true;  // New property to determine if the projectile should grow
        this.maxHeight = 2 * playerHeight;  // Maximum growth height
        this.launched = false;  
    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2, false);
        c.fillStyle = 'red';  // Red color for the RedProjectile
        c.fill();
        c.closePath();
    }

    update() {
        super.update();
    
        // Increase size over time only if it's growing and hasn't reached max height
        if (this.growing && this.height < this.maxHeight) {
            this.width += this.growthRate;
            this.height += this.growthRate;
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
            const MAX_PUSH_STRENGTH = 5;  // Adjust this value as needed

            // Inside the update method of RedProjectile:
            const pushStrength = Math.min(this.magneticPushBaseStrength * (this.height / this.maxHeight) / distance, MAX_PUSH_STRENGTH);
            // const pushStrength = this.magneticPushBaseStrength * (this.height / this.maxHeight) / distance;
    
            // Push the target away from the projectile (opposite of pull)
            this.target.velocity.x -= dx * pushStrength;
            // this.target.velocity.y -= dy * pushStrength;
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
