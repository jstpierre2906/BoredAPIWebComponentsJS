require("./typedefs.js");

const utils = {
  /** @type {FileShouldBeLoggedFn} */
  fileShouldBeLogged: ({ shouldLogJSFile, request }) => {
    /** @type {EvaluateFileFn} */
    const evaluateFile = () => {
      if (request.url === "/") {
        return "IS_ROOT";
      }
      if (request.url.endsWith(".html")) {
        return "IS_HTML_FILE";
      }
      if (
        shouldLogJSFile &&
        false === /(templates|model)/.test(request.url) &&
        true === /components\/[a-z-]+\/[a-z-]+\.js$/.test(request.url)
      ) {
        return "IS_JS_FILE_AND_SHOULD_BE_LOGGED";
      }
      return "DO_NOT_LOG";
    };
    const evaluated = evaluateFile();
    switch (evaluated) {
      case "IS_ROOT":
      case "IS_HTML_FILE":
      case "IS_JS_FILE_AND_SHOULD_BE_LOGGED":
        return true;
      case "DO_NOT_LOG":
        return false;
    }
  },

  /** @type {SetFileLogFn} */
  setFileLog: ({ str, request }) => {
    return str
      .replace("{date}", new Date().toISOString())
      .replace("{method}", request.method)
      .replace("{url}", request.url)
      .replace("{sec-ch-ua}", request.headers["sec-ch-ua"] ?? "");
  },

  /** @type {SetServerStartLog} */
  setServerStartLog: ({ str, host, port }) => {
    return str
      .replace("{host}", host)
      .replace("{port}", port)
      .replace("{date}", new Date().toISOString());
  },
};

module.exports = utils;
