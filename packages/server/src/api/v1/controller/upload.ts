import multer from "multer";
import path from "path";
import unzip_stream from "unzip-stream";
import fs from "fs-extra";
import child_process from "child_process";
import { Request, Response } from "express";

const unzip = async (paths: string, destination:string, filename: string)=>  {
	let ext = path.extname(filename);
	let new_filename = filename.split(ext)[0];
	return fs.createReadStream(paths).pipe(unzip_stream.Extract({path: destination+new_filename}))
}
const delzip = async (paths:string) => {
	child_process.execSync("rm "+paths);
}
const upload_obj = multer({
	storage: multer.diskStorage({
		destination: function(req, file, cb){
			cb(null, "/home/ubuntu/CodeQL-Service/uploads/");
		},
		filename: function(req, file, cb){
			cb(null, new Date().valueOf() + path.extname(file.originalname));
		}
	})
}).single('repo');

const upload = (req: Request, res: Response) => {
    // console.log(req.file);
	/*
		fieldname
		originalname
		mimetype
		destination(dir)
		filename(new)
		path(dir_file)
		size
	*/
    upload_obj(req, res, (err: unknown)=>{
		if(err instanceof multer.MulterError){
			res.status(400).send({
				status: false,
				msg: err.message,
			})
		}
		else if(err instanceof Error){
			res.status(400).send({
				status: false,
				msg: err.message,
			})
		}
		
		if(req.file != undefined && path.extname(req.file.originalname)==".zip"){
			unzip(req.file.path, req.file.destination,req.file.filename)
			.then((res: any)=>{
				delzip(res.opts?.path+".zip");
			})
			console.log("success");
			res.send({
				status: "success",
				msg: {
                    path: req.file.path,
                    dirname: req.file.filename.split(path.extname(req.file.filename))[0]
                }
			})
		}
		else{
			if(req.file == undefined){
				res.status(400).send({
					status: "false",
					msg: "file is not defined"
				})
			}
			else if(path.extname(req.file.originalname)!=".zip"){
				res.status(400).send({
					status: "false",
					msg: "file is not zip repository"
				})
			}
			else{
				res.status(400).send({
					status: "false",
					msg: "Internal Error contact server manager"
				})
			}
		}
	})
}

export default upload;