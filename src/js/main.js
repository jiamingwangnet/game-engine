import { BoxCollider } from "./classes/Components/BoxCollider.cmp.mjs";
import { Physics } from "./classes/Components/Physics.cmp.mjs";
import { Game } from "./classes/Game.mjs";
import { Block } from "./classes/GameObject/Block.gobj.mjs";
import { Player } from "./classes/GameObject/Player.gobj.mjs";
import { Vector } from "./classes/Vector.mjs";

const canvas = document.querySelector("#c");
const game = new Game(canvas, 120, "#000000");

game.__Load__ = () => {
    
}

game.__EarlyLoad__ = () => {
    const player = new Player(10, 10, game, "player");
    game.AddGameObject(player);

    const floor = new Block(0, window.innerHeight - 40, window.innerWidth, 50, "#096e00", game, "floor");
    game.AddGameObject(floor);

    const wall = new Block(350, window.innerHeight-220, 20, 200, "gray", game, "wall");
    game.AddGameObject(wall);

    const wall2 = new Block(330, window.innerHeight-170, 20, 150, "gray", game, "wall2");
    game.AddGameObject(wall2);

    const wall3 = new Block(310, window.innerHeight-120, 20, 100, "gray", game, "wall3");
    game.AddGameObject(wall3);

    const higherFloor = new Block(1100, window.innerHeight-220, 500, 200, "blue", game, "higherFloor")
    game.AddGameObject(higherFloor);

    const roof = new Block(450, window.innerHeight-210, 1000, 10, "brown", game, "roof");
    game.AddGameObject(roof);
}

game.__Render__ = () => {
    
}

game.__Update__ = () => {
    const player = game.GetObject("player");
    const floor = game.GetObject("floor");
}

game.MainLoop();

// console debug purposes
window.game = game;
window.Vector = Vector;
window.Physics = Physics;
window.BoxCollider = BoxCollider;