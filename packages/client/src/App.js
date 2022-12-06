import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Uploader from "./components/Uploader";
// import { Test } from '@services/shared';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div style={{
          fontFamily:'Nanum Gothic Coding',
          fontSize: '48px'
        }}>
          Dev Ranger's
        </div>
        <div style={{
          fontFamily:'Nanum Gothic Coding',
          fontSize: '48px'
        }}>
          CodeQL Service
        </div>
        <Uploader></Uploader>
      </header>
    </div>
  );
}

export default App;
