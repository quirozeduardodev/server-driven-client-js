export interface ElementRaw {
    attributes?: any;
    elements: ElementRaw[];
    name: string;
    type: 'element' | 'text';
}
