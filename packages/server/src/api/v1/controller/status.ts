import {Request, Response} from "express";
import child_process from "child_process";
import connecting from "../../../db_con";
import { QueryError, RowDataPacket } from "mysql2";

const execSync = child_process.execSync;
const db_con = connecting();

export const set_status = (mod: string, num:number, token: string[]|string|undefined) => {
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
        db_con.query('select * from analysis_status where token=\''+token+'\'',(err:QueryError, res:RowDataPacket)=>{
            if(res[0] == undefined){
                db_con.query('insert into analysis_status(token,status) values (\''+token+'\',1)',
                    (err2, res2)=>{
                        if(err)
                            throw err;
                    }
                )
            } else {
                db_con.query('update analysis_status set status='+((res[0].status)+1)+' where token=\''+token+'\'',
                    (err2:QueryError, res2:RowDataPacket)=>{
                        if(err)
                            throw err;
                    }
                )
            }
        }); 
    }
}

export const get_status = (req:Request, res:Response) => {
    let headers = req.headers;
    /* create db process ์ ์์กด ์ฌ๋ถ */
    if(req.query.mod == "create_db"){
        if(typeof Number(req.query.pid) == 'number'){
            let process_res = execSync('ps -ef | grep ' + req.query.pid);
            if(process_res.toString().length - process_res.toString().replaceAll('\n','').length <= 2){
                db_con.query('update create_status set status=0 where token=\''+headers['token']+'\'',
                    (err, result)=>{
                        if(err){
                            res.status(400).send({
                                status: "fail",
                                msg: "db query error"
                            })
                            throw err;
                        }
                        /* codeql-db ์์ฑ ์ฑ๊ณต */
                        res.send({
                            status: 'success',
                            msg: 'create codeql-db success'
                        })
                    }
                )
            }
            else{
                /* ์์ฑ ์งํ์ค */
                res.send({
                    status: 'creating',
                    msg: 'create codeql-db is creating'
                })
            }
        }
        else{
            /* ์๋ชป๋ PID */
            res.status(400).send({
                status: 'false',
                msg: 'Invalid PID'
            })
        }
    }
    else if(req.query.mod == "analysis_db"){
        /* analysis ๋ถ๊ฐํ? ์ ์๋ ๋ก์ง */
        let process_res = execSync('ps -ef | grep analyze');
        let process_cnt = process_res.toString().length - process_res.toString().replaceAll('\n','').length;
        if( process_cnt <= 2){
            db_con.query('select * from analysis_status where token=\''+headers['token']+'\'',
                (err1:QueryError, result1: RowDataPacket) => {
                    if(err1){
                        res.status(400).send({
                            status: "fail",
                            msg: "db query error"
                        })
                    }
                    if(result1[0].status === 7){
                        db_con.query('update analysis_status set status=0 where token=\''+headers['token']+'\'',
                            (err, result)=>{
                                if(err){
                                    res.status(400).send({
                                        status: "fail",
                                        msg: "db query error"
                                    })
                                    throw err;
                                }
                                /* codeql-db ๋ถ์ ์ฑ๊ณต */
                                res.send({
                                    status: 'success',
                                    msg: 'analysis codeql-db success'
                                })
                            }
                        )
                    }
                    else{
                        res.send({
                            status: 'next',
                            msg: 'analysis codeql-db success'
                        })
                    }
                }
            )
            
        }
        else{
            /* ์์ฑ ์งํ์ค */
            res.send({
                status: 'analyzing',
                msg: 0
            });
            
        }
    }
}