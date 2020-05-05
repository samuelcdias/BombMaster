export default function createGame() {
    const state = {
        players: {},
        bombs: {},
        screen: {
            width: 41,
            height: 41
        }
    }

    const observers = []

    function start() {
        const frequency = 2000

        setInterval(update, frequency)
    }

    function subscribe(observerFunction) {
        observers.push(observerFunction)
    }

    function notifyAll(command) {
        for (const observerFunction of observers) {
            observerFunction(command)
        }
    }

    function setState(newState) {
        Object.assign(state, newState)
    }

    function addPlayer(command) {
        const playerId = command.playerId
        const playerX = 'playerX' in command ? command.playerX : Math.floor(Math.random() * state.screen.width)
        const playerY = 'playerY' in command ? command.playerY : Math.floor(Math.random() * state.screen.height)

        state.players[playerId] = {
            x: playerX,
            y: playerY
        }

        notifyAll({
            type: 'add-player',
            playerId: playerId,
            playerX: playerX,
            playerY: playerY
        })
    }

    function removePlayer(command) {
        const playerId = command.playerId

        delete state.players[playerId]

        notifyAll({
            type: 'remove-player',
            playerId: playerId
        })
    }

    function addBomb(command) {
        const bombId = command ? command.bombId : Math.floor(Math.random() * 10000000)
        const bombRange = command.bombRange
        const bombX = command.bombX
        const bombY = commmand.bombY

        state.bombs[bombId] = {
            x: bombX,
            y: bombY,
            range: bombRange,
            timer: 3,
            active: false
        }

        notifyAll({
            type: 'add-bomb',
            bombId: bombId,
            bombRange: bombRange,
            bombX: bombX,
            bombY: bombY
        })
    }

    function removeBomb(command) {
        const bombId = command.bombId

        delete state.bombs[bombId]

        notifyAll({
            type: 'remove-bomb',
            bombId: bombId,
        })
    }

    function movePlayer(command) {
        notifyAll(command)

        const acceptedMoves = {
            ArrowUp(player) {
                if (player.y - 1 >= 0) {
                    player.y = player.y - 1
                }
            },
            ArrowRight(player) {
                if (player.x + 1 < state.screen.width) {
                    player.x = player.x + 1
                }
            },
            ArrowDown(player) {
                if (player.y + 1 < state.screen.height) {
                    player.y = player.y + 1
                }
            },
            ArrowLeft(player) {
                if (player.x - 1 >= 0) {
                    player.x = player.x - 1
                }
            }
        }

        const keyPressed = command.keyPressed
        const playerId = command.playerId
        const player = state.players[playerId]
        const moveFunction = acceptedMoves[keyPressed]

        if (player && moveFunction) {
            moveFunction(player)
        }

    }

    function checkBomb(playerId) {
        const player = state.players[playerId]

        for (const bombId in state.bombs) {
            const bomb = state.bombs[bombId]
            console.log(`Checking ${playerId} and ${bombId}`)

            if (Math.abs(player.x - bomb.x) <= bomb.bombRange && Math.abs(player.y - bomb.y) <= bomb.bombRange) {
                console.log(`Bomb number: ${bombId} exploded near ${playerId} `)
                removeBomb({ bombId: bombId })
            }
        }
    }

    function update () {
        for (const bombId in state.bombs) {
            const bomb = state.bombs[bombId]

            if (bomb.active && bomb.timer > 0) {
                bomb.timer = bomb.timer - 1

                if (bomb.timer === 0){
                    removeBomb(bombId)
                }
            }
        }
    }

    return {
        addPlayer,
        removePlayer,
        movePlayer,
        addBomb,
        removeBomb,
        state,
        setState,
        subscribe,
        start
    }
}
