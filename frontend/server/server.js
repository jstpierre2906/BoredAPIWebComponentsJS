const express = require("express");
const path = require("path");

const host = "127.0.0.1";
const port = 8080;

const app = express();
app.use(express.json());

// STATIC FILES ---------------------------------------------------------------
app.use("/", express.static(path.join(__dirname, "../public")));
app.listen(port, host, () => console.log(`Server started at ${host}:${port}, ${new Date()}`));
