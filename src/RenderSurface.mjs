import { IndexOutOfRangeException } from "./Exceptions/IndexOutOfRangeException.exc";

export class RenderSurface
{
    constructor(width, height)
    {
        this._surface = document.createElement("canvas"); // the rendered image will first be drawn to a separate canvas for more editing control on the image
        this._surface.width = width;
        this._surface.height = height;
    }

    get surface(){return this._surface;}

    Embed(surface, x, y)
    {
        const ctx = this._surface.getContext("2d");
        ctx.drawImage(surface.surface, x, y);
    }

    EmbedImage(image, x, y)
    {
        const ctx = this._surface.getContext("2d");
        ctx.drawImage(image, x, y);
    }

    SetPixel(color, x, y)
    {
        if(x > this._drawing.width || x < 0) throw new IndexOutOfRangeException("x must be within the width"); // try changing this for an assert
        if(y > this._drawing.height || x < 0) throw new IndexOutOfRangeException("y must be within the height");

        const ctx = this._surface.getContext("2d");
        ctx.fillStyle = color.colorRGB;
        ctx.fillRect(x, y, 1, 1);
    }

    SetPixels(color, x, y, width, height)
    {
        if(x > this._drawing.width || x < 0) throw new IndexOutOfRangeException("x must be within the width");
        if(y > this._drawing.height || x < 0) throw new IndexOutOfRangeException("y must be within the height");
        if(width > this._drawing.width || width < 0) throw new IndexOutOfRangeException("x must be within the width");
        if(height > this._drawing.height || height < 0) throw new IndexOutOfRangeException("y must be within the height");

        const ctx = this._drawing.getContext("2d");
        ctx.fillStyle = color.colorRGB;
        ctx.fillRect(x, y, width, height);
    }
}