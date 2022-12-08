import {useState, useEffect } from "react";
import axios from "axios";
import Table from 'react-bootstrap/Table';

const API_URL = "http://ec2-13-125-245-164.ap-northeast-2.compute.amazonaws.com:8000/v1";

const ViewCSV = ({complete, dirname}) => {
    const [_dirname , setDirname] = useState(dirname);
    const [_complete, setComplete] = useState(complete);
    const [csv_res, setCSVRes] = useState([]);

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
            <Table striped bordered hover variant="dark" style={{marginTop:"3%"}}>
                <thead>
                    <tr>
                        <th>취약점 이름</th>
                        <th>위험도</th>
                        <th>설명</th>
                        <th>소스경로</th>
                        <th>취약 라인</th>
                    </tr>
                </thead>
                <tbody>
                    {csv_res.map((val)=>(
                        <tr>
                            <td>{val.subject}</td>
                            <td>{val.warn}</td>
                            <td>{val.description}</td>
                            <td>{val.source}</td>
                            <td>{val.line}</td>
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