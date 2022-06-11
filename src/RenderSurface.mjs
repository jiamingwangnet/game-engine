import { IndexOutOfRangeException } from "./Exceptions/IndexOutOfRangeException.exc.js";
import { Color } from "./Color.mjs";

export class RenderSurface
{
    constructor(x, y, width, height)
    {
        this._surface = document.createElement("canvas"); // the rendered image will first be drawn to a separate canvas for more editing control on the image
        this._surface.width = width;
        this._surface.height = height;
        this._x = x;
        this._y = y;
    }

    get surface(){return this._surface;}
    get x(){return this._x;}
    get y(){return this._y;}
    set x(x){this._x = x;}
    set y(y){this._y = y;}

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

     /**
     * Sets a pixel to the color on the image
     * @memberof Renderer
     * @param {Color} color - the color to set the pixel to
     * @param {number} x - the x position of the pixel
     * @param {number} y - the y position of the pixel
     * @example
     */
    SetPixel(color, x, y)
    {
        if(x > this._surface.width || x < 0) throw new IndexOutOfRangeException("x must be within the width"); // try changing this for an assert
        if(y > this._surface.height || x < 0) throw new IndexOutOfRangeException("y must be within the height");

        const ctx = this._surface.getContext("2d");
        ctx.fillStyle = color.colorRGB;
        ctx.fillRect(x, y, 1, 1);
    }


    /**
     * Sets multiple pixel colors using width and height
     * @param {Color} color - the color to set the pixels to
     * @param {number} x - the x position of the pixel
     * @param {number} y - the y position of the pixel
     * @param {number} width - the width of the pixels
     * @param {number} height - the height of the pixels
     * @memberof Renderer
     */
    SetPixels(color, x, y, width, height)
    {
        if(x > this._surface.width || x < 0) throw new IndexOutOfRangeException("x must be within the width");
        if(y > this._surface.height || x < 0) throw new IndexOutOfRangeException("y must be within the height");
        if(width > this._surface.width || width < 0) throw new IndexOutOfRangeException("x must be within the width");
        if(height > this._surface.height || height < 0) throw new IndexOutOfRangeException("y must be within the height");

        const ctx = this._surface.getContext("2d");
        ctx.fillStyle = color.colorRGB;
        ctx.fillRect(x, y, width, height);
    }

    GetPixel(x, y)
    {
        if(x > this._surface.width || x < 0) throw new IndexOutOfRangeException("x must be within the width");
        if(y > this._surface.height || x < 0) throw new IndexOutOfRangeException("y must be within the height");

        const ctx = this._surface.getContext("2d");
        const pixel = ctx.getImageData(x, y, 1, 1);
        return new Color(pixel.data[0], pixel.data[1], pixel.data[2], pixel.data[3]);
    }
}