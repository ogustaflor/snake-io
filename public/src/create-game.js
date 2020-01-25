export default function createGame() {
    const observers = [];

    function subscribe(method) {
        observers.push(method);
    }

    function notifyAll(command) {
        for (const method of observers) {
            method(command);
        }
    }

    const state = {
        players: [],
        points: [],
        screen: {
            width: 16,
            height: 16
        }
    }

    function setState(newState) {
        Object.assign(state, newState);
    }

    function addPlayer(command) {
        const player = {
            id: command.player.id,
            pivot: {
                x: ('pivot' in command.player && 'x' in command.player.pivot ? command.player.pivot.x : Math.floor(Math.random() * state.screen.width)),
                y: ('pivot' in command.player && 'y' in command.player.pivot ? command.player.pivot.y : Math.floor(Math.random() * state.screen.height))
            },
            points: ('points' in command.player ? command.points : 0)
        };
        
        state.players.push(player);

        notifyAll({
            type: 'add-player',
            player
        });
    }

    function removePlayer(command) {
        state.players.splice(state.players.findIndex(player => player.id === command.player.id), 1);

        notifyAll({
            type: 'remove-player',
            player: { id: command.player.id } 
        });
    }

    function addPoint(command = {}) {
        const point = {
            id: ('point' in command && 'id' in command.point ? command.point.id : Math.floor(Math.random() * 100000000)),
            pivot: {
                x: ('point' in command && 'pivot' in command.point && 'x' in command.point.pivot ? command.point.pivot.x : Math.floor(Math.random() * state.screen.width)),
                y: ('point' in command && 'pivot' in command.point && 'y' in command.point.pivot ? command.point.pivot.y : Math.floor(Math.random() * state.screen.height))
            },
        };

        state.points.push(point);

        notifyAll({
            type: 'add-point',
            point
        });
    }

    function removePoint(command) {
        state.points.splice(state.points.findIndex(point => point.id === command.point.id), 1);
    
        notifyAll({
            type: 'remove-point',
            point: command.point
        });
    }

    function movePlayer(command) {
        const acceptedMoves = {
            ArrowUp(player) {
                if (player.pivot.y - 1 >= 0) {
                    player.pivot.y--;
                } else {
                    player.pivot.y = state.screen.height - 1;
                }
            },
            ArrowDown(player) {
                if (player.pivot.y + 1 < state.screen.height) {
                    player.pivot.y++;
                } else {
                    player.pivot.y = 0;
                }
            },
            ArrowLeft(player) {
                if (player.pivot.x - 1 >= 0) {
                    player.pivot.x--;
                } else {
                    player.pivot.x = state.screen.width - 1;
                }
            },
            ArrowRight(player) {
                if (player.pivot.x + 1 < state.screen.width) {
                    player.pivot.x++;
                } else {
                    player.pivot.x = 0;
                }
            }
        }

        const player = state.players.find(player => player.id === command.player.id);

        const movePlayerFunction = acceptedMoves[command.handler];

        if (movePlayerFunction && player) {
            movePlayerFunction(player);
            
            checkCollision({ 
                player,
                with: 'points'
            });

            notifyAll({
                type: 'move-player',
                player,
                handler: command.handler,
            });
        }
    }

    function checkCollision(command) {
        const acceptedColisionsWith = {
            points(player) {
                state.points.forEach(point => {
                    if (player.pivot.x === point.pivot.x && player.pivot.y === point.pivot.y) {
                        removePoint({ point });
                        player.points++;
                    }
                });
            }
        }

        const checkCollisionFunction = acceptedColisionsWith[command.with];

        if (checkCollisionFunction) {
            checkCollisionFunction(command.player);
        }
    }

    let seeding;

    function start() {
        seeding = setInterval(addPoint, 5000);
    }

    function stop() {
        clearInterval(seeding);
    }

    return {
        subscribe,
        state,
        setState,
        addPlayer,
        removePlayer,
        addPoint,
        removePoint,
        movePlayer,
        checkCollision,
        start,
        stop
    }
}