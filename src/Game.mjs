import { Camera } from "./Camera.mjs";
import { GameObject } from "./GameObject.mjs";
import { Input } from "./Input.mjs";

let lastUpdate = Date.now(); // stores lastUpdate as a global

/**
 * The main game
 * 
 * @class Game
 * @example
 * const game = new Game(canvas, 60, "black", true);
 * game.MainLoop();
 * game.AddGameObject(player);
 * game.AddGameObject(enemy);
 */
export class Game 
{
    /**
     * The game constructor
     * @param {HTMLCanvasElement} canvas - The canvas to render to
     * @param {number} fps - The desired framerate
     * @param {string} background - The default background color
     * @param {boolean} useGravity - Whether or not to enable gravity
     * @memberof Game
     */
    constructor(canvas, fps, background, useGravity=true) 
    {
        this._gameObjects = [];
        this._fps = fps;

        this._canvas = canvas;
        this._camera = new Camera(canvas, background, this);

        this._useGravity = useGravity;
        this._paused = false;

        this._input = new Input(this); // input system

        this._requiredFramerate = 1000/fps; // the desired framerate in ms
        this._lag = 0; // the lag between frames
        this._deltaTime = 0; // the time between frames
    }
    
    //#region getters and setters
    /**
     * The game framerate
     * @memberof Game
     * @type {number}
     * @example
     * console.log(game.fps);
     */
    get fps(){return this._fps;}
    /**
     * The list of gameobjects.
     * @memberof Game
     * @readonly
     * @type {GameObject[]}
     * @example
     * for(const object of game.gameObjects)
     * {
     *    console.log(object.name);
     * }
     */
    get gameObjects(){return this._gameObjects}
    
    /**
     * The canvas to render to.
     * @memberof Game
     * @readonly
     * @type {HTMLCanvasElement}
     * @example
     * const canvas = game.canvas;
     * canvas.width = window.innerWidth;
     * canvas.height = window.innerHeight;
     */
    get canvas(){return this._canvas;}

    /**
     * The time since the last frame.
     * @memberof Game
     * @readonly
     * @type {number}
     * @example
     * const deltaTime = game.deltaTime;
     * console.log(deltaTime); // prints the time between frames
     */
    get deltaTime(){return this._deltaTime;}
    
    /**
     * The camera the game is using to render.
     * @memberof Game
     * @readonly
     * @type {Camera}
     * @example
     * const camera = game.camera;
     * camera.width = window.innerWidth;
     * camera.height = window.innerHeight;
     */
    get camera(){return this._camera;}
    
    /**
     * Whether the game uses gravity or not.
     * @memberof Game
     * @type {boolean}
     * @example
     * if(game.useGravity)
     * {
     *   console.log("The game uses gravity");
     * }
     */
    get useGravity(){return this._useGravity;}
    set useGravity(useGravity){this._useGravity = useGravity;}

    /**
     * Whether the game is paused or not. If the game is paused, the game will not update.
     * @memberof Game
     * @type {boolean}
     * @example
     * if(game.paused)
     * {
     *  console.log("The game is paused");
     * }
     */
    set paused(paused){this._paused = paused;}
    get paused(){return this._paused;}
    
    /**
     * The game's input system.
     * @memberof Game
     * @readonly
     * @type {Input}
     * @example
     * const input = game.input;
     * if (input.keystrokes["a"]) {
     *   console.log("a key was pressed");
     * }
     */
    get input(){return this._input;}
    //#endregion

    //#region overriden functions
    // functions that gets overridden
    /**
     * @abstract
     */
    __Load__(){}
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
    __EarlyLoad__(){}
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
     * Gets called before the game runs
     * @memberof Game
     */
    Load() 
    {
        this._input.__Start__();

        document.addEventListener("visibilitychange", e => {
            if(document.hidden)
            {
                lastUpdate = Date.now();
            }
            this.paused = document.hidden;
        });

        this. __EarlyLoad__();
        this._canvas.width = window.innerWidth;
        this._canvas.height = window.innerHeight;
        for(const object of this._gameObjects)
        {
            if(!object.started)
            object.Start();
        }
        this.__Load__();
    }

    /**
     * The rendering function
     * @memberof Game
     * @param {number} lagOffset - The offset of the lag between frames
     */
    Render(lagOffset) 
    {      
        this.__EarlyRender__();
        this._camera.Render(this._gameObjects, lagOffset);
        this.__Render__();
    }

