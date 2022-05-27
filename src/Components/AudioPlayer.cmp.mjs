import { Component } from "../Component.mjs";

/**
 * The audio player component used by the audio gameObject
 * @extends Component
 * @class AudioPlayer
 * @example
 * const audioObject = new GameObject("audioObject");
 * const audioPlayer = new AudioPlayer("./audio.mp3", audioObject);
 * audioObject.AddComponent(audioPlayer);
 */
export class AudioPlayer extends Component
{
    /**
     * AudioPlayer constructor
     * @param {string} path - The path to the audio file
     * @param {GameObject} holder - The gameobject that holds the audio player
     */
    constructor(path, holder)
    {
        super(holder);
        this._path = path;
        this._audio = null;
    }

    /**
     * Initializes the audio
     * @memberof AudioPlayer
     */
    __Start__()
    {
        this._audio = new Audio(this._path); // creates new HTML audio element
    }

    /**
     * Plays the audio
     * @memberof AudioPlayer
     */
    Play()
    {
        this._audio.play();
    }
}