import { BasicElement } from "./basic-element";
import { UnknownAttributes } from "./attributes/unknown-attributes";
import { UnknownEvents } from "./events/unknown-events";
export interface UnknownElement extends BasicElement<UnknownAttributes, UnknownEvents> {
}
