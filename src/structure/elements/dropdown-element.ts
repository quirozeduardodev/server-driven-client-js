import {BasicElement} from "./basic-element";
import {DropdownAttributes} from "./attributes/dropdown-attributes";
import {DropdownEvents} from "./events/dropdown-events";
import {ElementOption} from "./content/element-option";

export interface DropdownElement extends BasicElement<DropdownAttributes, DropdownEvents>{
    options: ElementOption<any>[];
}