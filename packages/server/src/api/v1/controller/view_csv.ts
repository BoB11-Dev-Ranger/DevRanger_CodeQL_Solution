import { Request, Response } from "express";

const view_csv = (req: Request, res: Response) => {
    res.send({
        status: "success",
        msg: req.query.dirname
    })
}

export default view_csv;