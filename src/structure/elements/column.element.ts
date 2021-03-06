import {BasicElement} from "./basic-element";
import {ColumnAttributes} from "./attributes/column-attributes";
import {ColumnEvents} from "./events/column-events";
import {BasicAttributes} from "./attributes/basic-attributes";
import {BasicEvents} from "./events/basic-events";

export interface ColumnElement extends BasicElement<ColumnAttributes, ColumnEvents>{
    children: BasicElement<BasicAttributes, BasicEvents>[];
}
