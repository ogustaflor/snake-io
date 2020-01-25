import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import createGame from './public/src/create-game.js';

const app = express();
const server = http.createServer(app);
const sockets = socketio(server);

app.use(express.static('public'));

const game = createGame();

game.subscribe((command) => {
    sockets.emit(command.type, command);
});

game.start();

sockets.on('connection', (socket) => {
    game.addPlayer({ player: { id: socket.id } });

    socket.emit('bootstrap', game.state);

    socket.on('handle-keydown', (command) => {
        if (command.player.id === socket.id) {
            game.movePlayer(command);
        }
    });

    socket.on('disconnect', () => {
        game.removePlayer({ player: { id: socket.id } });
    });
});

server.listen(3000);