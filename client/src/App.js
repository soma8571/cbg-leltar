import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Layout from './components/Layout';
import ReadFromDrive from './components/ReadFromDrive';
import NewEmployee from './components/NewEmployee';
import Find from './components/Find';
import Edit from './components/Edit';
import NewItem from './components/NewItem';
import NotFound from './components/NotFound';
import LoginForm from './components/LoginForm';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useEffect } from 'react';

function App() {

  const navigate = useNavigate();
  const [cookies, setCookies] = useCookies(['loggedIn']);
  
  useEffect(()=>{
    if (!cookies.loggedIn) {
      navigate("/login");
    }
  }, [cookies.loggedIn]);

  return (
    <div className="App">
      <Routes>
        <Route 
          path="/" 
          element={<Layout content={<Find />}/>} 
        />
        <Route 
          path="/login" 
          element={<LoginForm />} 
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
          path="/kereses" 
          element={<Layout content={<Find /* onFilterChange={handleFilterChange} */ />}/>} 
        />
        <Route 
          path="/szerkesztes/:itemId"
          element={<Layout content={<Edit />}/>} 
        />
        <Route 
          path="/uj-tetel"
          element={<Layout content={<NewItem />}/>} 
        />
        <Route 
          path="*"
          element={<Layout content={<NotFound />}/>} 
        />
      </Routes>
    </div>
  );
}

export default App;
