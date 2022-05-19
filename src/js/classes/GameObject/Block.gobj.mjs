import { BoxCollider } from "../Components/BoxCollider.cmp.mjs";
import { GameObject } from "../GameObject.mjs";

export class Block extends GameObject
{
    constructor(x, y, width, height, color, game, name)
    {
        super(x, y, width, height, game, name);
        this._color = color;
    }

    __Start__() {
        this.renderer.SetPixels(this._color, 0, 0, this._width, this._height);

        this.AddComponent(new BoxCollider(this.width, this.height, this, this._game));
    }

    __Render__() {

    }

    __Update__() {

    }
}