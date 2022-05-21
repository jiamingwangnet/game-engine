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
        this._components = [];
        this._renderer = new Renderer(game.canvas, width, height, x, y, this);
        this._game = game;
        this._name = name;
        this._started = false;
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
        for(const cmp of this._components)
        {
            if(cmp instanceof type)
                return cmp;
        }
        return null;
    }

    AddComponent(cmp)
    {
        this._components.push(cmp);
        return cmp;
    }

    Start()
    {
        this._started = true;
        this.__EarlyStart__();
        this._renderer.Start();
        for(const cmp of this._components)
        {
            cmp.Start();
        }
        this.__Start__();
    }

    Render(offsetX, offsetY)
    {
        this.__EarlyRender__();
        this._renderer.Render(offsetX, offsetY);
        this.__Render__()
    }

    Update()
    {
        this.__EarlyUpdate__();
        this._renderer.Update();
        for(const cmp of this._components)
        {
            cmp.Update();
        }
        this.__Update__();
    }
}