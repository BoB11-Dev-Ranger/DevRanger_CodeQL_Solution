import { Request, Response } from "express";
import util from "util";
import child_process from "child_process";

const DB_PATH = "/home/ubuntu/CodeQL-Service/codeql-db/";
const UPLOAD_PATH = "/home/ubuntu/CodeQL-Service/uploads/";
const exec = util.promisify(child_process.exec);

async function createDB(dirname: string) {
  try {
    const { stdout, stderr } = await exec(
        'codeql database create --language=javascript ' + DB_PATH + dirname + " --source-root " + UPLOAD_PATH + dirname
    );
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
    return true;
  } catch (e) {
    throw e;
  }
}

const codeql = (req: Request, res: Response) => {
    let dirname = req.body.dirname; // dirname
    createDB(dirname)
    .then((r)=>{
        console.log(r);
        res.send({
            status: true,
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