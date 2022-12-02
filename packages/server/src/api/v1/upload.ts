import multer from "multer";
import path from "path";
import { Request, Response } from "express";

const upload_obj = multer({
	storage: multer.diskStorage({
		destination: function(req, file, cb){
			cb(null, "/home/ubuntu/devranger-codeql-service/uploads/");
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
			res.send({
				status: "success",
				msg: "repository is uploaded"
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