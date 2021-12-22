import { BasicElement } from "./basic-element";
import { ButtonAttributes } from "./attributes/button-attributes";
import { ButtonEvents } from "./events/button-events";
import { BasicAttributes } from "./attributes/basic-attributes";
import { BasicEvents } from "./events/basic-events";
export interface ButtonElement extends BasicElement<ButtonAttributes, ButtonEvents> {
    child?: BasicElement<BasicAttributes, BasicEvents>;
}
