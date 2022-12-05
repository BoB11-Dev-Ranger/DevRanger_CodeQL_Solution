import express, {Request, Response} from "express";
import upload from "./controller/upload";
import codeql_create from "./controller/codeql_create";
import codeql_analyze from "./controller/codeql_analysis";
import { get_status } from "./controller/status";
import bodyParser from "body-parser";

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}))
router.get('/',(req:Request, res:Response)=>{
    res.send({
        status: "success",
        msg: "Hello, This is devranger"
    })
})
router.post('/upload',upload);
router.post('/codeql-create',codeql_create);
router.post('/codeql-analyze',codeql_analyze);
router.get('/status',get_status);

export default router;