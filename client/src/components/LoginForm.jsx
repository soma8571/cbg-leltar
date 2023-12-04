import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

function LoginForm() {

   const [loginData, setLoginData] = useState({
      username: "",
      password: "",
   });
   const [isSending, setIsSending] = useState(false);
   const [error, setError] = useState("");
   const [cookies, setCookies] = useCookies(['loggedIn']);
   const navigate = useNavigate();

   /* useEffect(()=>{
      console.log(loginData);
   }, [loginData]); */

   async function sendLoginData() {
      setIsSending(true);
      const url = `${process.env.REACT_APP_BACKEND_URL}/login`;
      try {
         const {data} = await axios.post(url, {loginData});
         //console.log(data);
         if (data.msg === "ok") {
            setCookies("loggedIn", true);
            navigate("/");
         }
      } catch (err) {
         const errorMsg = err?.response?.data?.msg ?? err.message;
         setLoginData(prev => {
            return {...prev, password: ""}
         });
         setError(errorMsg);
      } finally {
         setIsSending(false);
      }
   }

   const handleChange = (e) => {
      const {name, value} = e.target;
      setLoginData(prevLoginData => {
         return {...prevLoginData, [name]: value}
      });
   }

   const handleSubmit = (e) => {
      e.preventDefault();
      sendLoginData();
   }

  return (
    <div className='login-wrapper'>
      <div className="logo">
         <img src={`${process.env.PUBLIC_URL}/CBG_logo.png`} alt="logo"/>
      </div>
      <form onSubmit={e=>handleSubmit(e)} className='login-form'>
         <div>
            <label htmlFor="username">Felhasználónév</label>
            <input 
               type="text" 
               name="username" 
               id="username"
               value={loginData.username}
               onChange={e=>handleChange(e)}
               required
               placeholder='Felhasználónév'
            />
         </div>
         <div>
            <label htmlFor="password">Jelszó</label>
            <input 
               type="password" 
               name="password"
               id="password"
               value={loginData.password}
               onChange={e=>handleChange(e)}
               required
               placeholder='Jelszó'
            />
         </div>
         <button type="submit">
            Belépés
         </button>
      </form>
      <div className="error">
         {error}
      </div>
    </div>
  )
}

export default LoginForm;
