import {useState, useEffect } from "react";
import axios from "axios";
import Table from 'react-bootstrap/Table';
import Medium from "./warn_sign/Medium";
import High from "./warn_sign/High";

const API_URL = "http://ec2-13-125-245-164.ap-northeast-2.compute.amazonaws.com:8000/v1";

const ViewCSV = ({complete, dirname}) => {
    const [_dirname , setDirname] = useState(dirname);
    const [_complete, setComplete] = useState(complete);
    const [csv_res, setCSVRes] = useState([{subject:"StoredXSS",warn:"warning",source:"src/api.js",line:"202",description:"none"}]);

    useEffect(()=>{
        if(complete === true){
            axios.get(API_URL+'/view-csv?dirname='+dirname)
            .then((res)=>{
                setCSVRes(res.data.msg);
            })
            .catch((e)=>{
                console.log(e);
            })
        }
        setDirname(dirname);
        setComplete(complete);
    },[dirname, complete]);
    return (
        <>
        {_complete?(
            <Table striped bordered hover variant="dark" style={{marginTop:"3%", width:"90%"}}>
                <thead>
                    <tr>
                        <th style={{fontWeight:"bold"}}>취약점 이름</th>
                        <th style={{fontWeight:"bold"}}>위험도</th>
                        <th style={{fontWeight:"bold"}}>소스경로</th>
                        <th style={{fontWeight:"bold"}}>취약 라인</th>
                        <th style={{fontWeight:"bold"}}>설명</th>
                    </tr>
                </thead>
                <tbody>
                    {csv_res.map((val)=>(
                        <tr>
                            <td>{val.subject}</td>
                            <td>{val.warn==="error"?(<High></High>):(<Medium></Medium>)}</td>
                            <td>{val.source}</td>
                            <td>{val.line}</td>
                            <td>{val.description}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        ):(<></>)
        }
        </>
    )
}
export default ViewCSV;