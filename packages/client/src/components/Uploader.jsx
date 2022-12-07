import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {useState} from "react";
import axios from "axios";
import Spinner from "./Spinner";

const API_URL = "http://ec2-13-125-245-164.ap-northeast-2.compute.amazonaws.com:8000/v1";



const Uploader = ()=>{
    const [repo, setRepo] = useState(0);
    const [loading, setLoading] = useState(false);
    let ql_num = 0;
    let dirname = "";

    const handleZipFile = (e) => {
        console.log(e.target.files[0]);
        setRepo(e.target.files[0]);
    }
    
    /* db creating 진행 정도 체크 */
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
                alert('CodeQL DB 생성완료');
                analyzeDB();
            }
        })
        .catch((e)=>{
            alert(e);
        })
    }
    /* db analyzing 진행 정도 체크 */
    const get_analyze_status = () => {
        axios.get(API_URL+"/status?mod=analysis_db",
            {
                headers:{
                    "token": "test",
                    'Accept': '*/*'
                }
            }
        ).then((res)=>{
            /* 분석 중 */
            if(res.data.status==="analyzing"){
                setTimeout(get_analyze_status,1000);
            }
            else{
                /* 다음 쿼리 */
                if(res.data.status === "next"){
                    ql_num += 1;
                    analyzeDB();
                }
                /* 총 분석 완료 */
                else{
                    ql_num = 0;
                    console.log(res);
                    setLoading(false);
                    alert("CodeQL DB 분석완료");
                }
            }
        })
    }
    /* db analyzing */
    const analyzeDB = () => {
        axios.post(API_URL+"/codeql-analyze",
            {
                "dirname": dirname,
                "ql_num": ql_num
            },
            {
                headers:{
                    "token": "test",
                    'Content-type': 'application/json',
                    'Accept': '*/*'
                }
            }
        ).then((analyze_res)=>{
            console.log(analyze_res);
            setTimeout(get_analyze_status,1000);
        })
    }
    /* repo upload 및 db creating */
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
            setLoading(true);
            axios.post(API_URL+"/upload",fomrData)
            .then((upload_res)=>{
                /* codeql-db 생성 */
                dirname= upload_res.data.msg.dirname;
                axios.post(API_URL+"/codeql-create",
                    {
                        "dirname": dirname
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
                    setTimeout(get_create_status,1000,create_res.data.pid);
                }).catch((create_err)=>{
                    alert(create_err);
                })
            })
            .catch((upload_err)=>{
                setLoading(false);
                alert(upload_err);
            })
        }
    }
    return (
        <>
            {loading?(<Spinner></Spinner>):(<></>)}
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