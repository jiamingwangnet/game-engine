import { Vector } from "./Vector.mjs";

export class Input
{
    constructor(game)
    {
        this._keystrokes = {};
        this._buttonDown = {};
        this._game = game;
    }
    get buttonDown(){return this._buttonDown;}
    get keystrokes(){return this._keystrokes;}

    __Start__()
    {
        window.addEventListener("keydown", e => {
            this._keystrokes[e.key.toLowerCase()] = true;
        })
        window.addEventListener("keyup", e => {
            this._keystrokes[e.key.toLowerCase()] = false;
        })
        window.addEventListener("mousedown", e => {
            const params = {
                position: new Vector(e.clientX, e.clientY),
                clicked: true
            }
            this._buttonDown[e.button] = params;
        })
        window.addEventListener("mouseup", e => {
            const params = {
                position: new Vector(e.clientX, e.clientY),
                clicked: false
            }
            this._buttonDown[e.button] = params;
        })
    }

    ScreenToWorldPosition(position)
    {
        return new Vector(position.x + this._game.camera.position.x, position.y + this._game.camera.position.y);
    }

    ButtonToCode(button)
    {
        switch(button)
        {
            case 0: return "left";
            case 1: return "middle";
            case 2: return "right";
        }
    }
}