import { GameObject } from "../../src/GameObject.mjs";
import { Physics } from "../../src/Components/Physics.cmp.mjs";
import { BoxCollider } from "../../src/Components/BoxCollider.cmp.mjs";
import { Movement } from "../../src/Components/Movement.cmp.mjs";

export class Player extends GameObject
{
    constructor(x, y, game, name)
    {
        super(x, y, 50, 100, game, name);
    }

    __Start__()
    {  
        this._renderer.SetPixels("#FFFFFF", 0, 0, this._width, this._height);
        this._renderer.SetPixels("#000000", 10, 10, 10, 10);
        this._renderer.SetPixels("#000000", 30, 10, 10, 10);
        this._renderer.SetPixels("#000000", 5, 30, 40, 5);
        
        this.AddComponent(new Physics(this, this._game));
        this.AddComponent(new BoxCollider(this.width, this.height, this, this._game, this.GetComponent(Physics)));
        this.AddComponent(new Movement(this, 5, 7));
    }

    __Render__()
    {

    }

    __Update__()
    {
        
    }
}