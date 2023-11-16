import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Layout from './components/Layout';
import ReadFromDrive from './components/ReadFromDrive';
import NewEmployee from './components/NewEmployee';
import Find from './components/Find';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route 
          path="/" 
          element={<Layout content={<ReadFromDrive />}/>} 
        />
        <Route 
          path="/uj-alkalmazott" 
          element={<Layout content={<NewEmployee />}/>} 
        />
        <Route 
          path="/read-from-drive" 
          element={<Layout content={<ReadFromDrive />}/>} 
        />
        <Route 
          path="/find" 
          element={<Layout content={<Find />}/>} 
        />
      </Routes>
    </div>
  );
}

export default App;
