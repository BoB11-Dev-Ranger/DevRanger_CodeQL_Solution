import {Request, Response} from "express";
import child_process from "child_process";
import connecting from "../../../db_con";
import { QueryError, RowDataPacket } from "mysql2";

const execSync = child_process.execSync;
const db_con = connecting();

export const set_status = (mod: string, num:number, token: string|undefined) => {
    if(mod == 'create_db'){
        db_con.query('select * from create_status where token=\''+token+'\'',(err:QueryError, res:RowDataPacket)=>{
            if(res[0] == undefined){
                db_con.query('insert into create_status(token,status) values (\''+token+'\',1)',
                    (err2, res2)=>{
                        if(err)
                            throw err;
                    }
                )
            } else {
                db_con.query('update create_status set status=1 where token=\''+token+'\'',
                    (err2:QueryError, res2:RowDataPacket)=>{
                        if(err)
                            throw err;
                    }
                )
            }
        });  
    }
    else if(mod == 'analysis_db'){
        db_con.query('insert into analysis_status(token,status) values (\''+token+'\',1)',
            (err, res)=>{
                if(err)
                    throw err;
                console.log(res);
            }
        ) 
    }
}

export const get_status = (req:Request, res:Response) => {
    /* create db process 의 생존 여부 */
    if(req.query.mod == "create_db"){
        if(typeof Number(req.query.pid) == 'number'){
            let process_res = execSync('ps -ef | grep ' + req.query.pid);
            if(process_res.toString().length - process_res.toString().replaceAll('\n','').length <= 2){
                db_con.query('update create_status set status=0 where token=\''+req.headers.cookie+'\'',
                    (err, result)=>{
                        if(err){
                            res.status(400).send({
                                status: "fail",
                                msg: "db query error"
                            })
                            throw err;
                        }
                        /* codeql-db 생성 성공 */
                        res.send({
                            status: 'success',
                            msg: 'create codeql-db success'
                        })
                    }
                )
            }
            else{
                /* 생성 진행중 */
                res.send({
                    status: 'creating',
                    msg: 'create codeql-db is creating'
                })
            }
        }
        else{
            /* 잘못된 PID */
            res.status(400).send({
                status: 'false',
                msg: 'Invalid PID'
            })
        }
    }
    else if(req.query.mod == "analysis_db"){
        if(typeof Number(req.query.pid) == 'number'){
            /* analysis 분간할 수 있는 로직 */
            let process_res = execSync('ps -ef | grep ' + req.query.pid);
            if(process_res.toString().length - process_res.toString().replaceAll('\n','').length <= 2){
                db_con.query('update analysis_status set status=0 where token=\''+req.headers.cookie+'\'',
                    (err, result)=>{
                        if(err){
                            res.status(400).send({
                                status: "fail",
                                msg: "db query error"
                            })
                            throw err;
                        }
                        /* codeql-db 분석 성공 */
                        res.send({
                            status: 'success',
                            msg: 'analysis codeql-db success'
                        })
                    }
                )
            }
            else{
                /* 생성 진행중 */
                res.send({
                    status: 'analysizing',
                    msg: 'analysis codeql-db is creating'
                })
            }
        }
        else{
            res.status(400).send({
                status: 'false',
                msg: 'Invalid PID'
            })
        }
    }
}