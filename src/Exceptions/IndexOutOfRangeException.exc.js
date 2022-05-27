/**
 * JavaScript doesn't have a IndexOutOfRange error built in, so I created this.
 * @class IndexOutOfRangeException
 * @extends Error
 * @example
 * throw new IndexOutOfRangeException("Out of range!");
 */
export class IndexOutOfRangeException extends Error 
{
    /**
     * Constructor
     * @param {string} message - the error message
     */
    constructor(message) 
    {
        super(message);
        this.name = "IndexOutOfRangeException";
    }
}