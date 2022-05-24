import { Component } from "./Component.mjs";
import { Renderer } from "./Components/Renderer.cmp.mjs";
import { Vector } from "./Vector.mjs";

export class GameObject
{
    constructor(x, y, width, height, game, name)
    {
        this._position = new Vector(x, y);
        this._width = width;
        this._height = height;
        this._components = {};
        this._renderer = new Renderer(game.canvas, width, height, x, y, this);
        this._game = game;
        this._name = name;
        this._started = false;
        this._lastUpdated = Date.now();
    }

    get width(){return this._width;}
    get height(){return this._height;}
    set width(width){this._width = width;}
    set height(height){this._height = height;}
    get components(){return this._components;}
    set components(component)
    {
        if(component instanceof Component && !(component instanceof Renderer) && !this.GetComponent(component))
        this._components.push(component); 
        else throw new TypeError("Not a valid component");
    }
    get renderer(){return this._renderer;}
    get name(){return this._name;}
    get started(){return this._started;}
    get position(){return this._position;}
    set position(position){this._position = position;}

    __Start__(){}
    __Update__(){}
    __Render__(){}

    __EarlyStart__(){}
    __EarlyUpdate__(){}
    __EarlyRender__(){}

    GetComponent(type)
    {
        return this._components[type.name];
    }

    AddComponent(cmp)
    {
        this._components[cmp.constructor.name] = cmp;
        return cmp;
    }

    Start()
    {
        this._started = true;
        this.__EarlyStart__();
        if(this._renderer)this._renderer.Start();
        for(const key in this._components)
        {
            const cmp = this._components[key];
            cmp.Start();
        }
        this.__Start__();
    }

    Render(offsetX, offsetY, lagOffset)
    {
        this.__EarlyRender__();
        if(this._renderer)this._renderer.Render(offsetX, offsetY, lagOffset);
        this.__Render__()
    }

    Update()
    {
        this._lastUpdated = Date.now();
        this.__EarlyUpdate__();
        if(this._renderer)this._renderer.Update();
        for(const key in this._components)
        {
            const cmp = this._components[key];
            cmp.Update();
        }
        this.__Update__();
    }
}