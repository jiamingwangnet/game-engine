export class Color {
    constructor(r, g, b, a, raw = null) {
        if ((r > 0xff || g > 0xff || b > 0xff) || (r < 0 || g < 0 || b < 0)) {
            throw new Error("Colors must be < 256 and >= 0");
        }
        this.color = r && g && b ? r * 0x10000 + g * 0x100 + b : raw;
        this._a = a; // alpha is stored as a float seperatly
    }

    get rawColor() { return this.color }
    get colorRGB() {return `rgb(${this.r}, ${this.g}, ${this.b}, ${this.a})`;}
    get colorHEX() {return `#${(this.r < 0x10 ? "0" : "") + this.r.toString(16)}${(this.g < 0x10 ? "0" : "") + this.g.toString(16)}${(this.b < 0x10 ? "0" : "") + this.b.toString(16)}`;}
    get r() {return (this.color & 0xff0000) >>> 16;}
    get g() {return (this.color & 0x00ff00) >>> 8;}
    get b() {return (this.color & 0x0000ff);}
    get a() {return this._a;}
    set r(r) {this.color = this.b + this.g * 0x100 + r * 0x10000;}
    set g(g) {this.color = this.b + g * 0x100 + this.r * 0x10000;}
    set b(b) {this.color = b + this.g * 0x100 + this.r * 0x10000;}
    set a(a) {this._a = a;}

    static ToHEX(colorRaw) {
        const color = new Color(null, null, null, null, colorRaw);
        return `#${(color.r < 0x10 ? "0" : "") + color.r.toString(16)}${(color.g < 0x10 ? "0" : "") + color.g.toString(16)}${(color.b < 0x10 ? "0" : "") + color.b.toString(16)}`;
    }

    static ToRGB(colorRaw) {
        const color = new Color(null, null, null, null, colorRaw);
        return `rgb(${color.r}, ${color.g}, ${color.b}, ${this.a})`;
    }
}