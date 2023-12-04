import React, {useState, useEffect} from 'react';
import axios from "axios";

function NewEmployee() {

   const defaultEmployee = {
         name: "",
         shortName: "",
   };
   const [employee, setEmployee] = useState(defaultEmployee);
   const [employees, setEmployees] = useState([]);
   const [error, setError] = useState("");
   const [response, setResponse] = useState("");

   useEffect(()=> {
      fetchEmployees();
   }, [response]);

   const saveEmpleyee = async () => {
      const url = `${process.env.REACT_APP_BACKEND_URL}/new-employee`;
      try {
         const {data} = await axios.post(url, {employee});
         //console.log(data);
         setResponse(data.msg);
         setEmployee(defaultEmployee);
      } catch(err) {
         //console.log(err.message);
         setError(err.message);
      }
   }

   const fetchEmployees = async () => {
      const url = `${process.env.REACT_APP_BACKEND_URL}/get-employees`;
      try {
         const {data} = await axios.get(url);
         //console.log(data);
         setEmployees(data);
      } catch(err) {
         console.log(err.message);
         setEmployees([]);
         setError(err.message);
      }
   }

   const deleteEmployee = async (id) => {
      const url = `${process.env.REACT_APP_BACKEND_URL}/delete-employee/${id}`;
      try {
         const {data} = await axios.delete(url);
         //console.log(data);
         setResponse(data.msg);
      } catch(err) {
         //console.log(err.message);
         setError(err.message);
      }
   }

   const handleChange = (e) => {
      const {name, value} = e.target;
      setEmployee(prev => {
         return {...prev, [name]: value }
      });
   }

   const handleSubmit = (e) => {
      e.preventDefault();
      saveEmpleyee();
   }

   const getEmployeeTableHeader = () => {
      const header = <tr>
         <th>Név</th>
         <th>Rövid név</th>
         <th>Törlés</th>
      </tr>;
      return <thead>{header}</thead>;
   }

   const getEmployeeTableContent = () => {
      const rows = employees.map((item, ind) => 
         <tr key={ind}>
            <td>{item.name}</td>
            <td>{item.shortName}</td>
            <td>
               <button 
                  type="button" 
                  data-id={item.userId} 
                  onClick={e=>deleteEmployee(e.target.dataset.id)}
               >
                  Törlés
               </button>
            </td>
         </tr>
      );
      return <tbody>{rows}</tbody>;
   }

  return (
    <div className='employee-wrapper'>
      <div>
         <h1>Új alkalmazott felvétel</h1>
         <form className='new-employee-form' onSubmit={e=>handleSubmit(e)}>
            <label htmlFor="name">Teljes név</label>
            <input 
               type="text" 
               name="name"
               id="name"
               onChange={e=>handleChange(e)}
               value={employee.name}
               maxLength={80}
               required
            />
            <label htmlFor="shortName">Monogramm</label>
            <input
               type="text" 
               name="shortName"
               id="shortName"
               onChange={e=>handleChange(e)}
               value={employee.shortName}
               maxLength={10}
               required
            />
            <button>Mentés</button>
         </form>
         {/* <div>{response}</div> */}
      </div>
      
      <div>
         <h1>Alkalmazottak listája</h1>
         {employees.length > 0 ? (
            <table>
               {getEmployeeTableHeader()}
               {getEmployeeTableContent()}
            </table>
         )
         :
         (<div>Még nincs felvéve alkalmazott</div>)
         }
      </div>
    </div>
  )
}

export default NewEmployee;
