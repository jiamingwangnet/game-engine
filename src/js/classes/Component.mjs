export class Component
{
    constructor(holder)
    {
        this._holder = holder;
        this._enabled = true;
    }

    get enabled(){return this._enabled;}
    set enabled(enabled){this._enabled = enabled;}
    get holder(){return this._holder;}

    __Start__(){}
    __Update__(){}
    
    Start(){if(this._enabled)this.__Start__();}
    Update(){if(this._enabled)this.__Update__();}
}