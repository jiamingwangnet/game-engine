import { Component } from "../Component.mjs";
import { IndexOutOfRangeException } from "../Exceptions/IndexOutOfRangeException.exc.js";
import { Vector } from "../Vector.mjs";
import { Color } from "../Color.mjs";
import { RenderSurface } from "../RenderSurface.mjs";
import { Camera } from "../Camera.mjs";

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
    /**
     * Renderer constructor
     * @param {Camera} camera - the canvas to draw to
     * @param {number} width - the width of the image to render
     * @param {number} height - the height of the image to render
     * @param {number} x - the x offset of the rendered image
     * @param {number} y - the y offset of the rendered image
     * @param {GameObject} holder - the game object that this renderer is attached to
     */
    constructor(camera, width, height, x, y, holder)
    {
        super(holder);
        this._camera = camera;
        this._position = new Vector(x, y);
        this._drawing = new RenderSurface(x, y, width, height); 
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

    get width(){return this._drawing.width;}
    set width(width){this._drawing.width = width;}

    get height(){return this._drawing.height;}
    set height(height){this._drawing.height = height;}

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

        this._camera.currentFrame.Embed(this._drawing, renderPos.x + offsetX, renderPos.y + offsetY);

        this._oldPos = new Vector(this._position.x, this._position.y);
    }

    async PutImage(path, x, y)
    {
        this._image = await loadImage(path);
        this._drawing.EmbedImage(this._image, x, y);
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
        this._drawing.SetPixel(color, x, y);
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
        this._drawing.SetPixels(color, x, y, width, height);
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