
// const ws = new WebSocket('ws://localhost:8080');
const socket = io.connect('http://localhost:8080'); //switch back to localhost 192.168.0.7
const canvas=document.querySelector('canvas')
const c=canvas.getContext('2d')
const player_health=document.querySelector('.player-health')
const enemy_health=document.querySelector('.enemy-health')
const timer=document.querySelector('.timer')
const match_result=document.querySelector('.match-result')
const game_screen=document.querySelector('.game')


canvas.width =1324
canvas.height=676
let playerNumber


let player_selections={

}
socket.on('connect', () => {
    console.log('Connected to the server with socket ID:', socket.id);
});
const gojoAnimations = {
    right:{
        idle: ['images/gojo/gojo_right_idle_1.png', 'images/gojo/gojo_right_idle_2.png', 'images/gojo/gojo_right_idle_3.png','images/gojo/gojo_right_idle_4.png'],
        run: ['images/gojo/gojo_right_run_1.png', 'images/gojo/gojo_right_run_2.png','images/gojo/gojo_right_run_3.png','images/gojo/gojo_right_run_4.png','images/gojo/gojo_right_run_5.png','images/gojo/gojo_right_run_6.png','images/gojo/gojo_right_run_7.png','images/gojo/gojo_right_run_8.png','images/gojo/gojo_right_run_9.png','images/gojo/gojo_right_run_10.png'], // Example run animation frames
        jump:['images/orginal gojo/50-0.png','images/orginal gojo/50-1.png','images/orginal gojo/50-2.png','images/orginal gojo/50-3.png'],
        start:['images/orginal gojo/100-0.png','images/orginal gojo/190-1.png','images/orginal gojo/190-2.png','images/orginal gojo/190-3.png','images/orginal gojo/190-4.png']

    },
    left:{   
        idle: ['images/gojo/gojo_left_idle_1.png', 'images/gojo/gojo_left_idle_2.png', 'images/gojo/gojo_left_idle_3.png','images/gojo/gojo_left_idle_4.png'],
        run: ['images/orginal gojo/20-0.png', 'images/orginal gojo/20-1.png','images/orginal gojo/20-2.png','images/orginal gojo/20-3.png'], // Example run animation frames
        jump:['images/orginal gojo/50-0.png','images/orginal gojo/50-1.png','images/orginal gojo/50-2.png','images/orginal gojo/50-3.png'],
        start:['images/orginal gojo/100-0.png','images/orginal gojo/190-1.png','images/orginal gojo/190-2.png','images/orginal gojo/190-3.png','images/orginal gojo/190-4.png']
    }
    // ... other animations ...
};
const yujiAnimations={
    right: {
         idle: ['images/yuji/yuji_right_idle_1.png','images/yuji/yuji_right_idle_2.png','images/yuji/yuji_right_idle_3.png','images/yuji/yuji_right_idle_4.png'],
         run: ['images/yuji/yuji_right_run_1.png', 'images/yuji/yuji_right_run_2.png','images/yuji/yuji_right_run_3.png','images/yuji/yuji_right_run_4.png','images/yuji/yuji_right_run_5.png','images/yuji/yuji_right_run_6.png','images/yuji/yuji_right_run_7.png','images/yuji/yuji_right_run_8.png'], // Example run animation frames
         jump:['images/orginal gojo/50-0.png','images/orginal gojo/50-1.png','images/orginal gojo/50-2.png','images/orginal gojo/50-3.png'],
         start:['images/orginal gojo/100-0.png','images/orginal gojo/190-1.png','images/orginal gojo/190-2.png','images/orginal gojo/190-3.png','images/orginal gojo/190-4.png']
     },
     left:{
         idle: ['images/yuji/yuji_left_idle_1.png','images/yuji/yuji_left_idle_2.png','images/yuji/yuji_left_idle_3.png','images/yuji/yuji_left_idle_4.png'],
         run: ['images/yuji/yuji_left_run_1.png', 'images/yuji/yuji_left_run_2.png','images/yuji/yuji_left_run_3.png','images/yuji/yuji_left_run_4.png','images/yuji/yuji_left_run_5.png','images/yuji/yuji_left_run_6.png','images/yuji/yuji_left_run_7.png','images/yuji/yuji_left_run_8.png'], // Example run animation frames
         jump:['images/orginal gojo/50-0.png','images/orginal gojo/50-1.png','images/orginal gojo/50-2.png','images/orginal gojo/50-3.png'],
         start:['images/orginal gojo/100-0.png','images/orginal gojo/190-1.png','images/orginal gojo/190-2.png','images/orginal gojo/190-3.png','images/orginal gojo/190-4.png']
     }
 }
