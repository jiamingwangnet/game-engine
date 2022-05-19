import { GameObject } from "./GameObject.mjs";

let lastUpdate = Date.now();

export class Game 
{
    constructor(canvas, fps, background) 
    {
        this._canvas = canvas;
        this._gameObjects = [];
        this._background = background;
        this._fps = fps;
        this._ctx = canvas.getContext("2d");

        this._deltaTime = 0;
        this._keystrokes = {};
    }
    
    get gameObjects(){return this._gameObjects}
    get background(){return this._background}
    set background(background){this._background = background}
    get canvas(){return this._canvas;}
    get keystrokes(){return this._keystrokes;}
    get deltaTime(){return this._deltaTime;}

    __Load__(){}
    __Update__(){}
    __Render__(){}

    __EarlyLoad__(){}
    __EarlyUpdate__(){}
    __EarlyRender__(){}

    Load() 
    {
        window.addEventListener("keydown", e => {
            this.keystrokes[e.key] = true;
        })
        window.addEventListener("keyup", e => {
            this.keystrokes[e.key] = false;
        })

        this. __EarlyLoad__();
        this._canvas.width = window.innerWidth;
        this._canvas.height = window.innerHeight;
        for(const object of this._gameObjects)
        {
            object.Start();
        }
        this.__Load__();
    }

    Render() 
    {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);        

        this.__EarlyRender__();
        this._ctx.fillStyle = this._background;
        this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
        
        for(const object of this._gameObjects)
        {
            object.Render();
        }
        this.__Render__();
    }

    Update()
    {
        const now = Date.now();
        this._deltaTime = now - lastUpdate;
        lastUpdate = now;

        this.__EarlyUpdate__();
        for(const object of this._gameObjects)
        {
            object.Update();
        }
        this.__Update__();

        this.Render();
        window.setTimeout(()=>{this.Update()}, 1000 / this._fps);
    }

    MainLoop()
    {
        this.Load();
        this.Update();
    }

    AddGameObject(gameObject)
    {
        if(gameObject instanceof GameObject)
        {
            this._gameObjects.push(gameObject);
        }
        else
        {
            throw new TypeError("Not a gameobject");
        }
    }

    GetObject(name)
    {
        for(const gobj of this.gameObjects)
        {
            if(gobj.name == name) return gobj;
        }
        return null;
    }

    RemoveGameObject(gameObject)
    {
        if(gameObject instanceof GameObject)
        {
            for(let index in this._gameObjects)
            {
                const gobj = this._gameObjects[index];
                if(gameObject.name == gobj.name)
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
}