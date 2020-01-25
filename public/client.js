import createGame from './src/create-game.js';
import createKeyboardListener from './src/create-keyboard-listener.js';
import renderScreen from './src/render-screen.js';

const game = createGame();
const socket = io();

socket.on('bootstrap', (state) => {
    game.setState(state);

    const screen = document.querySelector('#screen');
    screen.setAttribute('width', game.state.screen.width);
    screen.setAttribute('height', game.state.screen.height);

    renderScreen(screen, game, requestAnimationFrame, socket);

    const keyboardListener = createKeyboardListener(document, socket);
    keyboardListener.subscribe((command) => {
        socket.emit(command.type, command);
    });
});

socket.on('add-player', (command) => {
    const player = command.player;
    game.addPlayer({ player });
});

socket.on('remove-player', (command) => {
    const player = command.player;
    game.removePlayer({ player });
});

socket.on('move-player', (command) => {
    const player = command.player;
    const handler = command.handler;
    game.movePlayer({ player, handler });
});

socket.on('add-point', (command) => {
    const point = command.point;
    game.addPoint({ point });
});

socket.on('remove-point', (command) => {
    const point = command.point;
    game.removePoint({ point });
});
