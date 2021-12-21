import { Observable } from "rxjs";
export declare class ServerDrivenClient {
    private _xml;
    private _controllerJS;
    private _scripts;
    private _controllerInstance;
    constructor(xml: string | null, controllerJS: string | null, scripts?: string[]);
    private _view$;
    get view(): Observable<any | null>;
    cmd(cmd: string): void;
    run(): Promise<void>;
    private _build;
    rebuild(state: {
        [p: string]: any;
    }): void;
    dispose(): void;
}
