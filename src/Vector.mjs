/**
 * A vector is a mathematical object that represents a point in a two-dimensional coordinate system.
 * 
 * @class Vector
 * @example
 * const v = new Vector(1, 1);
 */
export class Vector 
{
    /**
     * Vector constructor
     * @param {number} x - The x value of the vector
     * @param {number} y - The y value of the vector
     * @memberof Vector
     */
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }
    //#region getters and setters
    /**
     * The length of the vector.
     * @type {number}
     * @memberof Vector
     * @readonly
     * @example
     * const v = new Vector(6, 8);
     * console.log(v.length); // 9
     */
    get length(){return Math.abs(Math.sqrt(this.x*this.x + this.y*this.y));}

    /**
     * The angle of the vector.
     * @type {number}
     * @memberof Vector
     * @readonly
     * @example
     * const v = new Vector(6, 8);
     * console.log(v.angle); // 0.7853981633974483
     * console.log(v.angle * 180 / Math.PI); // 45
     */
    get angle(){return Math.atan2(this.y, this.x);}
    //#endregion

    /**
     * Multiplies the vector by the scalar x and returns the vector.
     * @param {number} x 
     * @returns {Vector} - The scaled vector
     * @memberof Vector
     * @example
     * const v = new Vector(1, 1);
     * v.Scale(2);
     * console.log(v.x); // 2
     * console.log(v.y); // 2
     */
    Scale(x)
    {
        this.x *= x;
        this.y *= x;
        return this;
    }

    /**
     * Adds the vector to the current vector and returns the vector.
     * @param {Vector} vector
     * @returns {Vector} - The added vector
     * @memberof Vector
     * @example
     * const v1 = new Vector(1, 1);
     * const v2 = new Vector(2, 2);
     * v1.Add(v2);
     * 
     * console.log(v1.x); // 3
     * console.log(v1.y); // 3
     * console.log(v2.x); // 2
     * console.log(v2.y); // 2
     */
    Add(vector)
    {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    /**
     * Normalizes the vector and returns the vector.
     * @returns {Vector} - The normalized vector
     * @memberof Vector
     * @example
     * const v = new Vector(6, 8);
     * v.Normalize();
     * 
     * console.log(v.x); // 0.6
     * console.log(v.y); // 0.8
     * console.log(v.length); // 1
     */
    Normalize()
    {
        const v = Math.abs(Math.sqrt(this.x * this.x + this.y * this.y));
        this.x /= v;
        this.y /= v;
        return this;
    }
}