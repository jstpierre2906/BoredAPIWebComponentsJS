const utils = {
  shouldBeLogged: (LOG_JS_FILES, request) => {
    const evalFile = () => {
      if (request.url === "/") {
        return "IS_ROOT";
      }
      if (request.url.endsWith(".html")) {
        return "IS_HTML_FILE";
      }
      if (
        LOG_JS_FILES &&
        false === /(templates|model)/.test(request.url) &&
        true === /components\/[a-z-]+\/[a-z-]+\.js$/.test(request.url)
      ) {
        return "IS_JS_FILE_AND_SHOULD_BE_LOGGED";
      }
      return "DO_NOT_LOG";
    };
    switch (evalFile()) {
      case "IS_ROOT":
      case "IS_HTML_FILE":
      case "IS_JS_FILE_AND_SHOULD_BE_LOGGED":
        return true;
      case "DO_NOT_LOG":
        return false;
    }
  },
};

module.exports = utils;
