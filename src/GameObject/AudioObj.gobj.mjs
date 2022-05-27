import { GameObject } from "../GameObject.mjs";
import { AudioPlayer } from "../Components/AudioPlayer.cmp.mjs";
import { Game } from "../Game.mjs";

/**
 * Audio object, needs to be a GameObject to be able to play audio using the game's update cycle
 * @class AudioObj
 * @extends GameObject
 * @example
 * const audioObj = new AudioObj(...args);
 * audioObj.Play();
 */
export class AudioObj extends GameObject
{
    /**
     * 
     * @param {string} path - the path to the audio file
     * @param {string} name - the name of the audio object
     * @param {Game} game - the game that the audio object belongs to
     */
    constructor(path, name, game)
    {
        super(null, null, null, null, game, name); // does not need most of the parameters because it is not rendered
        this._renderer = null;
        this._path =  path;
    }

    /**
     * Initializes the audio object
     * @memberof AudioObj
     * @override
     */
    __EarlyStart__()
    {
        this.AddComponent(new AudioPlayer(this._path, this));
    }

    /**
     * Plays the audio
     * @memberof AudioObj
     * @example
     * const audioObj = new AudioObj(...args);
     * audioObj.Play();
     */
    Play()
    {
        const audio = this.GetComponent(AudioPlayer);
        audio.Play();
    }
}