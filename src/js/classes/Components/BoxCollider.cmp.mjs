import { Component } from "../Component.mjs";
import { Physics } from "./Physics.cmp.mjs";

export class BoxCollider extends Component
{
    constructor(width, height, holder, game, xOffset=0,yOffset=0)
    {
        super(holder);
        this._width = width;
        this._height = height;
        this._xOffset = xOffset;
        this._yOffset = yOffset;
        this._game = game;
    }

    __Start__()
    {

    }

    __Update__()
    {
        for(const gobj of this._game.gameObjects){
            if(gobj == this._holder) continue;

            const collider = gobj.GetComponent(BoxCollider);
            if(collider)
            {
                const collisionRect = this._Collide(collider);
                const hasCollided = collisionRect.collided;
                
                const physics = this.holder.GetComponent(Physics);

                if(hasCollided && physics)
                {
                    const colliderHolder = collider.holder;

                    const collideRect = collider._Collide(this);

                    if(collisionRect["left"])
                    {
                        physics.baseVelocity.x = 0;
                        this.holder.x = collider.holder.x + collider.holder.width;
                    }

                    if(collisionRect["right"])
                    {
                        physics.baseVelocity.x = 0;
                        this.holder.x = collider.holder.x - this.holder.width;
                    }

                    if(collisionRect["bottom"])
                    {
                        physics.baseVelocity.y = 0;
                        this.holder.y = collider.holder.y - this.holder.height;
                    }

                    if(collisionRect["top"])
                    {
                        physics.baseVelocity.y = 0;
                        this.holder.y = collider.holder.y + collider.holder.height;
                    }
                }
            }
        }
    }

    _Collide(collider)
    {
        const rect1 = this.holder;
        const rect2 = collider.holder;
      
        const left = rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x + rect2.width &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y;

        const right = rect1.x + rect1.width > rect2.x &&
        rect1.x < rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y;

        const bottom = rect1.y + rect1.height > rect2.y &&
        rect1.y < rect2.y &&
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x;

        const top = rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y + rect2.height &&
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x;
        

        return {
            collided: left || right || bottom || top,
            left: left,
            right: right,
            bottom: bottom,
            top: top
        }
    }

    Collide(collider)
    {
        const rect1 = this.holder;
        const rect2 = collider.holder;
      
        const left = rect1.x < rect2.x + rect2.width + 1 &&
        rect1.x + rect1.width > rect2.x + rect2.width + 1 &&
        rect1.y < rect2.y + rect2.height + 1 &&
        rect1.y + rect1.height > rect2.y - 1;

        const right = rect1.x + rect1.width > rect2.x - 1 &&
        rect1.x < rect2.x - 1 &&
        rect1.y < rect2.y + rect2.height + 1 &&
        rect1.y + rect1.height > rect2.y - 1;

        const bottom = rect1.y + rect1.height > rect2.y - 1 &&
        rect1.y < rect2.y - 1 &&
        rect1.x < rect2.x + rect2.width + 1 &&
        rect1.x + rect1.width > rect2.x - 1;

        const top = rect1.y < rect2.y + rect2.height + 1 &&
        rect1.y + rect1.height > rect2.y + rect2.height + 1 &&
        rect1.x < rect2.x + rect2.width + 1 &&
        rect1.x + rect1.width > rect2.x - 1;
        

        return {
            collided: left || right || bottom || top,
            left: left,
            right: right,
            bottom: bottom,
            top: top
        }
    }

    CollideAll()
    {
        const res = {
            collided: false,
            left: false,
            right: false,
            bottom: false,
            top: false
        }

        for(const gobj of this._game.gameObjects){
            if(gobj == this._holder) continue;

            const collider = gobj.GetComponent(BoxCollider);
            if(collider)
            {
                res.collided = res.collided || this.Collide(collider).collided;
                res.left = res.left || this.Collide(collider).left;
                res.right = res.right || this.Collide(collider).right;
                res.bottom = res.bottom || this.Collide(collider).bottom;
                res.top = res.top || this.Collide(collider).top;
            }
        }

        return res;
    }
}