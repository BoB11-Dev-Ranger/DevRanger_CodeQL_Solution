import { Request, Response } from "express";
import { set_status } from "./status";
import child_process from "child_process";

const QL_DIR = "/bin/codeql-repo/javascript/ql/src/myql/";
const DB_PATH = "/home/ubuntu/CodeQL-Service/codeql-db/";
const CSV_PATH = "/home/ubuntu/CodeQL-Service/csvs/"
const spawn = child_process.spawn;

async function analysisDB(dirname: string) {
    /* 총 5개의 쿼리를 돌리면서 상태업데이트를 해야함 */
    try {
        const spawn_obj = await spawn(
            'codeql database analyze '+ DB_PATH + dirname +
            ' ' + QL_DIR + 'findContainerXSSbasedonHTML.ql' +
            ' --format=csv --output='+CSV_PATH + dirname+'.csv'
        );
        return spawn_obj;
    } catch (e) {
        throw e;
    }
}
const codeql_analysis = (req: Request, res: Response) => {
    let dirname = req.body.dirname; // dirname
    analysisDB(dirname)
    .then((r)=>{
        res.send({
            status: true,
            pid: r.pid?.toString(),
            msg: 'Temp Success'
        })
    })
    .catch((e)=>{
        console.log(e);
        res.status(400).send({
            status: false,
            msg: "DB analysis Fail"
        })
    })
}

export default codeql_analysis;