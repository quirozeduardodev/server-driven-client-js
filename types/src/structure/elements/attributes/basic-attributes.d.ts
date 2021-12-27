export interface BasicAttributes {
    padding: AttLTRB;
    margin: AttLTRB;
    width?: Measure;
    height?: Measure;
    backgroundColor?: Color;
    border?: BorderLTBR;
}
export declare type MeasureType = 'px' | '%' | 'em' | 'rem';
export declare class AttLTRB {
    left: Measure;
    top: Measure;
    right: Measure;
    bottom: Measure;
    constructor(left?: Measure, top?: Measure, right?: Measure, bottom?: Measure);
    static symmetricVertical(measure: Measure): AttLTRB;
    static symmetricHorizontal(measure: Measure): AttLTRB;
    static symmetric(vertical: Measure, horizontal: Measure): AttLTRB;
    static zero(): AttLTRB;
    static all(measure: Measure): AttLTRB;
    static ltrb(left?: Measure, top?: Measure, right?: Measure, bottom?: Measure): AttLTRB;
    static fromString(str: string): Promise<AttLTRB>;
}
export declare class Measure {
    value: number;
    type: MeasureType;
    constructor(value: number, type: MeasureType);
    static zero(): Measure;
    static fromString(str: string): Promise<Measure>;
}
export declare class Color {
    r: number;
    g: number;
    b: number;
    a: number;
    constructor(r: number, g: number, b: number, a: number);
    static rgba(r: number, g: number, b: number, a: number): Color;
    static rgb(r: number, g: number, b: number): Color;
    static transparent(): Color;
    static fromString(colorString: string): Promise<Color>;
}
export declare class BorderLTBR {
    left: Border;
    top: Border;
    right: Border;
    bottom: Border;
    radius: BorderRadius;
    constructor(left?: Border, top?: Border, right?: Border, bottom?: Border, radius?: BorderRadius);
}
export declare class Border {
    style: 'none' | 'solid' | 'dashed' | 'dotted';
    width: Measure;
    color: Color;
    constructor(width?: Measure, style?: "none" | "solid" | "dashed" | "dotted", color?: Color);
    static fromString(colorString: string): Promise<Border>;
}
export declare class BorderRadius {
    topLeft: Measure;
    topRight: Measure;
    bottomLeft: Measure;
    bottomRight: Measure;
    constructor(topLeft?: Measure, topRight?: Measure, bottomRight?: Measure, bottomLeft?: Measure);
    static symmetricTop(measure: Measure): BorderRadius;
    static symmetricBottom(measure: Measure): BorderRadius;
    static symmetric(top: Measure, bottom: Measure): BorderRadius;
    static zero(): BorderRadius;
    static all(measure: Measure): BorderRadius;
    static fromString(str: string): Promise<BorderRadius>;
}
