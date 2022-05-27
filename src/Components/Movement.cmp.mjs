import { Component } from "../Component.mjs";
import { Vector } from "../Vector.mjs";
import { BoxCollider } from "./BoxCollider.cmp.mjs";
import { Physics } from "./Physics.cmp.mjs";
import { GameObject } from "../GameObject.mjs";

/**
 * A prebuilt movement manager.
 * @class Movement
 * @extends Component
 * @example
 * const player = new GameObject(...args);
 * player.AddComponent(new Movement(...args));
 */
export class Movement extends Component {
    /**
     * @typedef keybinds
     * @property {string} JUMP
     * @property {string} LEFT
     * @property {string} RIGHT
     */
    /**
     * The movement constructor.
     * @param {GameObject} holder - the gameObject this is attached to 
     * @param {number} speed - the speed of the object
     * @param {number} jump - the jump force of the object
     * @param {keybinds} keybinds - the keybinds for controls
     * @memberof Movement
     */
    constructor(holder, speed, jump, keybinds = {JUMP: "w" , LEFT: "a", RIGHT: "d"}) {
        super(holder);
        this._speed = speed;
        this._jump = jump;
        this._moveVector = new Vector(0,0);
        this._keybinds = keybinds;
    }

    /**
     * @override
     */
    __Start__() {

    }

    /**
     * Private Move method
     * @param {Vector} vector The movement vector
     * @private
     * @memberof Movement
     */
    _Move(vector)
    {
        const movementX = new Vector(vector.x * this._speed, 0); // TODO: try multiplying this with deltaTime, game is not frame independent yet
        this.holder.GetComponent(Physics).QueueVelocity(movementX); // walking is instantaneous force added by QueueVelocity

        this.holder.GetComponent(Physics).baseVelocity.Add(new Vector(0, vector.y * this._jump )); // jump is added as a continuous force
    }

    /**
     * Update function
     * @memberof Movement
     * @override
     */
    __Update__() {
        const groundCheck = this._holder.GetComponent(BoxCollider).CollideAll();

        // generates the movement vector using keyboard input
        //                                                                 does a ground check by checking bottom collision and if y velocity is 0
        if (this._holder._game.input.GetKeyDown(this._keybinds.JUMP) && this.holder.GetComponent(Physics).baseVelocity.y == 0 && groundCheck.bottom) {           
            this._moveVector.y = -1;
        }
        else {
            this._moveVector.y = 0;
        }

        if (this._holder._game.input.GetKeyDown(this._keybinds.RIGHT)) {
            this._moveVector.x = 1;
        }
        else if (this._holder._game.input.GetKeyDown(this._keybinds.LEFT)) {
            this._moveVector.x = -1;
        }
        else {
            this._moveVector.x = 0;
        }

        this._Move(this._moveVector);
    }
}