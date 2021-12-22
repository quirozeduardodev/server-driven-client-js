import {BasicElement, ElementType} from "./elements/basic-element";
import {AttLTRB, BasicAttributes, Color} from "./elements/attributes/basic-attributes";
import {ElementRaw} from "./types-raw";
import {BasicEvents} from "./elements/events/basic-events";
import {ServerDrivenElement} from "./elements/server-driven.element";
import {ButtonElement} from "./elements/button-element";
import {UnknownElement} from "./elements/unknown-element";
import {RowElement} from "./elements/row-element";
import {ColumnElement} from "./elements/column.element";
import {TextElement} from "./elements/text-element";
import {ElementOption} from "./elements/content/element-option";
import {DropdownElement} from "./elements/dropdown-element";


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
      nameMatch: 'Checkbox|checkbox|CheckBox|check-box',
      type: 'checkbox'
    },
    {
      nameMatch: 'column',
      type: 'column'
    },
    {
      nameMatch: 'DatePicker|Datepicker|date-picker|datepicker',
      type: 'datePicker'
    },
    {
      nameMatch: 'Dropdown|DropDown|drop-down|dropdown',
      type: 'dropdown'
    },
    {
      nameMatch: 'Form|form',
      type: 'form'
    },
    {
      nameMatch: 'ImagePicker|Imagepicker|image-picker|imagepicker',
      type: 'imagePicker'
    },
    {
      nameMatch: 'Row|row',
      type: 'row'
    },
    {
      nameMatch: 'ServerDriven|server-driven',
      type: 'server-driven'
    },
    {
      nameMatch: 'SignaturePad|Signaturepad|signature-pad|signaturepad',
      type: 'signaturePad'
    },
    {
      nameMatch: 'Switch|switch',
      type: 'switch'
    },
    {
      nameMatch: 'TagEditor|Tageditor|tag-editor|tageditor',
      type: 'tagEditor'
    },
    {
      nameMatch: 'Text|text',
      type: 'text'
    },
    {
      nameMatch: 'TextField|Textfield|text-field|textfield',
      type: 'textField'
    },
    {
      nameMatch: 'TimePicker|Timepicker|time-picker|timepicker',
      type: 'timePicker'
    }
  ];

  public static async extract(root: {elements?: ElementRaw[]} | null): Promise<BasicElement<BasicAttributes, BasicEvents> | null> {
    return root && root.elements ? (root.elements.length > 0 ? await Extractor._extractElement(root.elements[0]) : null) : null;
  }

  private static async _extractElement(elementRaw: ElementRaw): Promise<BasicElement<BasicAttributes, BasicEvents>> {
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
        type
      };

      switch (type) {
        case 'button':
          break;
        case 'checkbox':
          break;
        case 'column':
          (baseElementStructure as ColumnElement).children = await this._extractElements(children);
          break;
        case 'datePicker':
          break;
        case 'dropdown':
          (baseElementStructure as DropdownElement).options = await this._extractOptions(children);
          break;
        case 'form':
          break;
        case 'imagePicker':
          break;
        case 'row':
          (baseElementStructure as RowElement).children = await this._extractElements(children);
          break;
        case 'server-driven':
          (baseElementStructure as ServerDrivenElement).version = attributes.version ?? '1.0.0';
          (baseElementStructure as ServerDrivenElement).child = children.length > 0 ? await this._extractElement(children[0]) : null;
          break;
        case 'signaturePad':
          break;
        case 'switch':
          break;
        case 'tagEditor':
          break;
        case 'text':
          (baseElementStructure as TextElement).text = children.length > 0 ? await this._extractText(children[0]) : '';
          break;
        case 'textField':
          break;
        case 'timePicker':
          break;
        case 'unknown':
          break;
        default:
          /// UNKNOWN ELEMENT ALSO
          break;
      }

      return baseElementStructure;
    } else  {
      return {
        type: 'unknown',
        attributes: null,
        events: null,
        children: []
      } as UnknownElement;
    }
  }

  private static async _extractOptions(elementsRaw: ElementRaw[]): Promise<ElementOption<any>[]> {
    const options: ElementOption<any>[] = [];

    for (const opt of elementsRaw) {
      await options.push(await this._extractOption(opt));
    }
    return options;
  }

  private static async _extractOption(elementRaw: ElementRaw): Promise<ElementOption<any>> {
    if(elementRaw && !elementRaw.name.match('option|Option')) {
      throw Error(`${elementRaw.name} is not a valid option`);
    }
    const attributes = elementRaw.attributes ?? {};
    const children: any[] = elementRaw.elements ?? [];

    return {
      value: attributes.value ?? null,
      label: children.length > 0 ? await this._extractText(children[0]) : (attributes.label ?? '')
    };
  }

  private static async _extractText(elementRaw: ElementRaw): Promise<string> {
    if(elementRaw && !elementRaw.type.match('text')) {
      throw Error(`${elementRaw.type} is not a valid text`);
    }
    return elementRaw?.text ?? '';
  }

  private static async _extractElements(elementsRaw: ElementRaw[]): Promise<BasicElement<BasicAttributes, BasicEvents>[]> {
    const childrenElements: BasicElement<BasicAttributes, BasicEvents>[] = [];

    for (const child of elementsRaw) {
      await childrenElements.push(await this._extractElement(child));
    }
    return childrenElements;
  }
}