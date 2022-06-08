import { Light } from "../Components/Light.cmp.mjs";
import { GameObject } from "../GameObject.mjs";

export class LightObject extends  GameObject
{
    constructor(x, y, radius, intensity, color, game, name, maxlevel=500, )
    {
        super(x, y, 1, 1, game, name);
        this.radius = radius;
        this.intensity = intensity;
        this.color = color;
        this.maxlevel = maxlevel;
    }

    __Start__()
    {
        const light = new Light(this.radius, this.intensity, this.color, this.maxlevel, this);
        this.AddComponent(light);
    }
}