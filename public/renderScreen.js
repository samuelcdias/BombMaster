export default function renderScreen(screen, game, requestAnimationFrame, currentPlayerId) {
    const context = screen.getContext('2d')
    context.fillStyle = 'white'
    context.clearRect(0, 0, game.state.screen.width, game.state.screen.height)

    for (const playerId in game.state.players) {
        const player = game.state.players[playerId]
        context.fillStyle = 'black'
        context.fillRect(player.x, player.y, 3, 3)
    }

    const currentPlayer = game.state.players[currentPlayerId]
  
    if(currentPlayer) {
        context.fillStyle = 'red'
        context.fillRect(currentPlayer.x, currentPlayer.y, 3, 3)
    }

    requestAnimationFrame(() => {
        renderScreen(screen, game, requestAnimationFrame, currentPlayerId)
    })
}
