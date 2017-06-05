import Game from "./Game.js";

function play() {
    const game = new Game(document.getElementById("app"));
    window.game = game;

    game.play()
        .catch(err => console.log(err));
}

play();