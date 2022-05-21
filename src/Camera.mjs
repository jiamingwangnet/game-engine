import { Vector } from "./Vector.mjs";

export class Camera
{
    constructor(canvas, background, x=0, y=0, follow=null)
    {
        this._background = background;
        this._canvas = canvas;
        this._ctx = canvas.getContext("2d");
        this._position = new Vector(x, y);
        this._follow = follow;
    }
    get follow(){return this._follow;}
    set follow(follow){this._follow = follow;}
    get position(){return this._position;}
    set position(position){this._position = position;}

    Render(renderList)
    {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

        this._ctx.fillStyle = this._background;
        this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
        
        for(const object of renderList)
        {
            object.Render(this._position.x, this._position.y);
        }
    }

    Update()
    {
        if(this._follow)
        {
            this._position.x = -this._follow.position.x + this._canvas.width / 2;
            this._position.y = -this._follow.position.y + this._canvas.height / 2;
        }
    }
}