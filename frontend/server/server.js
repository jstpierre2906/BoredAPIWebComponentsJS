const express = require("express");
const path = require("path");

const host = "127.0.0.1";
const port = 9001;

const app = express();

// STATIC FILES ---------------------------------------------------------------
app.use("/", express.static(path.join(__dirname, "../public")));
app.listen(port, host, () => console.log(`Server started at ${host}:${port}, ${new Date()}`));
