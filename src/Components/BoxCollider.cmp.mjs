import { Component } from "../Component.mjs";
import { Vector } from "../Vector.mjs";
import { Physics } from "./Physics.cmp.mjs";
import { Game } from "../Game.mjs";

/**
 * The BoxCollider class. It handles game collisions.
 * @class BoxCollider
 * @extends Component
 * @example
 * const collider = new BoxCollider(34, 23, gameObject, game);
 * gameObject.AddComponent(collider);
 * collider.Collide(gameObject2);
 */
export class BoxCollider extends Component {
    /**
     * The BoxCollider constructor
     * @param {number} width - the width of the collider
     * @param {number} height - the height of the collider
     * @param {GameObject} holder - the gameObject the collider is attached to
     * @param {Game} game - the game the collider is in
     * @param {Physics} physics - the physics component attached to the gameObject if it has one
     * @param {number} xOffset - the xOffset of the collider
     * @param {number} yOffset - the yOffset of the collider
     * @memberof BoxCollider
     */
    constructor(width, height, holder, game, physics = null, xOffset = 0, yOffset = 0) {
        super(holder);
        this._width = width;
        this._height = height;
        this._offset = new Vector(xOffset, yOffset);
        this._game = game;
        this._physics = physics;
    }

    /**
     * The physics component attached to the gameObject
     * @type {Physics}
     * @memberof BoxCollider
     * @readonly
     * @example
     * const collider = gameObject.GetComponent(BoxCollider);
     * collider.physics.velocity.x = 100;
     */
    get physics(){return this._physics;}

    get width() {return this._width;}
    set width(width) {this._width = width;}

    get height() {return this._height;}
    set height(height) {this._height = height;}


    /**
     * Unused
     * @memberof BoxCollider
     */
    __Start__() {

    }

    /**
     * Updates the collider
     * @memberof BoxCollider
     * @memberof BoxCollider
     */
    __Update__() {
        if (!this._physics) return; // this edits the velocity and position of objects. Objects that are static should not be affected.
        for (const gobj of this._game.gameObjects) { // check all the gameObjects
            if (gobj == this._holder) continue; // make sure it is not itself

            const collider = gobj.GetComponent(BoxCollider);
            if (!collider) continue; // it has to have a BoxCollider

            const collisionRect = this._Collide(collider); // gets the collision data
            const hasCollided = collisionRect.collided;

            if (hasCollided) { // only do physics changes when there is a collision
                const colliderHolder = collider.holder;

                /**
                 * @typedef clipDistances
                 * @property {number} top - distance between holder's top and other collider's bottom
                 * @property {number} bottom - distance between holder's bottom and other collider's top
                 * @property {number} left - distance between holder's left and other collider's right
                 * @property {number} right - distance between holder's right and other collider's left
                 */

                const clipDistances = { // calculate the distances between the opposite sides
                    top: Math.abs((colliderHolder.position.y + colliderHolder.height) - this.holder.position.y), // distance between holder's top and other object's bottom
                    bottom: Math.abs(colliderHolder.position.y - (this.holder.position.y + this.holder.height)), // holder's bottom and object's top
                    left: Math.abs((colliderHolder.position.x + colliderHolder.width) - this.holder.position.x), // holder's left and object's right
                    right: Math.abs(colliderHolder.position.x - (this.holder.position.x + this.holder.width))    // holder's right and object's left
                }

                /*
                Sides are calculated because multiple sides can give collision at the same time
                This causes the holder to clip to the wrong positions
                */
                //             this check makes sure that left is the closest side
                if (collisionRect["left"] && (clipDistances.left < clipDistances.top && clipDistances.left < clipDistances.bottom)) {
                    if(collider.physics) // checks if the other object is a physics object
                        this.physics.Push(collider.physics); // adds velocity to the other object to push it
                    else
                        this._physics.baseVelocity.x = 0; // if not, stop the collider holder
                    this.holder.position.x = collider.holder.position.x + collider.holder.width; // clips the holder to the correct position, on the right of the other object
                }

                //                          makes sure right is the closest
                if (collisionRect["right"] && (clipDistances.right < clipDistances.top && clipDistances.right < clipDistances.bottom)) {
                    if(collider.physics)
                        this.physics.Push(collider.physics); // pushes the other object
                    else
                        this._physics.baseVelocity.x = 0;
                    this.holder.position.x = collider.holder.position.x - this.holder.width; // clips to the correct position, on the left of the other object
                }

                //                              The same comparison for the top and bottom
                if (collisionRect["bottom"] && (clipDistances.bottom < clipDistances.left && clipDistances.bottom < clipDistances.right)) {
                    this._physics.baseVelocity.y = 0; // no pushing on the y axis
                    this.holder.position.y = collider.holder.position.y - this.holder.height; // clips to the other object's top
                }

                if (collisionRect["top"] && (clipDistances.top < clipDistances.left && clipDistances.top < clipDistances.right)) {
                    this._physics.baseVelocity.y = 0;
                    this.holder.position.y = collider.holder.position.y + collider.holder.height; // clips to the other object's bottom
                }
            }

        }
    }

