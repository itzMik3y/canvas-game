// const enemy=new Player({playerNumber:2,position:{x:400,y:100},velocity:{x:0,y:0},offset:{x:-50,y:300},imageSrc:'/images/samuraiMack/Idle.png',framesMax:8,scale:2.75,sprites:{idle:{imageSrc:'/images/samuraiMack/Idle.png',framesMax:8},run:{imageSrc:'/images/samuraiMack/Run.png',framesMax:8},jump:{imageSrc:'/images/samuraiMack/Jump.png',framesMax:8}}})
// const enemy = new Player({
//     position: {
//       x: 0,
//       y: 0
//     },
//     velocity: {
//       x: 0,
//       y: 0
//     },
//     offset: {
//       x: 0,
//       y: 0
//     },
//     imageSrc: './images/samuraiMack/Idle.png',
//     framesMax: 8,
//     scale: 2.5,
//     offset: {
//       x: -50,
//       y: 270
//     },
//     sprites: {
//       idle: {
//         imageSrc: './images/samuraiMack/Idle.png',
//         framesMax: 8
//       },
//       run: {
//         imageSrc: './images/samuraiMack/Run.png',
//         framesMax: 8
//       },
//       jump: {
//         imageSrc: './images/samuraiMack/Jump.png',
//         framesMax: 2
//       },
//       fall: {
//         imageSrc: './images/samuraiMack/Fall.png',
//         framesMax: 2
//       },
//       attack1: {
//         imageSrc: './images/samuraiMack/Attack1.png',
//         framesMax: 6
//       },
//       takeHit: {
//         imageSrc: './images/samuraiMack/Take Hit - white silhouette.png',
//         framesMax: 4
//       },
//       death: {
//         imageSrc: './images/samuraiMack/Death.png',
//         framesMax: 6
//       }
//     },
//     attackBox: {
//       offset: {
//         x: 100,
//         y: 50
//       },
//       width: 160,
//       height: 50
//     }
//   })
function handlePlayerCollision(player1, player2) {
    // Handle the collision. This is just a basic example that pushes the players apart.
    // You can add more complex logic here if needed.

    // Calculate the overlap distance
    const overlapX = player1.position.x + player1.width - player2.position.x;
    const overlapY = player1.position.y + player1.height - player2.position.y;

    // Push the players apart by half the overlap distance
    player1.position.x -= overlapX / 2;
    player1.position.y -= overlapY / 2;
    player2.position.x += overlapX / 2;
    player2.position.y += overlapY / 2;
}
if(player.isCollidingWith(enemy)){
    player.handleCollisionWith(enemy);
}
if(enemy.isCollidingWith(player)){
    enemy.handleCollisionWith(player);
} 

function updateCharacter(character, data) {
    data.key=getOppositeKey(data.key)
    if (data.type === 'keydown') {
        if (data.key === 'd') {
            keys[data.key].pressed=true
            character.lastKey=data.key
            character.switchAnimation('run', 'right');
            character.position=data.player.position
        }
       else  if (data.key === 'a') {
            character.lastKey=data.key
            keys[data.key].pressed=true
            character.switchAnimation('run', 'left');
            character.position=data.player.position
        }
        else if (data.key === 'ArrowRight') {
            keys[data.key].pressed=true
            character.lastKey=data.key
            character.switchAnimation('run', 'right');
            // character.position=data.player.position
        }
       else if (data.key === 'ArrowLeft') {
            keys[data.key].pressed=true
            character.lastKey=data.key
            character.switchAnimation('run', 'left');
            character.position=data.player.position
        }
    } 
    else if (data.type === 'keyup') {
        if (data.key === 'd') {
            keys[data.key].pressed=false
            character.position=data.player.position
        }
        if (data.key === 'a') {
            keys[data.key].pressed=false
            character.position=data.player.position
        }
        if (data.key === 'ArrowRight') {
            keys[data.key].pressed=false
            character.position=data.player.position
        }
        if (data.key === 'ArrowLeft') {
            keys[data.key].pressed=false
            character.position=data.player.position
        }
       
    }
}