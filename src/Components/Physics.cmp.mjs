import { Component } from "../Component.mjs";
import { Vector } from "../Vector.mjs";
import { BoxCollider } from "./BoxCollider.cmp.mjs";
import { GameObject } from "../GameObject.mjs";
import { Game } from "../Game.mjs";

/**
 * A component for handling physics
 * @class Physics
 * @extends Component
 * @example
 * const player = new GameObject(...args);
 * player.AddComponent(new Physics(...args));
 */
export class Physics extends Component
{
    /**
     * Physics constructor
     * @param {GameObject} holder - the gameObject this is attached to
     * @param {Game} game - the game this component is in
     * @param {number} mass - the mass of the object
     * @param {boolean} pushable - whether the object can be pushed
     * @param {number} drag - the drag of the object
     * @param {number} terminalVelocity - the terminal velocity of the object
     * @memberof Physics
     */
    constructor(holder, game, mass=1, pushable=true, drag=0.00001, terminalVelocity=Infinity)
    {
        super(holder);
        this._gravity = 9.51;
        this._velocity = new Vector(0,0); // the velocity added by the physics component
        this._velocityQueue = [];
        this._terminalVelocitySqr = terminalVelocity*terminalVelocity;
        this._mass = mass;
        this._drag = drag;
        this._game = game;
        this._lastQueue = [];
        this._moveFactor = 0.5;
        this._pushable = pushable;
    }

    /**
     * The object's gravity.
     * @type {number}
     * @memberof Physics
     * @example
     * const player = new GameObject(...args);
     * player.AddComponent(new Physics(...args));
     * player.GetComponent(Physics).gravity = 9.51;
     */
    get gravity(){return this._gravity;}
    set gravity(gravity){this._gravity = gravity;}

    /**
     * The total velocity of the object.
     * @type {Vector}
     * @memberof Physics
     * @readonly
     * @example
     * const player = new GameObject(...args);
     * player.AddComponent(new Physics(...args));
     * console.log(player.GetComponent(Physics).velocity); // Vector(0,0)
     */
    get velocity() {
        let totalVelocity = new Vector(0,0);

        totalVelocity.Add(this._velocity);
        for(const vel of this._velocityQueue)
        {
            totalVelocity.Add(vel);
        }

        return totalVelocity;
    }

    /**
     * The velocity of the object with only velocities applied by the physics component.
     * @type {Vector}
     * @memberof Physics
     * @example
     * const player = new GameObject(...args);
     * player.AddComponent(new Physics(...args));
     * console.log(player.GetComponent(Physics).baseVelocity); // Vector(0,0)
     */
    get baseVelocity(){return this._velocity;}

    /**
     * The mass of the object.
     * @type {number}
     * @memberof Physics
     * @readonly
     * @example
     * const player = new GameObject(...args);
     * player.AddComponent(new Physics(...args));
     * player.GetComponent(Physics).mass = 1;
     */
    get mass(){return this._mass;}

    /**
     * Whether the object can be pushed.
     * @type {boolean}
     * @memberof Physics
     * @readonly
     * @example
     * const player = new GameObject(...args);
     * player.AddComponent(new Physics(...args));
     * player.GetComponent(Physics).pushable = true;
     */
    get pushable(){return this._pushable;}

    /**
     * Initializes the component
     * @memberof Physics
     * @override
     */
    __Start__()
    {
        // calculate terminal velocity
        this._terminalVelocitySqr = (2 * this._mass * this._gravity) / (1.225 * (this._holder.width * this._holder.height) * this._drag);
    }

    /**
     * Updates the object's velocity
     * @memberof Physics
     * @override
     */
    __Update__()
    {
        if(this._game.useGravity) this.ApplyGravity();
        let totalVelocity = new Vector(0,0); // the total velocity of the object including the queue

        totalVelocity.Add(this._velocity);
        for(const vel of this._velocityQueue)
        {
            totalVelocity.Add(vel); // add up all the velocity in the queue
        }
        this._lastQueue = this._velocityQueue; // save the last queue
        this._velocityQueue = [];

        // applies the velocity to the object
        this._holder.position.x += totalVelocity.x;
        this._holder.position.y += totalVelocity.y;
    }

    /**
     * Applies gravity to the object
     * @memberof Physics
     */
    ApplyGravity()
    {
        if(this._velocity.y*this._velocity.y < this._terminalVelocitySqr) // if the velocity is less than the terminal velocity
            // TODO: change 60 to be the actual framerate
            this._velocity.y += this._gravity/60; // 60 is the framerate
        else
            this._velocity.y = Math.sqrt(this._terminalVelocity); // set the velocity to the terminal velocity
    }

    /**
     * Applies a push force to the object
     * @param {Physics} objectPhysics - the physics component of the object to be pushed
     * @memberof Physics
     * @example
     * const player = new GameObject(...args);
     * player.AddComponent(new Physics(...args));
     * const object = new GameObject(...args);
     * object.AddComponent(new Physics(...args));
     * player.GetComponent(Physics).Push(object.GetComponent(Physics));
     */
    Push(objectPhysics)
    {
        if(objectPhysics.pushable) // calculate the push force
            objectPhysics.QueueVelocity(new Vector(this._lastQueue[0] ? this._lastQueue[0].x * this. _moveFactor / objectPhysics.mass : 0, 0));
    }

    /**
     * Adds base velocity to the object
     * @param {number} x - the x velocity
     * @param {number} y - the y velocity
     * @memberof Physics
     * @example
     * const player = new GameObject(...args);
     * player.AddComponent(new Physics(...args));
     * player.GetComponent(Physics).AddVelocity(0, -10);
     */
    AddVelocity(x, y)
    {
        this._velocity.x += x;
        this._velocity.y += y;
    }

    /**
     * Queues an intantaneous force to the object.
     * @param {Vector} vector - the force vector to be added to the velocity queue
     * @memberof Physics
     * @example
     * const player = new GameObject(...args);
     * player.AddComponent(new Physics(...args));
     * player.GetComponent(Physics).QueueVelocity(new Vector(1,2));
     */
    QueueVelocity(vector)
    {
        this._velocityQueue.push(vector);
    }
}