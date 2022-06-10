import { Component } from "../Component.mjs";
import { IndexOutOfRangeException } from "../Exceptions/IndexOutOfRangeException.exc.js";
import { Vector } from "../Vector.mjs";
import { Color } from "../Color.mjs";

/**
 * A component for handling rendering
 * @class Renderer
 * @extends Component
 * @example
 * const player = new GameObject(...args);
 * player.AddComponent(new Renderer(...args));
 * player.GetComponent(Renderer).imagePath = "./assets/player.png";
 */
export class Renderer extends Component
{
    // enum for the different types of renderers
    static Color = Symbol("color");
    static Image = Symbol("image")

    /**
     * Renderer constructor
     * @param {HTMLCanvasElement} canvas - the canvas to draw to
     * @param {number} width - the width of the image to render
     * @param {number} height - the height of the image to render
     * @param {number} x - the x offset of the rendered image
     * @param {number} y - the y offset of the rendered image
     * @param {GameObject} holder - the game object that this renderer is attached to
     * @param {string} imagePath - the path to the image to render
     */
    constructor(canvas, width, height, x, y, holder, imagePath=undefined)
    {
        super(holder);
        this._color = new Color(0, 0, 0, 0); // default color
        this._imagePath = imagePath;
        this._using = Renderer.Color; // default to color mode
        this._canvas = canvas;
        this._ctx = canvas.getContext("2d");
        this._height = height;
        this._width = width;
        this._position = new Vector(x, y);
        this._image; // the image on the separate canvas, not the image path
        this._drawing = document.createElement("canvas"); // the rendered image will first be drawn to a separate canvas for more editing control on the image
        this._drawing.width = width;
        this._drawing.height = height;
        this._oldPos = new Vector(x, y);
        this._interpolate = false; // interpolation using the old position (test feature)
    }

    /**
     * The color of the renderer
     * @type {Color}
     * @memberof Renderer
     * @example
     * const player = new GameObject(...args);
     * player.AddComponent(new Renderer(...args));
     * player.GetComponent(Renderer).color = "#FF0000";
     */
    get color(){return this._color;}
    set color(color){this._color = color;}

    /**
     * Path to the image to render
     * @type {string}
     * @memberof Renderer
     * @example
     * const player = new GameObject(...args);
     * player.AddComponent(new Renderer(...args));
     * player.GetComponent(Renderer).imagePath = "./assets/player.png";
     */
    get imagePath(){return this._imagePath;}
    set imagePath(imagePath){
        this._imagePath = imagePath;
        this._UpdateImage();
    }

    get width(){return this._drawing.width;}
    set width(width){this._drawing.width = width;}

    get height(){return this._drawing.height;}
    set height(height){this._drawing.height = height;}

    /**
     * Updates and reloads the image
     * @memberof Renderer
     * @async
     * @private
     */
    async _UpdateImage()
    {
        this._color = null;
        this._using = Renderer.Image;

        //load the image
        this._image = await loadImage(this._imagePath);
    }

    /**
     * Initializes the component and loads image
     * @memberof Renderer
     * @async
     * @override
     */
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

    /**
     * Renders the image
     * @memberof Renderer
     * @param {number} offsetX - the x offset of the rendered image
     * @param {number} offsetY - the y offset of the rendered image
     * @param {number} lagOffset - used by the interpolation feature
     */
    Render(offsetX, offsetY, lagOffset)
    {
        const renderPos = this._interpolate ? new Vector( (this._position.x - this._oldPos.x) * lagOffset + this._oldPos.x, (this._position.y - this._oldPos.y) * lagOffset + this._oldPos.y ) :
                            this._position; // interpolate the position if the interpolate flag is set
        switch(this._using)
        {
            case Renderer.Color:
                this._ctx.drawImage(this._drawing, renderPos.x + offsetX, renderPos.y + offsetY);
                break;
            case Renderer.Image:
                this._RenderImage(offsetX, offsetY, lagOffset);
                break;
            default:
                throw new Error("Renderer mode is not valid type");
        }

        this._oldPos = new Vector(this._position.x, this._position.y);
    }

    /**
     * Renders the image from the image path
     * @memberof Renderer
     * @param {number} offsetX - the x offset of the rendered image
     * @param {number} offsetY - the y offset of the rendered image
     * @param {number} lagOffset - used by the interpolation feature
     * @private
     * @async
     */
    async _RenderImage(offsetX, offsetY, lagOffset)
    {
        if(!this._image) // load the image first
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

    /**
     * Updates the image position
     * @memberof Renderer
     */
    __Update__()
    {
        this._position.x = this._holder.position.x;
        this._position.y = this._holder.position.y;
    }

    /**
     * Sets a pixel to the color on the image
     * @memberof Renderer
     * @param {Color} color - the color to set the pixel to
     * @param {number} x - the x position of the pixel
     * @param {number} y - the y position of the pixel
     * @example
     * const player = new GameObject(...args);
     * player.AddComponent(new Renderer(...args));
     * player.GetComponent(Renderer).SetPixel("#FF0000", 10, 10);
     * player.GetComponent(Renderer).SetPixel("red", 10, 10);
     * player.GetComponent(Renderer).SetPixel("rgb(255, 0, 0)", 10, 10);
     */
    SetPixel(color, x, y)
    {
        if(x > this._drawing.width || x < 0) throw new IndexOutOfRangeException("x must be within the width"); // try changing this for an assert
        if(y > this._drawing.height || x < 0) throw new IndexOutOfRangeException("y must be within the height");

        const ctx = this._drawing.getContext("2d");
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
     * @example
     * const player = new GameObject(...args);
     * player.AddComponent(new Renderer(...args));
     * player.GetComponent(Renderer).SetPixels("#FF0000", 10, 10, 10, 10);
     * player.GetComponent(Renderer).SetPixels("red", 10, 10, 10, 10);
     * player.GetComponent(Renderer).SetPixels("rgb(255, 0, 0)", 10, 10, 10, 10);
     */
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

/**
 * Image loader
 * @param {string} url - the url of the image to load
 * @returns {Promise<Image>} - a promise that resolves to the image
 */
function loadImage(url) {
    return new Promise(r => { let i = new Image(); i.onload = (() => r(i)); i.src = url; });
}