import express, {Request, Response} from "express";
import upload from "./upload";

const router = express.Router();

router.get('/',(req:Request, res:Response)=>{
    res.send({
        status: "success",
        msg: "success"
    })
})
router.post('/upload',upload);

export default router;