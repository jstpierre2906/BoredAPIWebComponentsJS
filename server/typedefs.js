/** @typedef {function({shouldLogJSFile: boolean, request: Request}): boolean} FileShouldBeLoggedFn */

/** @typedef {function(): "IS_ROOT" | "IS_HTML_FILE" | "IS_JS_FILE_AND_SHOULD_BE_LOGGED" | "DO_NOT_LOG"} EvaluateFileFn */

/** @typedef {function({str: string, request: Request}): string} SetFileLogFn */

/** @typedef {function({str: string, host: string, port: number}): string} SetServerStartLog */
