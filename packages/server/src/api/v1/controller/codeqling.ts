import { Request, Response } from "express";
import { set_status } from "./status";
import child_process from "child_process";

const DB_PATH = "/home/ubuntu/CodeQL-Service/codeql-db/";
const UPLOAD_PATH = "/home/ubuntu/CodeQL-Service/uploads/";
const spawn = child_process.spawn;

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

const codeql = (req: Request, res: Response) => {
    let dirname = req.body.dirname; // dirname
    createDB(dirname)
    .then((r)=>{
        set_status(1);
        res.send({
            status: true,
            pid: r.pid?.toString(),
            msg: "DB creating success"
        })
    })
    .catch((e)=>{
        console.log(e);
        res.status(400).send({
            status: false,
            msg: "DB creating false"
        })
    })
}

export default codeql;