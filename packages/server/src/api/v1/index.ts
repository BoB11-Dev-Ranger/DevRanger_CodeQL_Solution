import express, {Request, Response} from "express";
import upload from "./controller/upload";

const router = express.Router();

router.get('/',(req:Request, res:Response)=>{
    res.send({
        status: "success",
        msg: "Hello, This is devranger"
    })
})
router.post('/upload',upload);

export default router;