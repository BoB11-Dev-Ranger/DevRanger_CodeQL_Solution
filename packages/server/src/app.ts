import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import v1Router from "./api/v1";


const app = express();
app.use(morgan("dev"));
app.use("/v1", v1Router);

app.listen(8000);
console.log("8000 listen");
