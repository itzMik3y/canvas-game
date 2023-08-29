class Projectile {
    constructor(x, y, direction, speed) {
        this.x = x;
        this.y = y;
        // this.position = { x: x, y: y };
        this.direction = direction; // 'right' or 'left'
        this.speed = speed;
        this.width = 20;  // choose a suitable size for the projectile
        this.height = 10;
        this.hasImpacted = false; 
    }

    draw() {
        c.fillStyle = 'yellow';  // or any color you like
        c.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        if (this.direction === 'right') {
            this.x += this.speed;
           
        } else if (this.direction === 'left') {
            this.x -= this.speed;
        }
        this.draw();
    }
    calculateDamage(baseDamage, opponent,player) {
        // Offensive Modifiers
        const strengthModifier = player.strength / 10;
        const techniqueMasteryModifier = player.techniqueMastery * 2;
        const cursedEnergyModifier = player.cursedEnergy * 0.01; // Reduced the influence of cursed energy for balance
    
        // Defensive Modifiers
        const enduranceModifier = opponent.endurance / 10;
        const cursedWoundsPenalty = opponent.cursedWounds ? baseDamage * 0.1 : 0;
    
        // Special Modifiers
        let cursedObjectsBonus = 0;
        if (opponent.cursedObjects.includes('Ryomen Sukuna’s Finger')) {
            cursedObjectsBonus = baseDamage * 0.2; // 20% bonus damage for possessing Sukuna's Finger
        }
    
        // Gojo's Special Abilities
        let gojoBonus = 0;
        if (this instanceof Gojo) {
            gojoBonus = baseDamage * 0.5; // 50% bonus damage because Gojo is the strongest
        }
    
        const totalDamage = (baseDamage + strengthModifier + techniqueMasteryModifier + cursedEnergyModifier + cursedObjectsBonus + gojoBonus) - enduranceModifier - cursedWoundsPenalty;
        this.hasImpacted = true; 
        return Math.max(totalDamage, 0); // Ensure damage doesn't go negative
    }
    
}