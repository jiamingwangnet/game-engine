import { Component } from "../Component.mjs";
import { Vector } from "../Vector.mjs";
import { BoxCollider } from "./BoxCollider.cmp.mjs";
import { Physics } from "./Physics.cmp.mjs";

export class Movement extends Component {
    constructor(holder, speed, jump, keybinds = {JUMP: "w" , LEFT: "a", RIGHT: "d"}) {
        super(holder);
        this._speed = speed;
        this._jump = jump;
        this._moveVector = new Vector(0,0);
        this._keybinds = keybinds;
    }

    __Start__() {

    }

    _Move(vector)
    {
        const movementX = new Vector(vector.x * this._speed, 0);
        this.holder.GetComponent(Physics).QueueVelocity(movementX); // walking is instantaneous force

        this.holder.GetComponent(Physics).baseVelocity.Add(new Vector(0, vector.y * this._jump)); // jump is added as a continuous force
    }

    __Update__() {
        const groundCheck = this._holder.GetComponent(BoxCollider).CollideAll();

        if (this._holder._game.keystrokes[this._keybinds.JUMP] && !(Math.abs(this.holder.GetComponent(Physics).baseVelocity.y) > 0) && groundCheck.bottom) {           
            this._moveVector.y = -1;
        }
        else {
            this._moveVector.y = 0;
        }

        if (this._holder._game.keystrokes[this._keybinds.RIGHT]) {
            this._moveVector.x = 1;
        }
        else if (this._holder._game.keystrokes[this._keybinds.LEFT]) {
            this._moveVector.x = -1;
        }
        else {
            this._moveVector.x = 0;
        }

        this._Move(this._moveVector);
    }
}