export interface BasicAttributes {
    padding: AttLTRB;
    margin: AttLTRB;
    width?: Measure;
    height?: Measure;
    backgroundColor?: Color;
}
export declare type MeasureType = 'px' | 'percentage' | 'em' | 'rem';
export declare class AttLTRB {
    left: Measure;
    top: Measure;
    right: Measure;
    bottom: Measure;
    constructor(left?: Measure, top?: Measure, right?: Measure, bottom?: Measure);
    static symmetricVertical(measure: Measure): Promise<AttLTRB>;
    static symmetricHorizontal(measure: Measure): Promise<AttLTRB>;
    static symmetric(vertical: Measure, horizontal: Measure): Promise<AttLTRB>;
    static zero(): Promise<AttLTRB>;
    static all(measure: Measure): Promise<AttLTRB>;
    static ltrb(left?: Measure, top?: Measure, right?: Measure, bottom?: Measure): Promise<AttLTRB>;
    static fromString(str: string): Promise<AttLTRB>;
}
export declare class Measure {
    value: number;
    type: MeasureType;
    constructor(value: number, type: MeasureType);
    static zero(): Promise<Measure>;
    static fromString(str: string): Promise<Measure>;
}
export declare class Color {
    r: number;
    g: number;
    b: number;
    a: number;
    constructor(r: number, g: number, b: number, a: number);
    static rgba(r: number, g: number, b: number, a: number): Promise<Color>;
    static rgb(r: number, g: number, b: number): Promise<Color>;
    static fromString(colorString: string): Promise<Color>;
}
