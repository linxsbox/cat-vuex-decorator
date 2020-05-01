
type params = string | string[] | {[key: string]: string};

/**
 * 
 * @param options string | string[] | {[key: string]: string}
 * @param namespace modules namespace
 */
export declare function Getters(options: params, namespace?: string): any;

/**
 * 
 * @param options string | string[] | {[key: string]: string}
 * @param namespace modules namespace
 */
export declare function Commits(options: params, namespace?: string): any;

/**
 * 
 * @param options string | string[] | {[key: string]: string}
 * @param namespace modules namespace
 */
export declare function Actions(options: params, namespace?: string): any;
