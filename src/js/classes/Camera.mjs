export class Camera
{
    constructor(canvas, background, x=0, y=0, follow=null)
    {
        this._background = background;
        this._canvas = canvas;
        this._ctx = canvas.getContext("2d");
        this._x = x;
        this._y = y;
        this._follow = follow;
    }
    get x(){return this._x;}
    set x(x){this._x = x;}
    get y(){return this._y;}
    set y(y){this._y = y};
    get follow(){return this._follow;}
    set follow(follow){this._follow = follow;}

    Render(renderList)
    {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

        this._ctx.fillStyle = this._background;
        this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
        
        for(const object of renderList)
        {
            object.Render(this._x, this._y);
        }
    }

    Update()
    {
        if(this._follow)
        {
            this.x = -this._follow.x + this._canvas.width / 2;
            this.y = -this._follow.y + this._canvas.height / 2;
        }
    }
}