import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {useState} from "react";
import axios from "axios";

const API_URL = "http://ec2-3-39-230-136.ap-northeast-2.compute.amazonaws.com:8000/v1";

const Uploader = ()=>{
    const [repo, setRepo] = useState(0);

    const handleZipFile = (e) => {
        console.log(e.target.files[0]);
        setRepo(e.target.files[0]);
    }
    const uploadRepo = () => {
        if(repo === 0)
            alert('파일을 업로드 해주세요');
        else{
            const fomrData = new FormData();
            fomrData.append(
                "repo",
                repo
            );
            axios.post(API_URL+"/upload",fomrData)
            .then((upload_res)=>{
                axios.post(API_URL+"/codeql-create",
                    {
                        "dirname": upload_res.data.msg.dirname
                    },
                    {
                        headers:{
                            "token": "test",
                            'Content-type': 'application/json',
                            'Accept': '*/*'
                        }
                    }
                ).then((create_res)=>{
                    console.log(create_res);
                }).catch((create_err)=>{
                    alert(create_err);
                })
            })
            .catch((upload_err)=>{
                alert(upload_err);
            })
        }
    }
    return (
        <>
            <Form.Group controlId="formFile" className="mb-3" style={{display:"flex",flexDirection: "column"}}>
                <div>
                    <Form.Label>.zip 으로 압축한 레포지토리를 업로드 해주세요</Form.Label>
                </div>
                <div>
                    <Form.Control type="file" onChange={handleZipFile} />
                </div>
                <div>
                    <Button variant="primary" type="submit" onClick={uploadRepo}>
                        코드 점검 스타트
                    </Button>
                </div>
            </Form.Group>
        </>
    )
}

export default Uploader;