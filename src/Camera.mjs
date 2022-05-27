import { GameObject } from "./GameObject.mjs";
import { Vector } from "./Vector.mjs";

/**
 * The camera class. It is used to follow the player around the map and to render the map.
 * @class Camera
 */
export class Camera
{
    /**
     * The camera constructor.
     * @param {HTMLCanvasELement} canvas - The canvas to render to
     * @param {string} background - The default background color
     * @param {Game} game - The game that this camera is attached to
     * @param {number} x - The x position of the camera
     * @param {number} y - The y position of the camera
     * @param {GameObject} follow - The object to follow
     */
    constructor(canvas, background, game, x=0, y=0, follow=null)
    {
        this._background = background;
        this._canvas = canvas;
        this._ctx = canvas.getContext("2d");
        this._position = new Vector(x, y);
        this._follow = follow;
        this._game = game;
    }
    //#region getters and setters

    /**
     * Which gameObject is being followed by the camera
     * @type {GameObject}
     * @memberof Camera
     * @example
     * camera.follow = gameObject;
     * console.log(camera.follow); // gameObject
     */
    get follow(){return this._follow;}
    set follow(follow){this._follow = follow;}

    /**
     * The camera's position
     * @type {Vector}
     * @memberof Camera
     * @example
     * camera.position = new Vector(0, 0);
     * console.log(camera.position); // Vector(0, 0)
     */
    get position(){return this._position;}
    set position(position){this._position = position;}
    //#endregion

    /**
     * Renders the map
     * @param {GameObject} renderList - The list of game objects to render
     * @param {number} lagOffset - The offset to apply to the lag
     * @memberof Camera
     */
    Render(renderList, lagOffset)
    {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height); // clears the screen

        // draws the background
        this._ctx.fillStyle = this._background;
        this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
        
        for(const object of renderList)
        {
            if(this._game.IsInFrameX(object)) // make sure the object is in the frame on the x axis
            {
                object.Render(this._position.x, this._position.y, lagOffset);
            }
        }
    }

    /**
     * Updates the camera
     * @memberof Camera
     */
    Update()
    {
        if(this._follow)
        {   
            // if the camera is following an object then move the camera to the object
            this._position.x = -this._follow.position.x + this._canvas.width / 2;
            this._position.y = -this._follow.position.y + this._canvas.height / 2;
        }
    }
}