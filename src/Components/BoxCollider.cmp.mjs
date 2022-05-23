import { Component } from "../Component.mjs";
import { Vector } from "../Vector.mjs";
import { Physics } from "./Physics.cmp.mjs";

export class BoxCollider extends Component {
    constructor(width, height, holder, game, physics = null, xOffset = 0, yOffset = 0) {
        super(holder);
        this._width = width;
        this._height = height;
        this._offset = new Vector(xOffset, yOffset);
        this._game = game;
        this._physics = physics;
    }

    __Start__() {

    }

    __Update__() {
        if (!this._physics) return;
        for (const gobj of this._game.gameObjects) {
            if (gobj == this._holder) continue;

            const collider = gobj.GetComponent(BoxCollider);
            if (!collider) continue;

            const collisionRect = this._Collide(collider);
            const hasCollided = collisionRect.collided;

            if (hasCollided) {
                const colliderHolder = collider.holder;

                const clipDistances = {
                    top: Math.abs((colliderHolder.position.y + colliderHolder.height) - this.holder.position.y),
                    bottom: Math.abs(colliderHolder.position.y - (this.holder.position.y + this.holder.height)),
                    left: Math.abs((colliderHolder.position.x + colliderHolder.width) - this.holder.position.x),
                    right: Math.abs(colliderHolder.position.x - (this.holder.position.x + this.holder.width))
                }

                if (collisionRect["left"] && (clipDistances.left < clipDistances.top && clipDistances.left < clipDistances.bottom)) {
                    this._physics.baseVelocity.x = 0;
                    this.holder.position.x = collider.holder.position.x + collider.holder.width;
                }

                if (collisionRect["right"] && (clipDistances.right < clipDistances.top && clipDistances.right < clipDistances.bottom)) {
                    this._physics.baseVelocity.x = 0;
                    this.holder.position.x = collider.holder.position.x - this.holder.width;
                }

                if (collisionRect["bottom"] && (clipDistances.bottom < clipDistances.left && clipDistances.bottom < clipDistances.right)) {
                    this._physics.baseVelocity.y = 0;
                    this.holder.position.y = collider.holder.position.y - this.holder.height;
                }

                if (collisionRect["top"] && (clipDistances.top < clipDistances.left && clipDistances.top < clipDistances.right)) {
                    this._physics.baseVelocity.y = 0;
                    this.holder.position.y = collider.holder.position.y + collider.holder.height;
                }
            }

        }
    }

    _Collide(collider) {
        const rect1 = this.holder;
        const rect2 = collider.holder;

        const yCol = rect1.position.y < rect2.position.y + rect2.height &&
            rect1.position.y + rect1.height > rect2.position.y;
        const xCol = rect1.position.x < rect2.position.x + rect2.width &&
            rect1.position.x + rect1.width > rect2.position.x;


        const left = rect1.position.x < rect2.position.x + rect2.width &&
            rect1.position.x + rect1.width > rect2.position.x + rect2.width && yCol;

        const right = rect1.position.x + rect1.width > rect2.position.x &&
            rect1.position.x < rect2.position.x && yCol;

        const bottom = rect1.position.y + rect1.height > rect2.position.y &&
            rect1.position.y < rect2.position.y && xCol;

        const top = rect1.position.y < rect2.position.y + rect2.height &&
            rect1.position.y + rect1.height > rect2.position.y + rect2.height && xCol;

        return {
            collided: left || right || bottom || top,
            left: left,
            right: right,
            bottom: bottom,
            top: top
        }
    }

    Collide(collider) {
        const rect1 = this.holder;
        const rect2 = collider.holder;

        const xCol = rect1.position.x < rect2.position.x + rect2.width + 1 &&
        rect1.position.x + rect1.width > rect2.position.x - 1;
        const yCol =  rect1.position.y < rect2.position.y + rect2.height + 1 &&
        rect1.position.y + rect1.height > rect2.position.y - 1;

        const left = rect1.position.x < rect2.position.x + rect2.width + 1 &&
            rect1.position.x + rect1.width > rect2.position.x + rect2.width + 1 && yCol
           

        const right = rect1.position.x + rect1.width > rect2.position.x - 1 &&
            rect1.position.x < rect2.position.x - 1 && yCol

        const bottom = rect1.position.y + rect1.height > rect2.position.y - 1 &&
            rect1.position.y < rect2.position.y - 1 && xCol
            

        const top = rect1.position.y < rect2.position.y + rect2.height + 1 &&
            rect1.position.y + rect1.height > rect2.position.y + rect2.height + 1 && xCol

        const clipDistances = {
            top: Math.abs((rect2.position.y + rect2.height) - this.holder.position.y),
            bottom: Math.abs(rect2.position.y - (this.holder.position.y + this.holder.height)),
            left: Math.abs((rect2.position.x + rect2.width) - this.holder.position.x),
            right: Math.abs(rect2.position.x - (this.holder.position.x + this.holder.width))
        }


        return {
            collided: left || right || bottom || top,
            left: left,
            right: right,
            bottom: bottom,
            top: top,
            clipDistances: clipDistances,
        }
    }

    CollideAll() {
        const res = {
            collided: false,
            left: false,
            right: false,
            bottom: false,
            top: false,
            clipDistances: [],
            collisions: []
        }

        for (const gobj of this._game.gameObjects) {
            if (gobj == this._holder) continue;

            const collider = gobj.GetComponent(BoxCollider);
            if (collider) {
                const clipDistances = {
                    top: Math.abs((gobj.position.y + gobj.height) - this.holder.position.y),
                    bottom: Math.abs(gobj.position.y - (this.holder.position.y + this.holder.height)),
                    left: Math.abs((gobj.position.x + gobj.width) - this.holder.position.x),
                    right: Math.abs(gobj.position.x - (this.holder.position.x + this.holder.width))
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