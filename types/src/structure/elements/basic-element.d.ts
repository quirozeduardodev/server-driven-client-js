import { BasicAttributes } from "./attributes/basic-attributes";
import { BasicEvents } from "./events/basic-events";
export declare type ElementType = 'unknown' | 'server-driven' | 'form' | 'column' | 'row' | 'signaturePad' | 'textField' | 'text' | 'datePicker' | 'timePicker' | 'dropdown' | 'tagEditor' | 'button' | 'imagePicker' | 'checkbox' | 'switch';
export interface BasicElement<TAttributes extends BasicAttributes, TEvents extends BasicEvents> {
    attributes: TAttributes | null;
    events: TEvents | null;
    type: ElementType;
}
