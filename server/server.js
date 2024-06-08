const express = require("express");
const path = require("path");

const HOST = "127.0.0.1";
const PORT = 9001;
const ROOT_DIR = path.join(__dirname, "../public");
const LOG_JS_FILES = false;

const app = express();

// STATIC FILES ---------------------------------------------------------------
app.use((request, response, next) => {
  const shouldBeLogged = () => {
    return (
      request.url === "/" ||
      request.url.endsWith(".html") ||
      (LOG_JS_FILES ? request.url.endsWith(".js") : false)
    );
  };
  if (shouldBeLogged()) {
    const str = "{date} - {method} {url}";
    const log = str
      .replace("{date}", new Date().toISOString())
      .replace("{method}", request.method)
      .replace("{url}", request.url);
    console.log(log);
  }
  next();
});
app.use("/", express.static(ROOT_DIR));
app.listen(PORT, HOST, () => {
  const str = "Server started at {host}:{port} - {date}";
  const log = str
    .replace("{host}", HOST)
    .replace("{port}", PORT)
    .replace("{date}", new Date().toISOString());
  console.log(log);
});
