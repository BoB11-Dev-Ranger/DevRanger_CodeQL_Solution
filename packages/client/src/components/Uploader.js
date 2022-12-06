import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {useState} from "react";
import axios from "axios";

const Uploader = ()=>{
    const [repo, setRepo] = useState(0);
    const handleZipFile = (e) => {
        console.log(e.target.files[0]);
        setRepo(e.target.files[0]);
    }
    const uploadRepo = () => {
        if(repo==0)
            alert('파일을 업로드 해주세요');
        else
            alert('굿');
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
                        업로드
                    </Button>
                </div>
            </Form.Group>
        </>
    )
}

export default Uploader;