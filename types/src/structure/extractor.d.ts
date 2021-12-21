import { BasicElement, ElementType } from "./elements/basic-element";
import { BasicAttributes } from "./elements/attributes/basic-attributes";
import { ElementRaw } from "./types-raw";
import { BasicEvents } from "./elements/events/basic-events";
declare type RegistryBuilder = {
    nameMatch: string;
    type: ElementType;
};
export declare class Extractor {
    static registry: RegistryBuilder[];
    static extract(root: {
        elements?: ElementRaw[];
    } | null): Promise<BasicElement<BasicAttributes, BasicEvents> | null>;
    private static _extract;
}
export {};
