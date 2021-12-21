import {BasicElement, ElementType} from "./elements/basic-element";
import {AttLTRB, BasicAttributes, Color} from "./elements/attributes/basic-attributes";
import {ElementRaw} from "./types-raw";
import {BasicEvents} from "./elements/events/basic-events";
import {ServerDrivenElement} from "./elements/server-driven.element";
import {ButtonElement} from "./elements/button-element";


type RegistryBuilder = {nameMatch: string, type: ElementType};

export class Extractor {

  public static registry: RegistryBuilder[] = [
    {
      nameMatch: 'Button|button',
      type: 'button'
    },
    {
      nameMatch: 'Column|column',
      type: 'column'
    },
    {
      nameMatch: 'ServerDriven|server-driven',
      type: 'server-driven'
    }
  ];

  public static async extract(root: {elements?: ElementRaw[]} | null): Promise<BasicElement<BasicAttributes, BasicEvents> | null> {
    return root && root.elements ? (root.elements.length > 0 ? await Extractor._extract(root.elements[0]) : null) : null;
  }


  private static async _extract(elementRaw: ElementRaw): Promise<BasicElement<BasicAttributes, BasicEvents>> {
    const idx = Extractor.registry.findIndex(value => elementRaw.name.match(value.nameMatch));
    if (idx >= 0) {

      const type = Extractor.registry[idx].type;
      const attributes = elementRaw.attributes ?? {};

      /*
        Extract all events
      */
      const onClick = attributes.onClick ?? null;
      const onLongPress = attributes.onLongPress ?? null;
      const onChange = attributes.onChange ?? null;
      const onMouseEnter = attributes.onMouseEnter ?? null;
      const onMouseLeave = attributes.onMouseLeave ?? null;

      const margin = await AttLTRB.fromString(attributes.margin ?? '0px');
      const padding = await AttLTRB.fromString(attributes.padding ?? '0px');
      const backgroundColor = await Color.fromString(attributes.backgroundColor ?? '');

      const children = elementRaw.elements ?? [];

      const childrenElements: BasicElement<BasicAttributes, BasicEvents>[] = [];

      for (const child of children) {
        await childrenElements.push(await this._extract(child));
      }

      const baseElementStructure = {
        attributes: {
          padding,
          margin,
          backgroundColor
        },
        events: {
          onClick,
          onLongPress,
          onChange,
          onMouseEnter,
          onMouseLeave
        },
        children: childrenElements,
        type
      };

      switch (type) {
        case 'button':
          break;
        case 'checkbox':
          break;
        case 'column':
          break;
        case 'datePicker':
          break;
        case 'dropdown':
          break;
        case 'form':
          break;
        case 'imagePicker':
          break;
        case 'row':
          break;
        case 'server-driven':
          (baseElementStructure as ServerDrivenElement).version = attributes.version ?? '1.0.0';
          break;
        case 'signaturePad':
          break;
        case 'switch':
          break;
        case 'tagEditor':
          break;
        case 'text':
          break;
        case 'textField':
          break;
        case 'timePicker':
          break;
        case 'unknown':
          break;
      }

      return baseElementStructure;
    } else  {
      return {
        type: 'unknown',
        attributes: null,
        events: null,
        children: []
      };
    }
  }

}