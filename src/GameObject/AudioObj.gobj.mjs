import { GameObject } from "../GameObject.mjs";
import { AudioPlayer } from "../Components/AudioPlayer.cmp.mjs";

export class AudioObj extends GameObject
{
    constructor(path, name, game)
    {
        super(null, null, null, null, game, name);
        this._renderer = null;
        this._path =  path;
    }

    __EarlyStart__()
    {
        this.AddComponent(new AudioPlayer(this._path, this));
    }

    Play()
    {
        const audio = this.GetComponent(AudioPlayer);
        audio.Play();
    }
}