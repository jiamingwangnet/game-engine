import { Component } from "../Component.mjs";
import { IndexOutOfRangeException } from "../Exceptions/IndexOutOfRangeException.exc.js";
import { Vector } from "../Vector.mjs";

export class Renderer extends Component
{
    static Color = Symbol("color");
    static Image = Symbol("image")

    constructor(canvas, width, height, x, y, holder, imagePath=undefined)
    {
        super(holder);
        this._color = "#00000000";
        this._imagePath = imagePath;
        this._using = Renderer.Color;
        this._canvas = canvas;
        this._ctx = canvas.getContext("2d");
        this._height = height;
        this._width = width;
        this._position = new Vector(x, y);
        this._image;
        this._drawing = document.createElement("canvas");
        this._drawing.width = width;
        this._drawing.height = height;
        this._oldPos = new Vector(x, y);
        this._interpolate = false;
    }
    get color(){return this._color;}
    set color(color){this._color = color;}
    get imagePath(){return this._imagePath;}
    set imagePath(imagePath){
        this._imagePath = imagePath;
        this._UpdateImage();
    }

    async _UpdateImage()
    {
        this._color = null;
        this._using = Renderer.Image;

        //load the image
        this._image = await loadImage(this._imagePath);
    }

    async __Start__()
    {
        // check for color and image path
        // path has priority over color
        if(this._imagePath)
        {
            this._color = null;
            this._using = Renderer.Image;

            //load the image
            this._image = await loadImage(this._imagePath);
        }
    }

    Render(offsetX, offsetY, lagOffset)
    {
        const renderPos = this._interpolate ? new Vector( (this._position.x - this._oldPos.x) * lagOffset + this._oldPos.x, (this._position.y - this._oldPos.y) * lagOffset + this._oldPos.y ) :
                            this._position;

        if(this._using == Renderer.Color) 
            this._ctx.drawImage(this._drawing, renderPos.x + offsetX, renderPos.y + offsetY);
        else if(this._using == Renderer.Image)
            this._RenderImage(offsetX, offsetY, lagOffset);
        else
            throw new Error("What the hell??");

        this._oldPos = new Vector(this._position.x, this._position.y);
    }

    async _RenderImage(offsetX, offsetY, lagOffset)
    {
        if(!this._image)
        {
            this._color = null;
            this._using = Renderer.Image;

            //load the image
            this._image = await loadImage(this._imagePath);
        }
        const renderPos = this._interpolate ? new Vector( (this._position.x - this._oldPos.x) * lagOffset + this._oldPos.x, (this._position.y - this._oldPos.y) * lagOffset + this._oldPos.y ) :
        this._position;
        this._ctx.drawImage(this._image, renderPos.x + offsetX, renderPos.y + offsetY);
    }

    __Update__()
    {
        this._position.x = this._holder.position.x;
        this._position.y = this._holder.position.y;
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