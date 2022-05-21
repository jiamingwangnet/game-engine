import { Component } from "../Component.mjs";

export class AudioPlayer extends Component
{
    constructor(path, holder)
    {
        super(holder);
        this._path = path;
        this._audio = null;
    }

    __Start__()
    {
        this._audio = new Audio(this._path);
    }

    Play()
    {
        this._audio.play();
    }
}