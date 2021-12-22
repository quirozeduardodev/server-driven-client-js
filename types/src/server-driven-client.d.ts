import { Observable } from "rxjs";
export declare class ServerDrivenClient {
    private readonly _xml;
    private readonly _controllerScript;
    private readonly _className;
    private readonly _scripts;
    private _controllerInstance;
    constructor(xml: string | null, controllerScript: string | null, className: string | null, scripts?: string[]);
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
