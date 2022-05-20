import { Component } from "../Component.mjs";
import { IndexOutOfRangeException } from "../Exceptions/IndexOutOfRangeException.exc.js";

export class Renderer extends Component
{
    static Color = Symbol("color");
    static Image = Symbol("image")

    constructor(canvas, width, height, x, y, holder, path=undefined)
    {
        super(holder);
        this._color = "#00000000";
        this._path = path;
        this._using = Renderer.Color;
        this._canvas = canvas;
        this._ctx = canvas.getContext("2d");
        this._height = height;
        this._width = width;
        this._x = x;
        this._y = y;
        this._image;
        this._drawing = document.createElement("canvas");
        this._drawing.width = width;
        this._drawing.height = height;
    }
    get color(){return this._color;}
    set color(color){this._color = color;}
    get path(){return this._path;}
    set path(path){this._path = path;}

    async __Start__()
    {
        // check for color and image path
        // path has priority over color
        if(this._path)
        {
            this._color = null;
            this._using = Renderer.Image;

            //load the image
            this._image = await loadImage(this._path);
        }
    }

    Render(offsetX, offsetY)
    {
        if(this._using == Renderer.Color)
        {
            
            this._ctx.drawImage(this._drawing, this._x + offsetX, this._y + offsetY);

        }
        else if(this.using == Renderer.Image)
        {
            this._ctx.drawImage(this._image, this._x + offsetX, this._y + offsetY);
        }
        else
        {
            throw new Error("What the hell??");
        }
    }

    __Update__()
    {
        this._x = this._holder.x;
        this._y = this._holder.y;
    }

    SetPixel(color, x, y)
    {
        if(x > this._width || x < 0) throw new IndexOutOfRangeException("x must be within the width");
        if(y > this._height || x < 0) throw new IndexOutOfRangeException("y must be within the height");

        const ctx = this._drawing.getContext("2d");
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
    }

    SetPixels(color, x, y, width, height)
    {
        if(x > this._width || x < 0) throw new IndexOutOfRangeException("x must be within the width");
        if(y > this._height || x < 0) throw new IndexOutOfRangeException("y must be within the height");
        if(width > this._width || width < 0) throw new IndexOutOfRangeException("x must be within the width");
        if(height > this._height || height < 0) throw new IndexOutOfRangeException("y must be within the height");

        const ctx = this._drawing.getContext("2d");
        ctx.fillStyle = color;
        ctx.fillRect(x, y, width, height);
    }
}

function loadImage(url) {
    return new Promise(r => { let i = new Image(); i.onload = (() => r(i)); i.src = url; });
}