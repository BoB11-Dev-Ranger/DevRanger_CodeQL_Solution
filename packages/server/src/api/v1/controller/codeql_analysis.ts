import { Request, Response } from "express";
import { set_status } from "./status";
import path from "path";
import child_process from "child_process";
import connecting from "../../../db_con";
import { QueryError, RowDataPacket } from "mysql2";

const QL_DIR = "/bin/codeql-repo/javascript/ql/src/myql/";
const DB_PATH = "/home/ubuntu/CodeQL-Service/codeql-db/";
const CSV_PATH = "/home/ubuntu/CodeQL-Service/csvs/"
const exec = child_process.exec;
const db_con = connecting();
const ql = [
    'findContainerXSSbasedonHTML.ql', 
    'findVulnNodeIntegration.ql', 
    'findXSSbasedonTemplate.ql',
    'findDangrousHTMLinReact.ql',
    'findVulnNodeIntegrationSubFrames.ql',
    'findVulnContextIsolation.ql',
    'findVulnSandbox.ql'
]

async function analyzeDB(dirname: string, ql_num: number) {
    /* 총 5개의 쿼리를 돌리면서 상태업데이트를 해야함 */
    try {
        let ql_name = ql[ql_num].split(path.extname(ql[ql_num]))[0];
        const exec_obj = await exec(
            'codeql database analyze '+ DB_PATH + dirname +
            ' ' + QL_DIR + ql[ql_num] +
            ' --format=csv --output='+ CSV_PATH + dirname + '_' + ql_name +'.csv'
        );
        return exec_obj;
    } catch (e) {
        throw e;
    }
}
const codeql_analyze = async (req: Request, res: Response) => {
    let headers = req.headers;
    console.log(headers['token']);
    if(typeof headers['token'] == 'undefined'){
      res.status(401).send({
        status:"fail",
        msg: "token is needed"
      })
      return;
    }
    db_con.query('select * from analysis_status where token=\''+headers['token']+'\'',
        async (err:QueryError, rows:RowDataPacket) => {
            let dirname = req.body.dirname; // dirname
            if(typeof req.body.ql_num != 'number'){
                res.status(400).send({
                    status: "fail",
                    msg: "Invalid Query Num"
                })
            }
            else{
                await analyzeDB(dirname, req.body.ql_num)
                .catch((e)=>{
                    console.log(e);
                    res.status(400).send({
                        status: false,
                        msg: "DB "+ql[0]+" analysis Fail"
                    })
                });
                set_status('analysis_db', 1, headers['token']);
                res.send({
                    status: "success",
                    msg: "codeql-db analysis is started"
                })
            }
            // await analyzeDB(dirname, 1)
            // .catch((e)=>{
            //     console.log(e);
            //     res.status(400).send({
            //         status: false,
            //         msg: "DB "+ql[1]+" analysis Fail"
            //     })
            // });
            // await analyzeDB(dirname, 2)
            // .catch((e)=>{
            //     console.log(e);
            //     res.status(400).send({
            //         status: false,
            //         msg: "DB "+ql[2]+" analysis Fail"
            //     })
            // });
            // await analyzeDB(dirname, 3)
            // .catch((e)=>{
            //     console.log(e);
            //     res.status(400).send({
            //         status: false,
            //         msg: "DB "+ql[3]+" analysis Fail"
            //     })
            // });
            // await analyzeDB(dirname, 4)
            // .catch((e)=>{
            //     console.log(e);
            //     res.status(400).send({
            //         status: false,
            //         msg: "DB "+ql[4]+" analysis Fail"
            //     })
            // });
            // await analyzeDB(dirname, 5)
            // .catch((e)=>{
            //     console.log(e);
            //     res.status(400).send({
            //         status: false,
            //         msg: "DB "+ql[5]+" analysis Fail"
            //     })
            // });
            // await analyzeDB(dirname, 6)
            // .catch((e)=>{
            //     console.log(e);
            //     res.status(400).send({
            //         status: false,
            //         msg: "DB "+ql[6]+" analysis Fail"
            //     })
            // });
            }
    )
    
}

export default codeql_analyze;