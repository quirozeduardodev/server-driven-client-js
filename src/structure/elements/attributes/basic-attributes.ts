export interface BasicAttributes {
  padding: AttLTRB;
  margin: AttLTRB;
  width?: Measure;
  height?: Measure;
  backgroundColor?: Color;
}
export type MeasureType = 'px' | '%' | 'em' | 'rem';
export class AttLTRB {
  public left: Measure = new Measure(0, 'px');
  public top: Measure = new Measure(0, 'px');
  public right: Measure = new Measure(0, 'px');
  public bottom: Measure = new Measure(0, 'px');

  constructor(left?: Measure, top?: Measure, right?: Measure, bottom?: Measure) {
    this.left = left ?? this.left;
    this.top = top ?? this.top;
    this.right = right ?? this.right;
    this.bottom = bottom ?? this.bottom;
  }

  public static async symmetricVertical(measure: Measure): Promise<AttLTRB> {
    return new AttLTRB(await Measure.zero(), measure, await Measure.zero(), measure);
  }

  public static async symmetricHorizontal(measure: Measure): Promise<AttLTRB> {
    return new AttLTRB(measure, await Measure.zero(), measure, await Measure.zero());
  }

  public static async symmetric(vertical: Measure, horizontal: Measure): Promise<AttLTRB> {
    return new AttLTRB(horizontal, vertical, horizontal, vertical);
  }

  public static async zero(): Promise<AttLTRB> {
    return new AttLTRB();
  }

  public static async all(measure: Measure): Promise<AttLTRB> {
    return new AttLTRB(measure, measure, measure, measure);
  }

  public static async ltrb(left?: Measure, top?: Measure, right?: Measure, bottom?: Measure): Promise<AttLTRB> {
    return new AttLTRB(left, top, right, bottom);
  }

  public static async fromString(str: string): Promise<AttLTRB> {
    const cleanString: string = str ? str.trim() : '';

    if(cleanString.length <= 0) {
      return await AttLTRB.zero();
    }
    const measurements: Measure[] = [];
    for (const string of cleanString.split(/\s+/g)) {
      measurements.push(await Measure.fromString(string));
    }

    if (![1, 2, 4].includes(measurements.length)) {
      throw Error(`Invalid number of Measurements: ${cleanString}`)
    }

    if (measurements.length === 4) {
      return await AttLTRB.ltrb(measurements[0], measurements[1], measurements[2], measurements[3]);
    } else if (measurements.length === 2) {
      return await AttLTRB.symmetric(measurements[0], measurements[1]);
    } else {
      return await AttLTRB.all(measurements[0]);
    }
  }
}
export class Measure {
  public value: number;
  public type: MeasureType;


  constructor(value: number, type: MeasureType) {
    this.value = value;
    this.type = type;
  }

  public static async zero(): Promise<Measure> {
    return new Measure(0, 'px');
  }

  public static async fromString(str: string): Promise<Measure> {
    const cleanString: string = str ? str.trim() : '';
    if(cleanString.length <= 0) {
      return await Measure.zero();
    }
    const matches = cleanString.match(/^([0-9]+)(rem|px|em|%)$/);
    if(matches) {
      let measureType: MeasureType = 'px';
      switch (matches[2]) {
        case 'px':
          measureType = 'px';
          break;
        case '%':
          measureType = '%';
          break;
        case 'rem':
          measureType = 'rem';
          break;
        case 'em':
          measureType = 'em';
          break;
      }
      return new Measure(Number(matches[1]), measureType);
    } else {
      throw Error(`Invalid Measurement: ${cleanString}`)
    }
  }
}
export class Color {
  r: number;
  g: number;
  b: number;
  a: number;

  constructor(r: number, g: number, b: number, a: number) {
    this.r = Math.floor(r) > 255 ? 255 : Math.floor(r);
    this.g = Math.floor(g) > 255 ? 255 : Math.floor(g);
    this.b = Math.floor(b) > 255 ? 255 : Math.floor(b);
    this.a = Math.floor(a) > 255 ? 255 : Math.floor(a);
  }

  public static async rgba(r: number, g: number, b: number, a: number): Promise<Color> {
    return new Color(r, g, b, a);
  }

  public static async rgb(r: number, g: number, b: number): Promise<Color> {
    return await Color.rgba(r, g, b, 255);
  }

  public static async fromString(colorString: string): Promise<Color> {
    let stringClear : string = (colorString ?? '').trim();
    if (stringClear.length <= 0) {
      return this.rgba(255, 255, 255, 0);
    }
    if (stringClear.match(/^#?(?:[0-9a-fA-F]{2}){3,4}$/g)) {
      stringClear = stringClear.replace('#', '');
      const separatedHex: string[] =[];
      separatedHex.push(stringClear.substring(0, 2));
      separatedHex.push(stringClear.substring(2, 4));
      separatedHex.push(stringClear.substring(4, 6));
      if (stringClear.match(/^(?:[0-9a-fA-F]{2}){4}$/g)) {
        separatedHex.push(stringClear.substring(6, 8));
      } else {
        separatedHex.push('FF');
      }
      return this.rgba(parseInt(separatedHex[0], 16), parseInt(separatedHex[1], 16), parseInt(separatedHex[2], 16), parseInt(separatedHex[3], 16));
    }
    throw Error(`Invalid color ${stringClear}`)
  }
}
