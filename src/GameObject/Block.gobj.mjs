import { BoxCollider } from "../Components/BoxCollider.cmp.mjs";
import { Physics } from "../Components/Physics.cmp.mjs";
import { GameObject } from "../GameObject.mjs";
import { Game } from "../Game.mjs";

/**
 * Pre-made block object
 * @class Block
 * @extends GameObject
 * @example
 * const block = new Block(...args);
 * block.position.x = 10;
 */
export class Block extends GameObject
{
    /**
     * Block constructor
     * @param {number} x - the x position of the block
     * @param {number} y - the y position of the block
     * @param {number} width - the width of the block
     * @param {number} height - the height of the block
     * @param {string} color - the color of the block
     * @param {Game} game - the game that the block belongs to
     * @param {string} name - the name of the block
     * @param {string} image - the image of the block, if not using a color
     */
    constructor(x, y, width, height, color, game, name, image=undefined)
    {
        super(x, y, width, height, game, name);
        this._color = color;
        this._image = image;
    }

    /**
     * Initializes the block
     * @memberof Block
     * @override
     */
    __Start__() {
        if(this._image)
            this.renderer.imagePath = this._image; // initialize the image path
        else
            this.renderer.SetPixels(this._color, 0, 0, this._width, this._height); // if there is no image, fill the whole block with the color

        this.AddComponent(new BoxCollider(this.width, this.height, this, this._game, this.GetComponent(Physics))); // adds a collider
    }

    /**
     * Render cycle
     * @memberof Block
     * @override
     */
    __Render__() {

    }

    /**
     * Update cycle
     * @memberof Block
     * @override
     */
    __Update__() {

    }
}