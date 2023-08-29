const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const app = express();
const server = http.createServer(app);

app.use(cors());
const io = socketIo(server, {
    cors: {
        origin: "*",  // Your client's origin
        methods: ["GET", "POST"]
    }
});

let playerCount = 0;

// const players = []; // Array to store connected players
let players = [];
let lobbies = {};
const canvas={width:1324,height:676}
io.on('connection', (socket) => {
    playerCount++;
    console.log('Client connected', playerCount);
    // socket.emit('assignPlayerNumber', { playerNumber: playerCount });
    
    // Send the current list of players to the newly connected client
    socket.emit('currentPlayers', players);
    
    // Broadcast the updated players array to all clients
    io.emit('updatePlayers', players);
    io.emit('updateLobbies', lobbies);
    // Listen for a new player being selected
    socket.on('newPlayerSelected', (playerData) => {
        players.push(playerData);
        // Broadcast the updated players array to all clients
        io.emit('updatePlayers', players);
    });
    
    socket.on('disconnect', () => {
        playerCount--
        const index = players.findIndex(player => player.id === socket.id);
        if (index !== -1) {
            console.log(`Player ${players[index].name} has been removed.`);
            players.splice(index, 1);
        }
        for (const lobbyID in lobbies) {
            const lobby = lobbies[lobbyID];
            const socketIndex = lobby.sockets.indexOf(socket.id);
            if (socketIndex !== -1) {
                // Remove the disconnecting socket's ID from the lobby's sockets array
                lobby.sockets.splice(socketIndex, 1);
    
                // If the lobby has no more connected sockets, delete the lobby
                if (lobby.sockets.length === 0) {
                    delete lobbies[lobbyID];
                    console.log(`Lobby ${lobbyID} has been removed as all players disconnected.`);
                }
            }
        }
    });

    socket.on('message', (data) => {
        socket.broadcast.emit('message', data);
    });

    socket.on('playerReady', (data) => {
        const lobby = lobbies[data.lobbyID];
        if (lobby) {
            const player = lobby.players.find(p => p.id === socket.id);
            if (player) {
                player.ready = true;
              
            }

            // Check if all players in the lobby are ready or if the lobby has reached the maximum number of players
            if (lobby.players.length === 2) {
                console.log('re test')
                lobby.gameStarted=true
                io.to(data.lobbyID).emit('startGame',lobby);
                
            }
        }
    });

    socket.on('createLobby', (data) => {
        const lobbyID = generateUniqueLobbyID(); // Implement this function
        lobbies[lobbyID] = {
            players: [{...data,id:socket.id,lobbyID:lobbyID,playerNumber:1}],
            sockets:[socket.id],
            gameStarted: false,
            gameState: {players:[{
            id:socket.id,
            ...data.player,
            keys:{
                a:{
                    pressed:false
                },
                d:{
                    pressed:false
            
                },
                w:{
                    pressed:false
                },
            },
            currentAnimation:[],
            direction:'right'
            }]},
            playerCount: 1 
            // ... any other lobby data
        };
        socket.join(lobbyID);
        socket.emit('assignPlayerNumber', { playerNumber: lobbies[lobbyID].playerCount });
        io.emit('updateLobbies', lobbies);
        socket.emit('lobbyCreated', { success: true, lobbyID: lobbyID});
      

    });

    socket.on('joinLobby', (data) => {
        const lobby = lobbies[data.lobbyID];
        if (lobby) {
            lobby.playerCount += 1;
            data.player.position.x=canvas.width-data.player.width-50
            // data.player.direction='left'
            lobby.players.push({...data,id:socket.id,playerNumber:playerCount});
            lobby.gameState.players.push({
                id:socket.id,
                ...data.player,
                keys:{
                    a:{
                        pressed:false
                    },
                    d:{
                        pressed:false
                
                    },
                    w:{
                        pressed:false
                    },
                },
                currentAnimation:[],
                direction:'left'
            })
            lobby.sockets.push(socket.id);
            socket.join(data.lobbyID);
            socket.emit('assignPlayerNumber', { playerNumber: lobby.playerCount });
            io.to(data.lobbyID).emit('playerJoined', { playerName: data.playerName });
            io.emit('updateLobbies', lobbies);
            io.emit('yourLobby',lobbies[data.lobbyID])
        } else {
            socket.emit('error', { message: 'Lobby not found' });
        }
    });

    socket.on('playerMovement', (data) => {
        const lobby = lobbies[data.lobbyID];
        const player = findPlayerBySocketID(socket.id);  // You'll need to implement this function
        if (!player) return;
        if (data.type === 'keyup') {
            if (['w', 'd', 'a'].includes(data.key)) {
                player.keys[data.key].pressed = false;
            }
        }
        if (data.type === 'keydown') {
            if (['w', 'd', 'a'].includes(data.key)) {
                player.keys[data.key].pressed = true;
            }
    
            switch (data.key) {
                case 'w':
                    player.currentAnimation = ['jump', 'right'];
                    break;
                case 'd':
                    player.lastKey = 'd';
                    player.currentAnimation = ['run', 'right']; //line 168
                    player.direction='right'
                    // console.log('move forward');
                    break;
                case 'a':
                    player.lastKey = 'a';
                    player.currentAnimation = ['run', 'left'];
                    player.direction='left'
                    break;
            }
        }
        // if (lobby) {
        //     // console.log('got here with: ', socket.id)
        //     socket.broadcast.to(data.lobbyID).emit('updatePlayerMovement', data);

        //     // io.to(data.lobbyID).emit('updatePlayerMovement', data);
        // }
    });
    
    
});

