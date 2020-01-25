export default function renderScreen(screen, game, requestAnimationFrame, socket) {
    const context = screen.getContext('2d');
    context.clearRect(0, 0, screen.width, screen.height);

    game.state.players.forEach(player => {
        context.fillStyle = (player.id === socket.id ? 'orange' : 'black');
        context.globalAlpha = (player.id === socket.id ? .96 : .24);
        context.fillRect(player.pivot.x, player.pivot.y, 1, 1);
    });

    game.state.points.forEach(point => {
        context.fillStyle = 'green';
        context.globalAlpha = 1;
        context.fillRect(point.pivot.x, point.pivot.y, 1, 1);
    });

    requestAnimationFrame(() => {
        renderScreen(screen, game, requestAnimationFrame, socket);
    });
}