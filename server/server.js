const express = require("express");
const path = require("path");

const { fileShouldBeLogged, setFileLog, setServerStartLog } = require("./utils.js");

const HOST = "localhost";
const PORT = 9001;
const ROOT_DIR = path.join(__dirname, "../public");
const ROOT_PATH = "/";
const LOG_JS_FILES = true;

const app = express();

// STATIC FILES ---------------------------------------------------------------
app.use((request, _response, next) => {
  fileShouldBeLogged({
    shouldLogJSFile: LOG_JS_FILES,
    request: request,
  }) && console.log(setFileLog({ str: "{date} - {method} {url} - {sec-ch-ua}", request }));
  next();
});
app.use(ROOT_PATH, express.static(ROOT_DIR));
app.listen(PORT, HOST, () => {
  console.log(
    setServerStartLog({
      str: "Server started at {host}:{port} - {date}",
      host: HOST,
      port: PORT,
    })
  );
});
