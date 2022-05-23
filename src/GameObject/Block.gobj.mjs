import { BoxCollider } from "../Components/BoxCollider.cmp.mjs";
import { Physics } from "../Components/Physics.cmp.mjs";
import { GameObject } from "../GameObject.mjs";

export class Block extends GameObject
{
    constructor(x, y, width, height, color, game, name, image=undefined)
    {
        super(x, y, width, height, game, name);
        this._color = color;
        this._image = image;
    }

    __Start__() {
        if(this._image)
            this.renderer.imagePath = this._image;
        else
            this.renderer.SetPixels(this._color, 0, 0, this._width, this._height);

        this.AddComponent(new BoxCollider(this.width, this.height, this, this._game, this.GetComponent(Physics)));
    }

    __Render__() {

    }

    __Update__() {

    }
}