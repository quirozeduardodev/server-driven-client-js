import {BasicElement, ElementType} from "./elements/basic-element";
import {AttLTRB, BasicAttributes, Color} from "./elements/attributes/basic-attributes";
import {ElementRaw} from "./types-raw";
import {BasicEvents} from "./elements/events/basic-events";
import {ServerDrivenElement} from "./elements/server-driven.element";
import {ButtonElement} from "./elements/button-element";
import {UnknownElement} from "./elements/unknown-element";
import {RowElement} from "./elements/row-element";
import {ColumnElement} from "./elements/column.element";


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
        type
      };

      switch (type) {
        case 'button':
          break;
        case 'checkbox':
          break;
        case 'column':
          (baseElementStructure as ColumnElement).children = childrenElements;
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
          (baseElementStructure as RowElement).children = childrenElements;
          break;
        case 'server-driven':
          (baseElementStructure as ServerDrivenElement).version = attributes.version ?? '1.0.0';
          (baseElementStructure as ServerDrivenElement).child = childrenElements.length > 0 ? childrenElements[0] : null;
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

}