    /**
     * Private collision method
     * @param {BoxCollider} collider The other object
     * @private
     * @returns {_CollisionData}
     * @memberof BoxCollider
     */
    _Collide(collider) {
        const rect1 = {
            position: this.holder.position,
            width: this.width,
            height: this.height
        };
        const rect2 = {
            position: collider.holder.position,
            width: collider.width,
            height: collider.height
        };

        // repeated checks are seperated into their own variables
        const yCol = rect1.position.y < rect2.position.y + rect2.height &&
            rect1.position.y + rect1.height > rect2.position.y;
        const xCol = rect1.position.x < rect2.position.x + rect2.width &&
            rect1.position.x + rect1.width > rect2.position.x;

        // calcualte collision for each side
        const left = rect1.position.x < rect2.position.x + rect2.width &&
            rect1.position.x + rect1.width > rect2.position.x + rect2.width && yCol;

        const right = rect1.position.x + rect1.width > rect2.position.x &&
            rect1.position.x < rect2.position.x && yCol;

        const bottom = rect1.position.y + rect1.height > rect2.position.y &&
            rect1.position.y < rect2.position.y && xCol;

        const top = rect1.position.y < rect2.position.y + rect2.height &&
            rect1.position.y + rect1.height > rect2.position.y + rect2.height && xCol;

        /**
         * @typedef _CollisionData - for the private type
         * @property {boolean} collided
         * @property {boolean} left
         * @property {boolean} right
         * @property {boolean} bottom
         * @property {boolean} top
         */

        return {
            collided: left || right || bottom || top,
            left: left,
            right: right,
            bottom: bottom,
            top: top
        }
    }

    /**
     * The Collide method. It preforms collision checks on other objects with a 1px offset from the perimeter.
     * @param {BoxCollider} collider 
     * @returns {CollisionData}
     * @memberof BoxCollider
     */
    Collide(collider) {
        const rect1 = {
            position: this.holder.position,
            width: this.width,
            height: this.height
        };
        const rect2 = {
            position: collider.holder.position,
            width: collider.width,
            height: collider.height
        };

        // repeated checks are seperated into their own variables
        const xCol = rect1.position.x < rect2.position.x + rect2.width + 1 &&
        rect1.position.x + rect1.width > rect2.position.x - 1;
        const yCol =  rect1.position.y < rect2.position.y + rect2.height + 1 &&
        rect1.position.y + rect1.height > rect2.position.y - 1;

        // calcualte collision for each side
        const left = rect1.position.x < rect2.position.x + rect2.width + 1 &&
            rect1.position.x + rect1.width > rect2.position.x + rect2.width + 1 && yCol
           
        const right = rect1.position.x + rect1.width > rect2.position.x - 1 &&
            rect1.position.x < rect2.position.x - 1 && yCol

        const bottom = rect1.position.y + rect1.height > rect2.position.y - 1 &&
            rect1.position.y < rect2.position.y - 1 && xCol
            
        const top = rect1.position.y < rect2.position.y + rect2.height + 1 &&
            rect1.position.y + rect1.height > rect2.position.y + rect2.height + 1 && xCol


        // also calculate the clip distances
        const clipDistances = {
            top: Math.abs((rect2.position.y + rect2.height) - this.holder.position.y),
            bottom: Math.abs(rect2.position.y - (this.holder.position.y + this.holder.height)),
            left: Math.abs((rect2.position.x + rect2.width) - this.holder.position.x),
            right: Math.abs(rect2.position.x - (this.holder.position.x + this.holder.width))
        }

        /**
         * @typedef CollisionData - the public type
         * @property {boolean} collided
         * @property {boolean} left
         * @property {boolean} right
         * @property {boolean} bottom
         * @property {boolean} top
         * @property {clipDistances} clipDistances
         */
        return {
            collided: left || right || bottom || top,
            left: left,
            right: right,
            bottom: bottom,
            top: top,
            clipDistances: clipDistances,
        }
    }

    /**
     * Collides with all gameObjects with a collider.
     * @returns {CollisionDataAll}
     * @memberof BoxCollider
     */
    CollideAll() {
        /**
         * @typedef CollisionDataAll - including all collides
         * @property {boolean} collided
         * @property {boolean} left
         * @property {boolean} right
         * @property {boolean} bottom
         * @property {boolean} top
         * @property {clipDistances[]} clipDistances
         * @property {BoxCollider[]} collisions
         */

        /**
         * @type {CollisionDataAll}
         */
        const res = {
            collided: false,
            left: false,
            right: false,
            bottom: false,
            top: false,
            clipDistances: [],
            collisions: [] // returns all the objects that has collided
        }

        for (const gobj of this._game.gameObjects) {
            if (gobj == this._holder) continue;

            const collider = gobj.GetComponent(BoxCollider);
            if (collider) {
                const gobjRect = {
                    position: gobj.position,
                    width: collider.width,
                    height: collider.height
                };

                const clipDistances = {
                    top: Math.abs((gobjRect.position.y + gobjRect.height) - this.holder.position.y),
                    bottom: Math.abs(gobjRect.position.y - (this.holder.position.y + this.holder.height)),
                    left: Math.abs((gobjRect.position.x + gobjRect.width) - this.holder.position.x),
                    right: Math.abs(gobjRect.position.x - (this.holder.position.x + this.holder.width))
                }

                res.collided = res.collided || this.Collide(collider).collided;
                res.left = res.left || this.Collide(collider).left;
                res.right = res.right || this.Collide(collider).right;
                res.bottom = res.bottom || this.Collide(collider).bottom;
                res.top = res.top || this.Collide(collider).top;

                if (res.collided) {
                    res.clipDistances.push(clipDistances);
                    res.collisions.push(collider);
                }
            }
        }

        return res;
    }
}