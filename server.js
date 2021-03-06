const path = require("path");
const http = require("http");
const logger = require("morgan");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const debug = require("debug")("testing_npm_package:server");
const express = require("express");

const app = express();
const server = http.createServer(app);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "dist/"));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, "dist")));
app.use(
    session({
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false },
        secret: "testing_npm_package-secret"
    })
);

app.get(["/", "/*"], function (req, res) {
    return res.render("public");
});

// TODO: Setup additional routes

// Server setup
const port = (function (val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) return val;
    if (port >= 0) return port;
    return false;
})(process.env.PORT || "3000");

app.set("port", port);

server.on("listening", function () {
    const addr = server.address();
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    debug("Listening on " + bind);
    console.log("Listening on " + bind);
});

server.on("error", function (error) {
    if (error.syscall !== "listen") throw error;
    const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
});

server.listen(port);
