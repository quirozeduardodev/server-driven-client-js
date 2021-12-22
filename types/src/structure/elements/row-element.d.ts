import { BasicElement } from "./basic-element";
import { RowAttributes } from "./attributes/row-attributes";
import { RowEvents } from "./events/row-events";
import { BasicAttributes } from "./attributes/basic-attributes";
import { BasicEvents } from "./events/basic-events";
export interface RowElement extends BasicElement<RowAttributes, RowEvents> {
    children: BasicElement<BasicAttributes, BasicEvents>[];
}
