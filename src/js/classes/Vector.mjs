export class Vector 
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }
    get length()
    {
        return Math.abs(Math.sqrt(this.x*this.x + this.y*this.y));
    }

    Scale(x)
    {
        this.x *= x;
        this.y *= x;
        return this;
    }

    Add(vector)
    {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    Normalize()
    {
        const v = Math.abs(Math.sqrt(this.x * this.x + this.y * this.y));
        this.x /= v;
        this.y /= v;
        return this;
    }
}