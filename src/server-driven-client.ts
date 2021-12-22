import {Observable, ReplaySubject} from "rxjs";
import * as Handlebars from "handlebars";
import {Extractor} from "./structure/extractor";
import * as convert from 'xml-js';

export class ServerDrivenClient {

    private readonly _xml: string | null;
    private readonly _controllerScript: string | null;
    private readonly _className: string | null;
    private readonly _scripts: string[];

    private _controllerInstance: any | null = null;

    constructor(xml: string | null, controllerScript: string | null, className: string | null, scripts?: string[]) {
        this._xml = xml;
        this._controllerScript = controllerScript;
        this._className = className;
        this._scripts = scripts ?? [];
        this.run();
    }

    private _view$: ReplaySubject<any | null> = new ReplaySubject<any | null>(1);


    public get view(): Observable<any | null> {
        return this._view$.asObservable();
    }

    public cmd(cmd: string): void {
        const cmdClean = (cmd ?? '').trim();
        if (cmdClean && cmdClean.trim().length > 0) {
            let matches: RegExpMatchArray | null = null;
            if ((matches = cmdClean.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*\((.*)\)$/))) {
                if(matches[2].trim().length <= 0) {
                    // The function has zero parameters just call
                    this._controllerInstance[matches[1]]();
                } else {
                    const allDirtyParams = matches[2].trim().split(',');
                    if (allDirtyParams[0].trim().length <= 0 || allDirtyParams[allDirtyParams.length - 1].trim().length <= 0) {
                        /// Valid
                        throw Error(`Invalid params at: ${matches[0]}`);
                    } else {
                        const finalParams = [];
                        for (const dirtyParam of allDirtyParams) {
                            finalParams.push(eval(dirtyParam));
                        }
                        this._controllerInstance[matches[1]](...finalParams);

                    }
                }
            } else if ((matches = cmdClean.match(/^([a-zA-Z_][a-zA-Z0-9_]*)$/))) {
                /*
                The function doesn't has parameters just call
                 */
                this._controllerInstance[cmdClean]();
            }
        }
    }

    public async run(): Promise<void> {
        let globalScript = '';
        for (const script of this._scripts) {
            globalScript += `${script} `
        }
        if (this._controllerScript && this._xml && this._className) {
            globalScript += ` ${this._controllerScript} `
            this._controllerInstance = await eval(`(function (){${globalScript} return new ${this._className}()})()`);
            this._controllerInstance.setState = (state: { [p: string]: any;}) => {
                this.rebuild(state);
            };
            if(typeof this._controllerInstance?.onInit === 'function') {
                await this._controllerInstance?.onInit();
            }
        }
        await this._build();
    }

    private async _build(): Promise<void> {
        const compile = await Handlebars.compile(this._xml);
        const jsonExtracted = JSON.parse(convert.xml2json(compile(this._controllerInstance ?? {})?? ''));
        const result = await Extractor.extract(jsonExtracted);
        this._view$.next(result ? JSON.parse(JSON.stringify(result)) : null);
    }

    rebuild(state: { [p: string]: any;}) {
        if (this._controllerInstance || state) {
            for (const [key, value] of Object.entries(state)) {
                this._controllerInstance[key] = value;
            }
            this._build();
        }
    }


    public dispose(): void {
        if(typeof this._controllerInstance?.onDestroy === 'function') {
            this._controllerInstance?.onDestroy();
        }
        this._view$.complete();
    }
}