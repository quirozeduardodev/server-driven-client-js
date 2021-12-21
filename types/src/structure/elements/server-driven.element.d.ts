import { BasicElement } from "./basic-element";
import { ServerDrivenAttributes } from "./attributes/server-driven-attributes";
import { ServerDrivenEvents } from "./events/server-driven-events";
export interface ServerDrivenElement extends BasicElement<ServerDrivenAttributes, ServerDrivenEvents> {
    child: BasicElement<any, any> | null;
    version: string;
}