function character_select(character){
    player_selections['character']=character
}
let player 
function selectPlayer() {
   
    player_selections['playerName']=document.getElementById('playername').value
    if(player_selections['character']=='Gojo'){
       
        player = new Gojo({
            playerNumber: 1,
            position: {x: 0, y: 0},
            velocity: {x: 0, y: 10},
            offset: {x: 100, y: 120},
            animations: gojoAnimations,
            framesMax: {idle: 3, run: 4, jump:4,start:5}, // Example framesMax for each animation
            scale: 4.2,
            animationScales:{idle:4.2,run:10.3}
        });

    }
    else if(player_selections['character']=='Yuji'){
        player = new Gojo({
            playerNumber: 1,
            position: {x: 0, y: 0},
            velocity: {x: 0, y: 10},
            offset: {x: 100, y: 200},
            animations:yujiAnimations,
            framesMax: {idle: 3, run: 8, jump:4,start:5}, // Example framesMax for each animation
            scale: 1.8
        });
    }
    // Hide the player selection screen and display the game screen
   
    document.getElementById('playerSelectScreen').style.display = 'none';
    document.querySelector('.lobbyScreen').style.display = 'flex';
    player_selections['player']=player
    console.log(player_selections)
}

function createLobby() {
    socket.emit('createLobby', player_selections);

    // Listen for a response from the server after creating the lobby
    socket.on('lobbyCreated', (data) => {
        if (data.success) {
            console.log(`Successfully created lobby with ID: ${data.lobbyID}`);
            player_selections['lobbyID']=data.lobbyID
            // player_selections['id']=data.socket.id
            // Handle other logic after creating the lobby, e.g., updating the UI
        } else {
            console.log(`Failed to create lobby: ${data.message}`);
        }
    });
    const readyButton = document.createElement('button');
    readyButton.textContent = 'Ready';
    readyButton.onclick=()=>{
        socket.emit('playerReady', player_selections);
    }
    const lobbyScreen=document.querySelector('.lobbyScreen')
    lobbyScreen.appendChild(readyButton)

    
}

socket.on('lobbyCreated', (data) => {
    // console.log('all lobbies', data)
    console.log(`Lobby created with ID: ${data.lobbyID}`);
    // ... handle UI changes
});
socket.on('updateLobbies', (lobbies) => {
    console.log('Received updated list of lobbies:', lobbies);
    const lobbiesDiv = document.querySelector('.lobby-select')
    lobbiesDiv.innerHTML = ''; // Clear the current list

    for (const lobbyID in lobbies) {
        const lobby = lobbies[lobbyID];
        const lobbyElement = document.createElement('div');
        lobbyElement.textContent = `Lobby ID: ${lobbyID}, Players: ${lobby.players.map((player)=>player.playerName).join(', ')}`;
        lobbyElement.classList.add('lobby')
        
        const joinButton = document.createElement('button');
        joinButton.textContent = 'Join';
        
        lobbyElement.appendChild(joinButton);
        joinButton.onclick = () => {
            joinLobby(lobbyID,player_selections.player_name)
            player_selections['lobbyID']=lobbyID
            const readyButton = document.createElement('button');
            readyButton.textContent = 'Ready';
            readyButton.onclick=()=>{
                socket.emit('playerReady', player_selections);
            }
            const lobbyScreen=document.querySelector('.lobbyScreen')
            lobbyScreen.appendChild(readyButton)
            
          };
        lobbiesDiv.appendChild(lobbyElement);
    }

    // Here, you can update your client's UI or state with the received list of lobbies
    // For example, if you're using React, you might call a setState function or 
    // if you're using vanilla JS, you might update the DOM directly.
});
let gameStart=false
let player2,player3,player4=null
let enemy
let players=[]
socket.on('startGame', (lobby) => {
    console.log('The game has started!');
    console.log(lobby)
    document.querySelector('.lobbyScreen').style.display = 'none';
    game_screen.style.display='flex'
    const players_in_lobby=lobby.players
  
    // console.log('players in game:',players)
    players_in_lobby.map((x)=>{
        if(x.playerNumber!=playerNumber){
            if(x.character=='Yuji'){
                enemy = new Gojo({
                        playerNumber: 1,
                        position: {x: 0, y: 0},
                        velocity: {x: 0, y: 10},
                        offset: {x: 100, y: 40},
                        animations:yujiAnimations,
                        framesMax: {idle: 3, run: 8, jump:4,start:5}, // Example framesMax for each animation
                        scale: 1.8
                });
            }
            if(x.character=='Gojo'){
                enemy=new Gojo({
                    playerNumber: 1,
                    position: {x: 0, y: 0},
                    velocity: {x: 0, y: 10},
                    offset: {x: 100, y: 130},
                    animations: gojoAnimations,
                    framesMax: {idle: 3, run: 4, jump:4,start:5}, // Example framesMax for each animation
                    scale: 4.2,
                    animationScales:{idle:4.2,run:10.3}
                });
            }
        }
    })
});