function generateUniqueLobbyID() {
    return Math.random().toString(36).substr(2, 9);
}

function updateGameState() {
    for (const lobbyID in lobbies) {
        const lobby = lobbies[lobbyID];
        
        // Skip the lobby if the game hasn't started
        if (!lobby.gameStarted) continue;

        for (const player of lobby.gameState.players) {
            // Reset velocity.x to 0
            player.velocity.x = 0;

            // Apply gravity
            player.velocity.y += player.gravity;
            
            // Update velocity based on keys pressed
            if (player.keys.a.pressed && player.lastKey === 'a') {
                player.velocity.x = -5;
            } else if (player.keys.d.pressed && player.lastKey === 'd') {
                player.velocity.x = 5;
            } else {
                player.currentAnimation = ['idle', player.direction];
            }

            // Update position with the calculated velocity
            player.position.x += player.velocity.x;
            player.position.y += player.velocity.y;

            //Collision with ground
            const GROUND_LEVEL = canvas.height - player.height;
            if (player.position.y >= GROUND_LEVEL) {
                player.position.y = GROUND_LEVEL;
                player.velocity.y = 0;
            }

            // for (const otherPlayer of lobby.gameState.players) {
            //     if (player.id !== otherPlayer.id) {
            //         if (isColliding(player, otherPlayer)) {
            //             // Adjust player's position to prevent collision (this is a simple solution, you can implement more complex collision resolution if needed)
            //             player.position.x -= player.velocity.x;
            //             player.position.y -= player.velocity.y;
            //         }
            //     }
            // }
        }
        
        // Broadcast the updated game state to all clients in the lobby
        io.to(lobbyID).emit('updateGameState', lobby.gameState);
    }
}


function isColliding(player1, player2) {
    return player1.position.x < player2.position.x + player2.width &&
           player1.position.x + player1.width > player2.position.x &&
           player1.position.y < player2.position.y + player2.height &&
           player1.position.y + player1.height > player2.position.y;
}
// Run the Game Loop at a Fixed Interval
const GAME_LOOP_INTERVAL = 1000 / 240;  // 60 FPS

setInterval(updateGameState, GAME_LOOP_INTERVAL);

function findPlayerBySocketID(socketID) {
    for (const lobbyID in lobbies) {
        const lobby = lobbies[lobbyID];
        for (const player of lobby.gameState.players) {  // <-- Change this line
            if (player.id === socketID) {
                return player;
            }
        }
    }
    return null;  // Return null if the player is not found
}


server.listen(8080, () => {
    console.log('Server started on http://localhost:8080');
});

// server.listen(3000, '0.0.0.0', () => {  // <-- Change here
//     console.log('Server started on http://YOUR_LOCAL_IP:3000');  // <-- Update this message with your local IP
// });

