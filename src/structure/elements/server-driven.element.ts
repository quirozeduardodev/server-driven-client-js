import {BasicElement} from "./basic-element";
import {ServerDrivenAttributes} from "./attributes/server-driven-attributes";
import {ServerDrivenEvents} from "./events/server-driven-events";
import {BasicAttributes} from "./attributes/basic-attributes";
import {BasicEvents} from "./events/basic-events";

export interface ServerDrivenElement extends BasicElement<ServerDrivenAttributes, ServerDrivenEvents> {
    child: BasicElement<any, any> | null;
    version: string;
}
