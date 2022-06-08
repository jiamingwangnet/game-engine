export class Color {
    constructor(r, g, b, a, raw = null) {
        if ((r > 0xff || g > 0xff || b > 0xff || a > 0xff) || (r < 0 || g < 0 || b < 0 || a < 0)) {
            throw new Error("Colors must be < 256 and >= 0");
        }
        this.color = r && g && b && a ? r * 0x1000000 + g * 0x10000 + b * 0x100 + a : raw;
    }

    get rawColor() { return this.color }
    get colorRGB() {return `rgb(${this.r}, ${this.g}, ${this.b}, ${this.a / 255})`;}
    get colorHEX() {return `#${(this.r < 0x10 ? "0" : "") + this.r.toString(16)}${(this.g < 0x10 ? "0" : "") + this.g.toString(16)}${(this.b < 0x10 ? "0" : "") + this.b.toString(16)}${(this.a < 0x10 ? "0" : "") + this.b.toString(16)}`;}
    get r() {return (this.color & 0xff000000) >>> 24;}
    get g() {return (this.color & 0x00ff0000) >>> 16;}
    get b() {return (this.color & 0x0000ff00) >>> 8;}
    get a() {return (this.color & 0x000000ff);}
    set r(r) {this.color = this.a + this.b * 0x100 + this.g * 0x10000 + r * 0x1000000;}
    set g(g) {this.color = this.a + this.b * 0x100 + g * 0x10000 + this.r * 0x1000000;}
    set b(b) {this.color = this.a + b * 0x100 + this.g * 0x10000 + this.r * 0x1000000;}
    set a(a) {this.color = a + this.b * 0x100 + this.g * 0x10000 + this.r * 0x1000000;}

    static ToHEX(colorRaw) {
        const color = new Color(null, null, null, null, colorRaw);
        return `#${(color.r < 0x10 ? "0" : "") + color.r.toString(16)}${(color.g < 0x10 ? "0" : "") + color.g.toString(16)}${(color.b < 0x10 ? "0" : "") + color.b.toString(16)}${(color.a < 0x10 ? "0" : "") + color.b.toString(16)}`;
    }

    static ToRGB(colorRaw) {
        const color = new Color(null, null, null, null, colorRaw);
        return `rgb(${color.r}, ${color.g}, ${color.b}, ${this.a / 255})`;
    }
}