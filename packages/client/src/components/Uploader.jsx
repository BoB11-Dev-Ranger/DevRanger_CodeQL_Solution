import Alert from './Alert';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {useState} from "react";
import axios from "axios";
import Spinner from "./Spinner";
import ViewCSV from './View';

const API_URL = "http://ec2-13-125-245-164.ap-northeast-2.compute.amazonaws.com:8000/v1";
const PROCESS_STR = [
    "",
    "레포지토리 업로드중...",
    "CodeQL DB 생성중...",
    "CodeQL DB 분석중"
];
const sleep = (ms) => {
     return new Promise(resolve=>{
         setTimeout(resolve,ms)
     })
 }
const Uploader = ()=>{
    /* Modal state */
    const [alert_title, setTitle] = useState("");
    const [alert_content, setContent] = useState("");
    const [open, setOpen] = useState(false);

    const [repo, setRepo] = useState(0);
    const [disable_button, setButtonDisable] = useState(false);
    const [loading, setLoading] = useState(false);
    const [process_str, setProcessStr] = useState(0);
    const [percentage, setPercentage] = useState(0);
    const [is_analyzed, setAnalyzed] = useState(false);
    let ql_num = 0;
    const [dirname, setDirname] = useState("");

    const handleZipFile = (e) => {
        console.log(e.target.files[0]);
        setRepo(e.target.files[0]);
    }
    const handleClose = () => setOpen(false);
    /* db creating 진행 정도 체크 */
    const get_create_status = (pid, dir_name) => {
        axios.get(API_URL+"/status?mod=create_db&pid="+pid,
            {
                headers:{
                    "token": localStorage.getItem('my_token'),
                    'Accept': '*/*'
                }
            }
        )
        .then((res)=>{
            if(res.data.status === "creating"){
                setTimeout(get_create_status,1000, pid, dir_name);
            }
            else{
                setProcessStr(3);
                analyzeDB(0, dir_name);
            }
        })
        .catch((e)=>{
            setTitle("Error");
            setContent(e);
            setOpen(true);
        })
    }
    /* db analyzing 진행 정도 체크 */
    const get_analyze_status = (per, dir_name) => {
        axios.get(API_URL+"/status?mod=analysis_db",
            {
                headers:{
                    "token": localStorage.getItem('my_token'),
                    'Accept': '*/*'
                }
            }
        ).then(async (res)=>{
            /* 분석 중 */
            if(res.data.status==="analyzing"){
                setTimeout(get_analyze_status,3000, per, dir_name);
            }
            else{
                /* 다음 쿼리 */
                if(res.data.status === "next"){
                    setPercentage(per+14);
                    ql_num += 1;
                    analyzeDB(per+14, dir_name);
                }
                /* 총 분석 완료 */
                else{
                    setPercentage(per+14);
                    await sleep(2000);
                    setPercentage(100);
                    setTitle("Success");
                    setContent("CodeQL DB 분석완료");
                    setOpen(true);
                    await sleep(2000);
                    /* 초기화 */
                    ql_num = 0;
                    setAnalyzed(true);
                    setPercentage(0);
                    setProcessStr(0);
                    setLoading( false);
                    setButtonDisable(false);
                }
            }
        })
    }
    /* db analyzing */
    const analyzeDB = (per, dir_name) => {
        axios.post(API_URL+"/codeql-analyze",
            {
                "dirname": dir_name,
                "ql_num": ql_num
            },
            {
                headers:{
                    "token": localStorage.getItem('my_token'),
                    'Content-type': 'application/json',
                    'Accept': '*/*'
                }
            }
        ).then((analyze_res)=>{
            setTimeout(get_analyze_status,3000, per, dir_name);
        })
    }
    /* repo upload 및 db creating */
    const uploadRepo = () => {
        if(repo === 0){
            setTitle("Error");
            setContent("파일을 업로드 해주세요");
            setOpen(true);
        }
        else{
            setTitle("Success");
            setContent("코드분석이 시작되었습니다");
            setOpen(true);
            setButtonDisable(true);
            setAnalyzed(false);
            setDirname("");
            const fomrData = new FormData();            
            fomrData.append(
                "repo",
                repo
            );
            /* repository 업로드 */
            setProcessStr(1);
            setLoading(true);
            axios.post(API_URL+"/upload",fomrData)
            .then((upload_res)=>{
                /* codeql-db 생성 */
                setProcessStr(2);
                setDirname(upload_res.data.msg.dirname);
                axios.post(API_URL+"/codeql-create",
                    {
                        "dirname": upload_res.data.msg.dirname
                    },
                    {
                        headers:{
                            "token": localStorage.getItem('my_token'),
                            'Content-type': 'application/json',
                            'Accept': '*/*'
                        }
                    }
                ).then((create_res)=>{                
                    setTimeout(get_create_status,1000,create_res.data.pid, upload_res.data.msg.dirname);
                }).catch((create_err)=>{
                    setTitle("Error");
                    setContent(create_err);
                    setOpen(true);
                })
            })
            .catch((upload_err)=>{
                setLoading(false);
                setTitle("Error");
                setContent(upload_err);
                setOpen(true);
            })
        }
    }
    return (
        <>
            <Alert title={alert_title} content={alert_content} is_open={open} handleClose={handleClose}></Alert>
            {loading?(<Spinner></Spinner>):(<></>)}
            {process_str===3
            ?   (<div className='loading'>{`${PROCESS_STR[process_str]}(${percentage}%)...`}</div>)
            :
                (<div className='loading'>{PROCESS_STR[process_str]}</div>)
            }
            <Form.Group controlId="formFile" className="mb-3" style={{display:"flex",flexDirection: "column"}}>
                <div>
                    <Form.Label style={{fontFamily:'Nanum Gothic Coding', fontSize:'20px'}}>.zip 으로 압축한 레포지토리를 업로드 해주세요</Form.Label>
                </div>
                <div style={{display:"flex", flexDirection:"row"}}>
                    <div style={{marginLeft: "2.5%"}}>
                        <Form.Control type="file" onChange={handleZipFile} />
                    </div>
                    <div style={{marginLeft: "2%"}}>
                        {disable_button?(
                            <Button variant="danger" type="submit" onClick={uploadRepo} disabled>
                                코드 점검
                            </Button>):(
                            <Button variant="danger" type="submit" onClick={uploadRepo}>
                                코드 점검
                            </Button>
                            )
                        }
                    </div>
                </div>
            </Form.Group>
            <ViewCSV complete={is_analyzed} dirname={dirname}></ViewCSV>
        </>
    )
}

export default Uploader;