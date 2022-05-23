import { Component } from "../Component.mjs";
import { Vector } from "../Vector.mjs";

export class Physics extends Component
{
    constructor(holder, game, mass=1, drag=0.00001, terminalVelocity=Infinity)
    {
        super(holder);
        this._gravity = 9.51;
        this._velocity = new Vector(0,0); // the velocity added by the physics component
        this._velocityQueue = [];
        this._terminalVelocity = terminalVelocity;
        this._mass = mass;
        this._drag = drag;
        this._game = game;
    }

    get gravity(){return this._gravity;}
    set gravity(gravity){this._gravity = gravity;}
    get velocity() {
        let totalVelocity = new Vector(0,0);

        totalVelocity.Add(this._velocity);
        for(const vel of this._velocityQueue)
        {
            totalVelocity.Add(vel);
        }

        return totalVelocity;
    }
    get baseVelocity(){return this._velocity;}

    __Start__()
    {
        // calculate terminal velocity
        this._terminalVelocity = Math.sqrt( (2 * this._mass * this._gravity) / (1.225 * (this._holder.width * this._holder.height) * this._drag) );
    }

    __Update__()
    {
        if(this._game.gravity) this.ApplyGravity();
        let totalVelocity = new Vector(0,0);

        totalVelocity.Add(this._velocity);
        for(const vel of this._velocityQueue)
        {
            totalVelocity.Add(vel);
        }
        this._velocityQueue = [];

        this._holder.position.x += totalVelocity.x;
        this._holder.position.y += totalVelocity.y;
    }

    ApplyGravity()
    {
        if(this._velocity.y < this._terminalVelocity)
            this._velocity.y += this._gravity/60 * this._game.deltaTime;
        else
            this._velocity.y = this._terminalVelocity;
    }

    AddVelocity(x, y)
    {
        this._velocity.x += x;
        this._velocity.y += y;
    }

    QueueVelocity(vector)
    {
        this._velocityQueue.push(vector);
    }
}