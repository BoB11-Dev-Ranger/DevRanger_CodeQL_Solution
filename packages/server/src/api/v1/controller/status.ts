import {Request, Response} from "express";
import child_process from "child_process";

let codeql_status = 0;

const execSync = child_process.execSync;

export const set_status = (num:number) => {
    codeql_status = num;
}

export const get_status = (req:Request, res:Response) => {
    /* create db process 의 생존 여부 */
    if(req.query.mod == "create_db"){
        if(typeof Number(req.query.pid) == 'number'){
            let process_res = execSync('ps -ef | grep ' + req.query.pid);
            if(process_res.toString().length - process_res.toString().replaceAll('\n','').length <= 2)
                codeql_status = 0;
        }
        else{
            res.status(400).send({
                status: 'false',
                msg: 'Invalid PID'
            })

        }
    }
    res.send({
        status: 'success',
        msg: codeql_status
    })
}