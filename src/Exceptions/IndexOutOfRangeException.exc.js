export class IndexOutOfRangeException extends Error 
{
    constructor(message) 
    {
        super(message);
        this.name = "IndexOutOfRangeException";
    }
}