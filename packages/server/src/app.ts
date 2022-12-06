import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import v1Router from "./api/v1";
import cors from "cors";
let corsOptions = {
  origin: "*", // 출처 허용 옵션
  credential: true, // 사용자 인증이 필요한 리소스(쿠키 ..등) 접근
};
const app = express();
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use("/v1", v1Router);

app.listen(8000);
console.log("8000 listen");
