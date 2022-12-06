import { Request, Response } from "express";
import { set_status } from "./status";
import child_process from "child_process";
import connecting from "../../../db_con";
import { QueryError, RowDataPacket } from "mysql2";

const DB_PATH = "/home/ubuntu/CodeQL-Service/codeql-db/";
const UPLOAD_PATH = "/home/ubuntu/CodeQL-Service/uploads/";
const spawn = child_process.spawn;
const db_con = connecting();

async function createDB(dirname: string) {
  try {
    const spawn_obj = await spawn(
        'codeql database create --language=javascript ' + DB_PATH + dirname + " --source-root " + UPLOAD_PATH + dirname,
        {
          shell: true,
        }
    );
    return spawn_obj;
  } catch (e) {
    throw e;
  }
}

const codeql_create = (req: Request, res: Response) => {
    let headers = req.headers;
    console.log(headers['token']);
    if(typeof headers['token'] == 'undefined'){
      res.status(401).send({
        status:"fail",
        msg: "token is needed"
      })
      return;
    }
    db_con.query('select * from create_status where token=\''+headers['token']+'\'',
        (err:QueryError, rows:RowDataPacket) => {
            if(rows[0] != undefined && rows[0].status == 1){
              res.status(401).send({
                status: "fail",
                msg: "You are already creating codeql-db now. wait for a sec"
              })
            }
            else {
              let dirname = req.body.dirname; // dirname
              createDB(dirname)
              .then((result)=>{
                  set_status('create_db', 1, headers['token']);
                  res.send({
                      status: true,
                      pid: result.pid?.toString(),
                      msg: "DB creating success"
                  })
              })
              .catch((e)=>{
                console.log(e);
                res.status(400).send({
                    status: false,
                    msg: "DB creating Fail"
                })
              })
            }
        }
    )
    
}

export default codeql_create;