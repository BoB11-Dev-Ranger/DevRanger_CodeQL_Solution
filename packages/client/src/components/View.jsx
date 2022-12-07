import {useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://ec2-13-125-245-164.ap-northeast-2.compute.amazonaws.com:8000/v1";

const ViewCSV = ({complete, dirname}) => {
    const [_dirname , setDirname] = useState(dirname);
    const [_complete, setComplete] = useState(complete);
    useEffect(()=>{
        if(complete === true){
            axios.get(API_URL+'/view-csv?dirname='+dirname)
            .then((res)=>{
                console.log(res);
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
            <div>
                {`${_complete}
                ${_dirname}`}
            </div>
        </>
    )
}
export default ViewCSV;