export interface ElementRaw {
    attributes?: any;
    elements: ElementRaw[];
    name: string;
    text?: string;
    type: 'element' | 'text';
}
