'use strict';

const path = require('path');
const PORT = process.env.PORT || 8080;

// define routes and socket
console.log('Socket.io listening on port: ', PORT);
const io = require('socket.io')(PORT);

// Game Server
// const PAEServerEngine = require(path.join(__dirname, 'src/server/PAEServerEngine.js'));
// const PAEGameEngine = require(path.join(__dirname, 'src/common/PAEGameEngine.js'));
// const SimplePhysicsEngine = require('lance-gg').physics.SimplePhysicsEngine;
//
// // Game Instances
// const physicsEngine = new SimplePhysicsEngine();
// const gameEngine = new PAEGameEngine({ physicsEngine, traceLevel: 1 });
// const serverEngine = new PAEServerEngine(io, gameEngine, { debug: {}, updateRate: 6 });
//
// // start the game
// serverEngine.start();
