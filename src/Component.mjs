/**
 * The abstract Compnent class
 * 
 * @class Component
 * @abstract
 * @example
 * class MyComponent extends Component
 * {
 *   constructor(holder)
 *   {
 *      super(holder);
 *   }
 * }
 */
export class Component
{
    /**
     * The component constructor. This is an abstract class.
     * @param {GameObject} holder the gameObject that this component is attached to
     * @memberof Component
     */
    constructor(holder)
    {
        if (this.constructor == Component) { // makes sure that the constructor is not called directly
            throw new Error("Abstract classes can't be instantiated.");
        }
        this._holder = holder; // the gameObject that this component is attached to
        this._enabled = true;
    }

    //#region getters and setters
    /**
     * Whether the component is enabled or not. If disabled, the component will not be updated.
     * @type {boolean}
     * @memberof Component
     * @example
     * component.enabled = false;
     * component.enabled = true;
     * console.log(component.enabled); // true
     */
    get enabled(){return this._enabled;}
    set enabled(enabled){this._enabled = enabled;}

    /**
     * The gameObject that this component is attached to.
     * @type {GameObject}
     * @memberof Component
     * @readonly
     * @example
     * component.holder.position.x = 100;
     * console.log(component.holder.position.x); // 100
     */
    get holder(){return this._holder;}
    //#endregion

    //#region abstract methods
    /**
     * @abstract
     */
    __Start__(){}
    /**
     * @abstract
     */
    __Update__(){}
    //#endregion
    
    Start(){if(this._enabled)this.__Start__();}
    Update(){if(this._enabled)this.__Update__();}
}