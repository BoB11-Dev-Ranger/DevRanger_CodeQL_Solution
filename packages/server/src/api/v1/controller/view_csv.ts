import { Request, Response } from "express";
import fs from 'fs';

interface CSV_DATA_JSON {
    description: string;
    warn: string;
    subject: string;
    source: string;
    line: string;
}
const CSV_DIR = "/home/ubuntu/CodeQL-Service/csvs"

const view_csv = (req: Request, res: Response) => {
    let csv_files:Array<string> = [];
    let csv_data:Array<CSV_DATA_JSON|JSON> = [];
    let dirname:string = "";
    if(typeof req.query.dirname === 'string'){
        dirname = req.query.dirname;
        fs.readdirSync(CSV_DIR, {withFileTypes: true})
        .filter(item => !item.isDirectory())
        .map(item => {
            if(item.name.includes(dirname))
                csv_files.push(item.name);
        })
        csv_files.forEach(file => {
            try{
                var data = fs.readFileSync(CSV_DIR+"/"+file,'utf-8').split("\n");
                data.forEach(_line => {
                    if(_line!==''){
                        var data_json:CSV_DATA_JSON = {
                            description: _line.split(",")[1].replaceAll('"',''),
                            warn: _line.split(",")[2].replaceAll('"',''),
                            subject: _line.split(",")[3].replaceAll('"',''),
                            source: _line.split(",")[4].replaceAll('"',''),
                            line: _line.split(",")[5].replaceAll('"','')
                        };
                        csv_data.push(data_json);
                    }
                })
            }
            catch(e) {
                console.log(e);
            }
        });
        res.send({
            status: "success",
            msg: csv_data
        })
    }
    else{
        res.status(400).send({
            status: "fail",
            msg: "Invalid dirname"
        })
    }
}

export default view_csv;