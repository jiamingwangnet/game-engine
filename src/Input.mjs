import { Vector } from "./Vector.mjs";

/**
 * The input manager
 * 
 * @class Input
 */
export class Input
{
    /**
     * Input constructor
     * @param {Game} game - The game that the input belongs to
     * @memberof Input
     */
    constructor(game)
    {
        this._keystrokes = {}; // keystrokes and buttons stored as objects for quicker access
        this._buttonDown = {};
        this._game = game;
        this._mousePosition = new Vector(0, 0);
    }
    //#region getters and setters
    // TODO: remove these and add functions for handling presses and releases.
    /**
     * Gets the list of buttons that were pressed.
     * @type {Object.<number, Object>}
     * @memberof Input
     * @readonly
     * @example
     * if (input.buttonDown[input.ButtonToCode("left")]) {
     *    console.log("left button pressed");
     * }
     */
    get buttonDown(){return this._buttonDown;}

    /**
     * The list of keystrokes.
     * @type {Object.<string, Object>}
     * @memberof Input
     * @readonly
     * @example
     * if (input.keystrokes["a"]) {
     *   console.log("a key was pressed");
     * }
     */
    get keystrokes(){return this._keystrokes;}

    /**
     * The current mouse position.
     * @type {Vector}
     * @memberof Input
     * @readonly
     * @example
     * console.log(input.mousePosition); // Vector(0, 0)
     */
    get mousePosition(){return this._mousePosition;}
    //#endregion

    /**
     * Gets called before the game runs.
     * @memberof Input
     */
    __Start__()
    {
        // disables right click context menu
        document.body.addEventListener("contextmenu", e=>{e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();});

        // handles keystrokes
        window.addEventListener("keydown", e => {
            this._keystrokes[e.key.toLowerCase()] = true;
        })
        window.addEventListener("keyup", e => {
            this._keystrokes[e.key.toLowerCase()] = false;
        })

        // handles mouse
        window.addEventListener("mousemove", e => {
            this._mousePosition = new Vector(e.clientX, e.clientY);
        })
        window.addEventListener("mousedown", e => {
            const params = {
                position: new Vector(e.clientX, e.clientY),
                clicked: true
            }
            this._buttonDown[e.button] = params;
        })
        window.addEventListener("mouseup", e => {
            const params = {
                position: new Vector(e.clientX, e.clientY),
                clicked: false
            }
            this._buttonDown[e.button] = params;
        })
    }

    /**
     * Converts the mouse screen position to a world position.
     * @param {Vector} position
     * @returns {Vector} - The world position
     * @memberof Input
     * @example
     * const worldPos = input.ScreenToWorld(new Vector(event.clientX, event.clientY));
     */
    ScreenToWorldPosition(position)
    {
        return new Vector(position.x - this._game.camera.position.x, position.y - this._game.camera.position.y);
    }

    /**
     * Converts the button name to the button number code.
     * @param {string} button - The button name
     * @returns 0 | 1 | 2 - The button number code
     * @memberof Input
     * @example
     * const button = input.ButtonToNumber("left");
     * console.log(button); // 0
     */
    ButtonToCode(button)
    {
        switch(button)
        {
            case "left": return 0;
            case "middle": return 1;
            case "right": return 2;
        }
    }
}