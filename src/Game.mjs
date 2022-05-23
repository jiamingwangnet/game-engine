import { Camera } from "./Camera.mjs";
import { GameObject } from "./GameObject.mjs";
import { Input } from "./Input.mjs";

let lastUpdate = Date.now();

export class Game 
{
    constructor(canvas, fps, background, gravity=true) 
    {
        this._gameObjects = [];
        this._fps = fps;

        this._deltaTime = 0;

        this._canvas = canvas;
        this._camera = new Camera(canvas, background);

        this._gravity = gravity;
        this._paused = false;

        this._input = new Input(this);
    }
    
    get gameObjects(){return this._gameObjects}
    get canvas(){return this._canvas;}
    get deltaTime(){return this._deltaTime;}
    get camera(){return this._camera;}
    get gravity(){return this._gravity;}
    set gravity(gravity){this._gravity = gravity;}
    set paused(paused){this._paused = paused;}
    get paused(){return this._paused;}
    get input(){return this._input;}

    __Load__(){}
    __Update__(){}
    __Render__(){}

    __EarlyLoad__(){}
    __EarlyUpdate__(){}
    __EarlyRender__(){}

    Load() 
    {
        this._input.__Start__();

        document.addEventListener("visibilitychange", e => {
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

    Render() 
    {      
        this.__EarlyRender__();
        this._camera.Render(this._gameObjects);
        this.__Render__();
    }

    Update()
    {
        if(!this._paused) {
            const now = Date.now();
            this._deltaTime = (now - lastUpdate) / (1000 / this._fps);
            lastUpdate = now;

            this.__EarlyUpdate__();
            for(const object of this._gameObjects)
            {
                object.Update();
            }
            this._camera.Update();
            this.__Update__();

            this.Render();
        }
        else
        {
            // clear deltaTime
            lastUpdate = Date.now();
            this._deltaTime = 0;
        }
        window.requestAnimationFrame(()=>{this.Update()});
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
            gameObject.Start();
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