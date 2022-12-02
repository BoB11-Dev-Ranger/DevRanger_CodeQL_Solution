import express, { Request, Response } from "express";
import morgan from "morgan":

const app = express();


app.get("/get", (req: Request, res: Response) => {
	res.send(sendData);
});

app.listen(8000);
console.log("8000 listen");
