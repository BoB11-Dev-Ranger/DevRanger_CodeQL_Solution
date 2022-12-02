import express, { Request, Response } from "express";

const app = express();

type Data = {
	name: string;
	age: number;
	url: string;
}

const sendData: Data = {
	name: "Kahl",
	age: 8,
	url: "tistory.com"
};

app.get("/get", (req: Request, res: Response) => {
	res.send(sendData);
});

app.listen(8000);
console.log("8000 listen");
