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
    if(typeof req.headers.cookie == 'undefined'){
      res.status(401).send({
        status:"fail",
        msg: "cookie is needed"
      })
      return;
    }
    db_con.query('select * from analysis_status where token=\''+req.headers.cookie+'\'',
        async (err:QueryError, rows:RowDataPacket) => {
            if(rows[0] != undefined && rows[0].status != 0){
              res.status(401).send({
                status: "fail",
                msg: "You are already analyzing codeql-db now. wait for a sec"
              })
            }
            else {
                let dirname = req.body.dirname; // dirname
                await analyzeDB(dirname, 0)
                .catch((e)=>{
                    console.log(e);
                    res.status(400).send({
                        status: false,
                        msg: "DB "+ql[0]+" analysis Fail"
                    })
                });
                await analyzeDB(dirname, 1)
                .catch((e)=>{
                    console.log(e);
                    res.status(400).send({
                        status: false,
                        msg: "DB "+ql[1]+" analysis Fail"
                    })
                });
                await analyzeDB(dirname, 2)
                .catch((e)=>{
                    console.log(e);
                    res.status(400).send({
                        status: false,
                        msg: "DB "+ql[2]+" analysis Fail"
                    })
                });
                await analyzeDB(dirname, 3)
                .catch((e)=>{
                    console.log(e);
                    res.status(400).send({
                        status: false,
                        msg: "DB "+ql[3]+" analysis Fail"
                    })
                });
                await analyzeDB(dirname, 4)
                .catch((e)=>{
                    console.log(e);
                    res.status(400).send({
                        status: false,
                        msg: "DB "+ql[4]+" analysis Fail"
                    })
                });
                await analyzeDB(dirname, 5)
                .catch((e)=>{
                    console.log(e);
                    res.status(400).send({
                        status: false,
                        msg: "DB "+ql[5]+" analysis Fail"
                    })
                });
                await analyzeDB(dirname, 6)
                .catch((e)=>{
                    console.log(e);
                    res.status(400).send({
                        status: false,
                        msg: "DB "+ql[6]+" analysis Fail"
                    })
                });
                res.send({
                    status: "success",
                    msg: "codeql-db analysis is started"
                })
            }
        }
    )
    
}

export default codeql_analyze;