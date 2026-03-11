// Extracted from backstage frontend-plugin-api to be compatible with that
export type Path = string;

export type ParamPart<S extends string> = S extends `:${infer Param}` ? Param : never;

export type ParamNames<S extends string> = S extends `${infer Part}/${infer Rest}` ? ParamPart<Part> | ParamNames<Rest> : ParamPart<S>;

export type PathParams<S extends string> = {
    [name in ParamNames<S>]: string;
};
