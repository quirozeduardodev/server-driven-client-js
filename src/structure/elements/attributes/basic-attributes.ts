export interface BasicAttributes {
  padding: AttLTRB;
  margin: AttLTRB;
  width?: Measure;
  height?: Measure;
  backgroundColor?: Color;
  border?: BorderLTBR;
}
export type MeasureType = 'px' | '%' | 'em' | 'rem';
export class AttLTRB {
  public left: Measure;
  public top: Measure;
  public right: Measure;
  public bottom: Measure;

  constructor(left?: Measure, top?: Measure, right?: Measure, bottom?: Measure) {
    this.left = left ?? Measure.zero();
    this.top = top ?? Measure.zero();
    this.right = right ?? Measure.zero();
    this.bottom = bottom ?? Measure.zero();
  }

  public static symmetricVertical(measure: Measure): AttLTRB {
    return new AttLTRB(Measure.zero(), measure, Measure.zero(), measure);
  }

  public static symmetricHorizontal(measure: Measure): AttLTRB {
    return new AttLTRB(measure, Measure.zero(), measure, Measure.zero());
  }

  public static symmetric(vertical: Measure, horizontal: Measure): AttLTRB {
    return new AttLTRB(horizontal, vertical, horizontal, vertical);
  }

  public static zero(): AttLTRB {
    return new AttLTRB();
  }

  public static all(measure: Measure): AttLTRB {
    return new AttLTRB(measure, measure, measure, measure);
  }

  public static ltrb(left?: Measure, top?: Measure, right?: Measure, bottom?: Measure): AttLTRB {
    return new AttLTRB(left, top, right, bottom);
  }

  public static async fromString(str: string): Promise<AttLTRB> {
    const cleanString: string = str ? str.trim() : '';

    if(cleanString.length <= 0) {
      return AttLTRB.zero();
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

  public static zero(): Measure {
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

  public static rgba(r: number, g: number, b: number, a: number): Color {
    return new Color(r, g, b, a);
  }

  public static rgb(r: number, g: number, b: number): Color {
    return Color.rgba(r, g, b, 255);
  }

  public static transparent(): Color {
    return Color.rgba(0, 0, 0, 0);
  }

  public static async fromString(colorString: string): Promise<Color> {
    let cleanString : string = (colorString ?? '').trim();
    if (cleanString.length <= 0) {
      return this.rgba(255, 255, 255, 0);
    }
    if (cleanString.match(/^#?(?:[0-9a-fA-F]{2}){3,4}$/g)) {
      cleanString = cleanString.replace('#', '');
      const separatedHex: string[] =[];
      separatedHex.push(cleanString.substring(0, 2));
      separatedHex.push(cleanString.substring(2, 4));
      separatedHex.push(cleanString.substring(4, 6));
      if (cleanString.match(/^(?:[0-9a-fA-F]{2}){4}$/g)) {
        separatedHex.push(cleanString.substring(6, 8));
      } else {
        separatedHex.push('FF');
      }
      return this.rgba(parseInt(separatedHex[0], 16), parseInt(separatedHex[1], 16), parseInt(separatedHex[2], 16), parseInt(separatedHex[3], 16));
    }
    throw Error(`Invalid color ${cleanString}`)
  }
}

export class BorderLTBR {
  public left: Border;
  public top: Border;
  public right: Border;
  public bottom: Border;
  public radius: BorderRadius;


  constructor(left?: Border, top?: Border, right?: Border, bottom?: Border, radius?: BorderRadius) {
    this.left = left ?? new Border();
    this.top = top ?? new Border();
    this.right = right ?? new Border();
    this.bottom = bottom ?? new Border();
    this.radius = radius ?? new BorderRadius();
  }
}

export class Border {
  style: 'none' | 'solid' | 'dashed' | 'dotted';
  width: Measure;
  color: Color;

  constructor(width?: Measure, style?: "none" | "solid" | "dashed" | "dotted", color?: Color) {
    this.width = width ?? Measure.zero();
    this.style = style ?? 'none';
    this.color = color ?? Color.transparent();
  }

  public static async fromString(colorString: string): Promise<Border> {
    let cleanString : string = (colorString ?? '').trim();
    if (cleanString.length <= 0) {
      return new Border();
    }
    const stringSplit: string[] = cleanString.split(/\s+/g);
    if ([2, 3].includes(stringSplit.length)) {
      const width = await Measure.fromString(stringSplit[0]);
      if (!stringSplit[1].trim().match(/^(?:none|solid|dashed|dotted)$/)) {
        throw Error("Invalid type of border must be one of these: none, solid, dashed, dotted")
      }
      const type = stringSplit[1] as 'none' | 'solid' | 'dashed' | 'dotted';
      const color = stringSplit.length == 3 ? await Color.fromString(stringSplit[2]) : Color.transparent();
      return new Border(width, type, color);
    }
    throw Error(`Invalid border definition at ${stringSplit}`)
  }
}
export class BorderRadius {
  public topLeft: Measure;
  public topRight: Measure;
  public bottomLeft: Measure;
  public bottomRight: Measure;

  constructor(topLeft?: Measure, topRight?: Measure, bottomRight?: Measure, bottomLeft?: Measure) {
    this.topLeft = topLeft ?? Measure.zero();
    this.topRight = topRight ?? Measure.zero();
    this.bottomRight = bottomRight ?? Measure.zero();
    this.bottomLeft = bottomLeft ?? Measure.zero();
  }

  public static symmetricTop(measure: Measure): BorderRadius {
    return new BorderRadius(measure, measure, Measure.zero(), Measure.zero());
  }

  public static symmetricBottom(measure: Measure): BorderRadius {
    return new BorderRadius(Measure.zero(), Measure.zero(), measure, measure);
  }

  public static symmetric(top: Measure, bottom: Measure): BorderRadius {
    return new BorderRadius(top, top, bottom, bottom);
  }

  public static zero(): BorderRadius {
    return new BorderRadius();
  }

  public static all(measure: Measure): BorderRadius {
    return new BorderRadius(measure, measure, measure, measure);
  }

  public static async fromString(str: string): Promise<BorderRadius> {
    const cleanString: string = str ? str.trim() : '';

    if(cleanString.length <= 0) {
      return BorderRadius.zero();
    }
    const measurements: Measure[] = [];
    for (const string of cleanString.split(/\s+/g)) {
      measurements.push(await Measure.fromString(string));
    }

    if (![1, 2, 3, 4].includes(measurements.length)) {
      throw Error(`Invalid number of Measurements: ${cleanString}`);
    }

    if (measurements.length === 4) {
      return new BorderRadius(measurements[0], measurements[1], measurements[2], measurements[3]);
    } else if (measurements.length === 3) {
      return new BorderRadius(measurements[0], measurements[1], measurements[2], measurements[1]);
    } else if (measurements.length === 2) {
      return new BorderRadius(measurements[0], measurements[1], measurements[0], measurements[1]);
    } else {
      return BorderRadius.all(measurements[0]);
    }
  }
}