function joinLobby(lobbyID, playerName) {
    socket.emit('joinLobby', {
        lobbyID: lobbyID,
        ...player_selections
    });

    // Listen for a response from the server after joining the lobby
    socket.on('joinedLobby', (data) => {
        if (data.success) {
            console.log(`Successfully joined lobby: ${lobbyID}`);
            // player_selections['lobbyID']=lobbyID
            // Handle other logic after joining the lobby, e.g., updating the UI
        } else {
            console.log(`Failed to join lobby: ${data.message}`);
        }
    });
   
}

socket.on('playerJoined', (data) => {
    console.log(`${data.playerName} joined the lobby`);
    // ... handle UI changes
});




c.fillRect(0,0,canvas.width,canvas.height)

const background=new Sprite({
    position:{
        x:0,
        y:0
    },
    height:canvas.height,
    width:canvas.width,
    imageSrc:"./images/background/background.png",
})

const shop=new SpriteObject({
    position:{
        x:screen.width*0.60,
        y:100
    },
    scale:3.75,
    framesMax:6,
    imageSrc:'./images/decorations/shop_anim.png'
})



let keys={
    a:{
        pressed:false
    },
    d:{
        pressed:false

    },
    w:{
        pressed:false
    },
    ArrowLeft:{
        pressed:false
    },
    ArrowRight:{
        pressed:false
    },
    ArrowUp:{
        pressed:false
    }
}


function rectangularCollision(rect1, rect2){
    return(
        rect1.position.x + rect1.width >= rect2.position.x &&
        rect1.position.x <= rect2.position.x + rect2.width &&
        rect1.position.y + rect1.height >= rect2.position.y &&
        rect1.position.y <= rect2.position.y + rect2.height
    );
}

function projectileTouching(projectile, player) {
    const proximity = 10;  // Define a proximity value (e.g., 10 pixels)

    return (
        projectile.x + projectile.width + proximity > player.position.x &&
        projectile.x - proximity < player.position.x + player.width &&
        projectile.y + projectile.height + proximity > player.position.y &&
        projectile.y - proximity < player.position.y + player.height
    );
}



function checkCollision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}


function determineWinner({player,enemy,timerId}){
    clearTimeout(timerId)
    match_result.style.display='flex'
    if(player.health>enemy.health){
        match_result.innerHTML='Player 1 Wins'
    }
    else if(player.health===enemy.health){
        match_result.innerHTML='Tie'
    }
    else if(enemy.health>player.health){
        match_result.innerHTML='Player 2 Wins'
    }
}
let time=10
let timerId

const projectiles = [];
decreaseTimer()
  

const keyMapping = {
    'd': 'ArrowRight',
    'a': 'ArrowLeft',
    'w': 'ArrowUp',
    's': 'ArrowDown',
    'ArrowRight': 'd',
    'ArrowLeft': 'a',
    'ArrowUp': 'w',
    'ArrowDown': 's'
};

// Function to get the opposite key
function getOppositeKey(receivedKey) {
    return keyMapping[receivedKey] || receivedKey; // If the key is not in the mapping, return the original key
}

function updateCharacter(character, data) {
    character.position=data.position
    character.offset=data.offset
    // if(JSON.stringify(data.currentAnimation) != JSON.stringify(character.currentAnimation))
    character.switchAnimation(data.currentAnimation[0],data.currentAnimation[1])
}


socket.on('assignPlayerNumber', (data) => {
    // Handle the assigned player number
    playerNumber=data.playerNumber 
    console.log("My Player Number: ",playerNumber)
    const playerNumberInput = document.getElementById('playerNumber');
    playerNumberInput.innerText='My Player Number: '+playerNumber+"Socket id:"+socket.id
});


socket.on('updateGameState', (data) => {
    let playerUpdates=data.players
    playerUpdates.map((playerUpdate)=>{
        if(playerUpdate.id!=socket.id){
            updateCharacter(enemy,playerUpdate)
        }else{
            updateCharacter(player,playerUpdate)
        }
    })
    animate()
});
function animate(){
    // console.log(players)
    // window.requestAnimationFrame(animate)
    c.fillStyle='black'
    c.fillRect(0,0,canvas.width,canvas.height)
   
    background.update()
    shop.update()
    

    player.update()
    enemy.update()
        

    if(player.health<=0 || enemy.health<=0){
        determineWinner({player,enemy,timerId})
    }
}

window.addEventListener('keydown',(event)=>{
    
    const data = {
        playerID: socket.id,
        type: 'keydown',
        key: event.key,
        lobbyID: player_selections['lobbyID'],
    };
      
    socket.emit('playerMovement', data);
  
})

window.addEventListener('keyup',(event)=>{ 
    const data = {
        playerID: socket.id,
        type: 'keyup',
        key: event.key,
        lobbyID: player_selections['lobbyID'],
    };
    socket.emit('playerMovement', data);
 
})