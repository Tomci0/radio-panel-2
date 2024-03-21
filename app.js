import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { fileURLToPath } from "url";
import noBots from "express-nobots";
import session from "express-session";
import csrf from "csrf";
import passport from "passport";
import flash from "express-flash";
import dotenv from "dotenv";
import cors from "cors";
import { connect } from "./libs/database.js";
import MongoStore from "connect-mongo";
connect();
dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.join(__filename, "../");

app.set("trust proxy", 1);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  }),
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(
  cors({
    origin: "http://localhost:8000",
    credentials: true,
  }),
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// STRATEGIES

import googleStrategy from "./middleware/google.js";

passport.use(googleStrategy);

console.log("Strategies Loaded.");

// DEFAULT VALUES

app.use(function (req, res, next) {
  res.locals.url = req.originalUrl.split("/")[1] || "index";
  res.locals.userdata = req.user || {};
  res.locals.version = process.env.VERSION;
  res.locals.playerUrl = process.env.PlayerURL;

  next();
});

// Engine Setup

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());

app.use(noBots({ block: true }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.disable("x-powered-by");

/*
 *
 *   ROUTES
 *
 */

// INDEX

import indexRouter from "./routes/index/index.js";
import queueRouter from "./routes/index/queue.js";
import requestRouter from "./routes/index/request.js";

app.use("/", indexRouter);
app.use("/queue", queueRouter);
app.use("/request", requestRouter);

// AUTH

import authRouter from "./routes/auth.js";

app.use("/auth", authRouter);

// API

import apiRouter from "./routes/api.js";
app.use("/api", apiRouter);

// ADMIN

import indexAdminRouter from "./routes/admin/index.js";

app.use("/admin", indexAdminRouter);

console.log("Routes Loaded.");

// catch 404 and forward to error handler

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = process.env.VERSION === "PROD" ? err : {};

  res.status(err.status || 500);
  // res.render('error');
  res.json({
    status: err.status || 500,
    message: err.message,
    error: process.env.VERSION === "PROD" ? err : {},
  });
});

import http from "http";
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

// CREATE HTTP SERVER

const server = http.createServer(app);

// LISTEN ON PROVIDED PORT

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

// NORMALIZE PORT

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

// onError

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
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
}

// onListening

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  console.log(
    "\nListening on " +
      bind +
      "\nhttp://localhost:" +
      port +
      "\nVERSION: " +
      process.env.VERSION +
      "\n",
  );
}
