import { BoxCollider } from "../../src/Components/BoxCollider.cmp.mjs";
import { Physics } from "../../src/Components/Physics.cmp.mjs";
import { Game } from "../../src/Game.mjs";
import { Block } from "../../src/GameObject/Block.gobj.mjs";
import { Player } from "./Player.gobj.mjs";
import { Vector } from "../../src/Vector.mjs";
import { AudioObj } from "../../src/GameObject/AudioObj.gobj.mjs";
import { LightObject } from "../../src/GameObject/LightObject.gobj.mjs";
import { Color } from "../../src/Color.mjs";

const canvas = document.querySelector("#c");
const game = new Game(canvas, 120, new Color(0,0,0,1), true);

game.__Load__ = () => {
    const player = new Player(100, 500, game, "player");
    game.AddGameObject(player);

    const floor = new Block(-10000, window.innerHeight - 40, 20000, 50, new Color(0x09, 0x6e, 0x00, 1), game, "floor");
    game.AddGameObject(floor);

    const wall = new Block(350, window.innerHeight - 220, 20, 200, new Color(0x80, 0x80, 0x80, 1), game, "wall");
    game.AddGameObject(wall);

    const wall2 = new Block(330, window.innerHeight - 170, 20, 150, new Color(0x80, 0x80, 0x80, 1), game, "wall2");
    game.AddGameObject(wall2);

    const wall3 = new Block(310, window.innerHeight - 120, 20, 100, new Color(0x80, 0x80, 0x80, 1), game, "wall3");
    game.AddGameObject(wall3);

    const wall4 = new Block(370, window.innerHeight - 170, 20, 150, new Color(0x80, 0x80, 0x80, 1), game, "wall4");
    game.AddGameObject(wall4);

    const wall5 = new Block(390, window.innerHeight - 120, 20, 100, new Color(0x80, 0x80, 0x80, 1), game, "wall5");
    game.AddGameObject(wall5);

    const higherFloor = new Block(1100, window.innerHeight - 220, 500, 200, new Color(0,0,0xff, 1), game, "higherFloor")
    game.AddGameObject(higherFloor);

    const higherFloor2 = new Block(1000, window.innerHeight - 220, 50, 50, new Color(0,0xff,0xff, 1), game, "higherFloor2")
    game.AddGameObject(higherFloor2);
    const higherFloor3 = new Block(940, window.innerHeight - 220, 50, 50, new Color(0x1e, 0x90, 0xff, 1), game, "higherFloor3")
    game.AddGameObject(higherFloor3);
    const higherFloor4 = new Block(880, window.innerHeight - 220, 50, 50, new Color(0, 0, 0x80, 1), game, "higherFloor4")
    game.AddGameObject(higherFloor4);
    const higherFloor5 = new Block(820, window.innerHeight - 220, 50, 50, new Color(0, 0x80, 0x80, 1), game, "higherFloor5")
    game.AddGameObject(higherFloor5);

    const image = new Block(700, window.innerHeight - 220, 50, 50, new Color(0,0,0,0), game, "image", "./assets/test.png");
    game.AddGameObject(image);

    const roof = new Block(450, window.innerHeight - 210, 1000, 10, new Color(0xa5, 0x2a, 0x2a, 1), game, "roof");
    game.AddGameObject(roof);

    const audio = new AudioObj("./assets/test.wav", "audio", game);
    game.AddGameObject(audio);

    const light = new LightObject(0, 0, 150, 100, new Color(255, 255, 255, 255), game, "light");
    game.AddGameObject(light);

    game.camera.follow = player;
}

game.__Render__ = () => {

}

game.__Update__ = () => {
    const player = game.GetObject("player");
    const image = game.GetObject("image");

    if (player.GetComponent(BoxCollider).Collide(image.GetComponent(BoxCollider)).collided) {
        game.GetObject("audio").Play();
    }

    if(game.input.GetButtonPress("left"))
    {
        const block = new Block(game.input.ScreenToWorldPosition(game.input.mousePosition).x, game.input.ScreenToWorldPosition(game.input.mousePosition).y, 10, 10, new Color(255, 0, 0, 1), game, "block");
        game.AddGameObject(block);
    }

    if(game.input.GetButtonDown("right"))
    {
        const x = Math.floor(Math.random() * 300);
        const y = Math.floor(Math.random() * 300);

        const w = Math.floor(Math.random() * 20) + 10;
        const h = Math.floor(Math.random() * 20) + 10;

        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);

        const block = new Block(game.input.ScreenToWorldPosition(game.input.mousePosition).x + x, game.input.ScreenToWorldPosition(game.input.mousePosition).y + y, w, h, new Color(r, g, b, 1), game, "peepee");
        game.AddGameObject(block);
    }

    if(game.input.GetButtonPress("middle"))
    {
        const physicsBlock = new Block(game.input.ScreenToWorldPosition(game.input.mousePosition).x, game.input.ScreenToWorldPosition(game.input.mousePosition).y, 30, 30, new Color(0, 255, 0, 1), game, "block");
        physicsBlock.AddComponent(new Physics(physicsBlock, game, 0.8));
        game.AddGameObject(physicsBlock);
    }

    if(game.input.GetKeyDown("f"))
    {
        const x = Math.floor(Math.random() * 300);
        const y = Math.floor(Math.random() * 300);
        const w = Math.floor(Math.random() * 20) + 10;
        const h = Math.floor(Math.random() * 20) + 10;

        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);

        const block = new Block(game.input.ScreenToWorldPosition(game.input.mousePosition).x + x, game.input.ScreenToWorldPosition(game.input.mousePosition).y + y, w, h, new Color(r, g, b, 1), game, "peepee");
        block.AddComponent(new Physics(block, game, 0.48));
        game.AddGameObject(block);
    }

    if(game.input.GetKeyPress("v"))
    {
        const light = new LightObject(game.input.ScreenToWorldPosition(game.input.mousePosition).x, game.input.ScreenToWorldPosition(game.input.mousePosition).y, 250, 200, new Color(255, 255, 255, 255), game, "light");
        game.AddGameObject(light);
    }
}

game.MainLoop();

// console debug purposes
window.game = game;
window.Vector = Vector;
window.Physics = Physics;
window.BoxCollider = BoxCollider;
window.Block = Block;
window.Player = Player;
window.Color = Color;