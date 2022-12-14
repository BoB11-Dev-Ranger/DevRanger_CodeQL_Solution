import './statics/App.css';
import logo from "./statics/bob-logo.png";
import 'bootstrap/dist/css/bootstrap.css';
import Uploader from "./components/Uploader";
import { useEffect,useState } from 'react';
import generateId from "./utils";

function App() {
  const [my_token] = useState(generateId());
  useEffect(()=>{
    if(localStorage.getItem('my_token') === null)
      localStorage.setItem('my_token',my_token);
  },[]);
  return (
    <div className="App">
      <header className="App-header">
        <div style={{
          marginTop: "5%",
          fontFamily:'Nanum Gothic Coding',
          fontSize: '48px'
        }}>
          <div><img src={logo} alt="bob" style={{width:"8%", marginRight: "2%"}}/>Dev Ranger's CodeQL Service</div>
        </div>
        <div style={{
          fontFamily:'Nanum Gothic Coding',
          fontSize: '48px'
        }}>
          
        </div>
        <Uploader></Uploader>
      </header>
    </div>
  );
}

export default App;
