import { Component } from "../Component.mjs";
import { Renderer } from "./Renderer.cmp.mjs";
import { Color } from "../Color.mjs";

export class Light extends Component
{
    constructor(radius, intensity, color, maxlevel, holder)
    {
        super(holder);
        this._radius = radius;
        this._intensity = intensity;
        this._color = color;
        this._maxlevel = maxlevel;
        this._renderer = holder.renderer;
        this._buffer = [];
    }

    GenerateMap() {
        for (let i = 0; i < this._radius * 2 - 1; i++) {
            const arr = new Array(this._radius * 2 - 1).fill(0);
            this._buffer.push(arr);
        }
        const x = this._radius - 1;
        const y = this._radius - 1;

        for (let yLoop = y - this._radius + 1; yLoop < y + this._radius; yLoop++) {
            for (let xLoop = x - this._radius + 1; xLoop < x + this._radius; xLoop++) {
                const xsqr = Math.pow(xLoop - x, 2);
                const ysqr = Math.pow(yLoop - y, 2);

                if (xsqr + ysqr <= this._radius ** 2) {
                    this._buffer[yLoop][xLoop] = this._intensity - Math.sqrt(xsqr + ysqr);
                }
            }
        }
    }

    CreateRenderImage()
    {
        for (let i = 0; i < this._buffer.length; i++) {
            for (let j = 0; j < this._buffer[i].length; j++) {
                const level = this._buffer[i][j];
                
                const color = new Color(this._color.r, this._color.g, this._color.b, level / this._maxlevel);
                this._renderer.SetPixel(color.colorRGB, j, i);
            }
        }
    }

    FullReload()
    {
        this._renderer.width = this._radius * 2;
        this._renderer.height = this._radius * 2;

        this.GenerateMap();
        this.CreateRenderImage();
    }

    __Start__()
    {
        this._renderer.width = this._radius * 2;
        this._renderer.height = this._radius * 2;

        this.GenerateMap();
        this.CreateRenderImage();
    }
}