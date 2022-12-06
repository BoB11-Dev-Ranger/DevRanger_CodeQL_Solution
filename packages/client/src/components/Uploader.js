import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {useState} from "react";
import axios from "axios";
import Spinner from "./Spinner";

const API_URL = "http://ec2-13-125-245-164.ap-northeast-2.compute.amazonaws.com:8000/v1";



const Uploader = ()=>{
    const [repo, setRepo] = useState(0);
    const [loading, setLoading] = useState(false);
    const handleZipFile = (e) => {
        console.log(e.target.files[0]);
        setRepo(e.target.files[0]);
    }
    const get_create_status = (pid) => {
        axios.get(API_URL+"/status?mod=create_db&pid="+pid,
            {
                headers:{
                    "token": "test",
                    'Accept': '*/*'
                }
            }
        )
        .then((res)=>{
            if(res.data.status === "creating"){
                setTimeout(get_create_status,1000,pid);
            }
            else{
                console.log(res);
                setLoading(false);
                alert('CodeQL DB 생성완료');
            }
        })
        .catch((e)=>{
            alert(e);
        })
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
            /* repository 업로드 */
            axios.post(API_URL+"/upload",fomrData)
            .then((upload_res)=>{
                /* codeql-db 생성 */
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
                    setLoading(true)
                    console.log(create_res);                   
                    setTimeout(get_create_status,1000,create_res.data.pid);
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
            {loading?(
                <>
                    <Spinner></Spinner>
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
                    <Button variant="primary" onClick={()=>{setLoading(!loading)}}>asdf</Button>
                </>
            ):(
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
                    <Button variant="primary" onClick={()=>{setLoading(!loading)}}>asdf</Button>
                </>
                )
            }
        </>
    )
}

export default Uploader;