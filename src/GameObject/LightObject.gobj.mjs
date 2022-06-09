import { Light } from "../Components/Light.cmp.mjs";
import { GameObject } from "../GameObject.mjs";

export class LightObject extends GameObject
{
    constructor(x, y, radius, intensity, color, game, name, maxlevel=500, )
    {
        super(x, y, radius * 2, radius * 2, game, name, 10000000000);
        this._radius = radius;
        this._intensity = intensity;
        this._color = color;
        this._maxlevel = maxlevel;
    }

    __Start__()
    {
        const light = new Light(this._radius, this._intensity, this._color, this._maxlevel, this);
        this.AddComponent(light);
    }
}