    /**
     * Updates the gameObjects
     * @memberof Game
     */
    Update()
    {
        if(!this._paused) {
            window.requestAnimationFrame(()=>{this.Update()}); // request the next frame

            // calculate delta time and lag
            const current = Date.now(),
                elapsed = current - lastUpdate;
            lastUpdate = current;

            this._lag += elapsed;
            this._deltaTime = elapsed;

            // keep updating the gameObjects until the game catches up with the desired framerate
            while(this._lag >= this._requiredFramerate)
            {
                this.__EarlyUpdate__();
                for(const object of this._gameObjects)
                {
                    if(this.IsInFrameX(object))
                        object.Update();
                }
                this._camera.Update();
                this.__Update__();

                this._lag -= this._requiredFramerate; // reduce the lag
            }

            // calculate lag offset and render
            const lagOffset = this._lag / this._requiredFramerate;
            this.Render(lagOffset);
        }
    }

    /**
     * The main loop of the game. Will start the game when called.
     * @memberof Game
     */
    MainLoop()
    {
        this.Load();
        window.requestAnimationFrame(()=>{this.Update()}); // start the update cycle by requesting the first frame
    }

    /**
     * Adds a gameobject to the game
     * @param {GameObject} gameObject - The gameobject to add
     * @memberof Game
     * @example
     * game.AddGameObject(player);
     */
    AddGameObject(gameObject)
    {
        if(gameObject instanceof GameObject)
        {
            this._gameObjects.push(gameObject);
            gameObject.Start(); // initialize the gameobject
        }
        else
        {
            throw new TypeError("Not a gameobject");
        }
    }

    /**
    * Gets a gameobject by name
    * @param {string} name - The name of the gameobject
    * @returns {GameObject} - The gameobject with the given name
    * @memberof Game
    * @example
    * const player = game.GetObject("player");
    */
    GetObject(name)
    {
        for(const gobj of this.gameObjects)
        {
            if(gobj.name == name) return gobj;
        }
        return null;
    }

    /**
     * Removes the specified gameObject
     * @param {GameObject} gameObject - The gameobject to remove
     * @memberof Game
     * @deprecated
     * @example
     * game.RemoveGameObject(player);
     * game.RemoveGameObject(game.GetObject("player"));
     */
    RemoveGameObject(gameObject) // TODO: rewrite this, it's ugly and confusing to use
    {
        if(gameObject instanceof GameObject)
        {
            for(let index in this._gameObjects) // using a indexed loop so the object can be removed with splice
            {
                const gobj = this._gameObjects[index];
                if(gameObject.name == gobj.name) // checks by name, not by reference
                {
                    this._gameObjects.splice(index, 1);
                    return this._gameObjects;
                }
            }
        }
        else
        {
            throw new TypeError("Not a gameobject");
        }

        return null;
    }

    /**
     * Checks if the gameobject is in the camera's frame with an extension of 100px on each side
     * @param {GameObject} object - The gameobject to check
     * @returns {boolean} - True if the gameobject is in the camera's frame
     * @memberof Game
     * @example
     * if(game.IsInFrame(player))
     * {
     *    // player is in the camera's frame
     * }
     * else
     * {
     *   // player is not in the camera's frame
     * }
     */
    IsInFrame(object)
    {
        const canvasRect = {
            x: -this._camera.position.x, // this is negative because positive values are reversed ¯\_(ツ)_/¯
            y: -this._camera.position.y,
            width: this._canvas.width,
            height: this._canvas.height
        }
        const objPos = object.position;
        
        return objPos.x < canvasRect.x + canvasRect.width + 100 &&
        objPos.x + object.width > canvasRect.x - 100 &&
        objPos.y < canvasRect.y + canvasRect.height + 100 &&
        object.height + objPos.y > canvasRect.y - 100;
    }

    /**
     * Checks if the object is in the camera's frame with an extension of 100px on each side only on the x axis
     * @param {GameObject} object 
     * @returns {boolean} - True if the gameobject is in the camera's frame on the x axis
     * @memberof Game
     * @example
     * if(game.IsInFrameX(player))
     * {
     *   // player is in the camera's frame on the x axis
     * }
     * else
     * {
     *  // player is not in the camera's frame on the x axis
     * }
     */
    IsInFrameX(object)
    {
        const canvasRect = {
            x: -this._camera.position.x, // this is negative because positive values are reversed ¯\_(ツ)_/¯
            y: -this._camera.position.y,
            width: this._canvas.width,
            height: this._canvas.height
        }
        const objPos = object.position;
        
        return objPos.x < canvasRect.x + canvasRect.width + 100 &&
        objPos.x + object.width > canvasRect.x - 100;
    }
}