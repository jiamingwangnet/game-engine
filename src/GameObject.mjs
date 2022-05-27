import { Component } from "./Component.mjs";
import { Renderer } from "./Components/Renderer.cmp.mjs";
import { Vector } from "./Vector.mjs";

/**
 * The abstract GameObject class
 * 
 * @class GameObject
 * @abstract
 * @example
 * class MyGameObject extends GameObject
 * {
 *   constructor(x, y, width, height, game, name)
 *  {
 *     super(x, y, width, height, game, name);
 *  }
 * }
 * 
 * const gameObject = new MyGameObject(0, 0, 100, 100, game, "GameObject");
 */
export class GameObject
{
    /**
     * The GameObject constructor
     * @param {number} x - The x position
     * @param {number} y - The y position
     * @param {number} width - The width of the gameObject
     * @param {number} height - The height of the gameObject
     * @param {Game} game - The game that the gameObject belongs to
     * @param {string} name - The name of the gameObject
     * @memberof GameObject
     */
    constructor(x, y, width, height, game, name)
    {
        if (this.constructor == Component) {
            throw new Error("Abstract classes can't be instantiated.");
        }
        this._position = new Vector(x, y);
        this._width = width;
        this._height = height;
        this._components = {}; // components are stored in an object for quicker access using key-value pairs
        this._renderer = new Renderer(game.canvas, width, height, x, y, this);
        this._game = game;
        this._name = name;
        this._started = false;
        this._lastUpdated = Date.now(); // the last time the update function was called
    }

    //#region getters and setters
    /**
     * Gets the width of the gameObject.
     * @type {number}
     * @memberof GameObject
     * @example
     * gameObject.width = 100;
     * console.log(gameObject.width); // 100
     */
    get width(){return this._width;}
    set width(width){this._width = width;}

    /**
     * he height of the gameObject.
     * @type {number}
     * @memberof GameObject
     * @example
     * gameObject.height = 100;
     * console.log(gameObject.height); // 100
     */
    get height(){return this._height;}
    set height(height){this._height = height;}

    /**
     * The renderer of the gameObject.
     * @type {Renderer}
     * @memberof GameObject
     * @readonly
     * @example
     * gameObject.renderer.SetPixel("red", 0, 0);
     */
    get renderer(){return this._renderer;}

    /**
     * The name of the gameObject.
     * @type {string}
     * @memberof GameObject
     * @readonly
     * @example
     * gameObject.name = "GameObject";
     * console.log(gameObject.name); // GameObject
     */
    get name(){return this._name;}

    /**
     * Whether the gameObject has started.
     * @type {boolean}
     * @memberof GameObject
     * @readonly
     * @example
     * if(gameObject.started)
     * {
     *  // do something
     * }
     */
    get started(){return this._started;}

    /**
     * The position of the gameObject.
     * @type {Vector}
     * @memberof GameObject
     * @example
     * gameObject.position = new Vector(100, 100);
     * console.log(gameObject.position); // {x: 100, y: 100}
     */
    get position(){return this._position;}
    set position(position){this._position = position;}
    //#endregion

    //#region overriden methods
    // functions that get overridden
    /**
     * @abstract
     */
    __Start__(){}
    /**
     * @abstract
     */
    __Update__(){}
    /**
     * @abstract
     */
    __Render__(){}

    /**
     * @abstract
     */
    __EarlyStart__(){}
    /**
     * @abstract
     */
    __EarlyUpdate__(){}
    /**
     * @abstract
     */
    __EarlyRender__(){}
    //#endregion

    /**
     * Gets the component in the gameObject by type.
     * @param {Component} type 
     * @returns {Component} - The component in the gameObject
     * @memberof GameObject
     * @example
     * const cmp = gameObject.GetComponent(Component);
     */
    GetComponent(type)
    {
        return this._components[type.name];
    }

    /**
     * Adds the component to the gameObject.
     * @param {Component} cmp 
     * @returns {Component} - The added component
     * @memberof GameObject
     * @example
     * const cmp = gameObject.AddComponent(Component);
     */
    AddComponent(cmp)
    {
        if(cmp instanceof Component && !(cmp instanceof Renderer) && !this.GetComponent(cmp))
        {
            this._components[cmp.constructor.name] = cmp;
            return cmp;
        }
        else throw new TypeError("Not a valid component");
    }

    /**
     * Initializes the gameObject.
     * @memberof GameObject
     */
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

    /**
     * Renders the gameObject by calling the renderer.
     * @param {number} lagOffset - The offset of the lag between frames
     * @param {number} offsetX - The offset of the x position
     * @param {number} offsetY - The offset of the y position
     * @memberof GameObject
     */
    Render(offsetX, offsetY, lagOffset)
    {
        this.__EarlyRender__();
        if(this._renderer)this._renderer.Render(offsetX, offsetY, lagOffset);
        this.__Render__()
    }

    /**
     * Updates the gameObject and its components.
     * @memberof GameObject
     */
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