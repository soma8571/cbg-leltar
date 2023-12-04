import React, {useEffect, useState, useRef} from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { defaultCols } from '../utils/util';

function Find() {

   const {state} = useLocation();
   const defaultFilters = {
      keyword: "",
      propertyIn: "",
      status: "",
      responsibleUser: "",
      place: "",
   };
   const [allItems, setAllItems] = useState([]);
   const [responsibleUsers, setResponsibleUsers] = useState([]);
   const [availableStatus, setAvailableStatus] = useState([]);
   const [places, setPlaces] = useState([]);
   const [isFetching, setIsFetching] = useState(false);
   const [response, setResponse] = useState("");
   const [filters, setFilters] = useState(defaultFilters);
   const [filteredItems, setFilteredItems] = useState([]);
   const [displayedCols, setDisplayedCols] = useState(defaultCols);
   const [isFiltersFromState, setIsFiltersFromState] = useState(false);
   const formRef = useRef(null);
   const [isDeleting, setIsDeleting] = useState(false);

   useEffect(()=> {
      fetchInventory();
      fetchResponsibleUsers();
      fetchAvailableStatus();
      fetchPlaces();
   }, []);

   useEffect(()=>{
      if (state) {
         if (Object.keys(state).length > 0) {
            //console.log(state);
            setFilters(state);
            setIsFiltersFromState(true);
         }
      }
   }, [state]);

   useEffect(()=>{
      if (allItems.length > 0 && isFiltersFromState) {
         let submitEvent = new Event("submit", 
            { bubbles: true, cancelable: true }
         );
         formRef.current.dispatchEvent(submitEvent);
      }
   }, [allItems]);

   /* useEffect(()=>{
      console.log(filters);
      console.log(availableStatus);
   },[filters, availableStatus]);
   */

   /* useEffect(()=>{
      console.log(filteredItems);
   }, [filteredItems]); */

   async function fetchInventory() {
      setIsFetching(true);
      const url = `${process.env.REACT_APP_BACKEND_URL}/get-items`;
      try {
         const {data} = await axios.get(url);
         setAllItems(data);
         setResponse("Az adatok rendelkezésre állnak");
      } catch (err) {
         setResponse(err.message);
      } finally {
         setIsFetching(false);
      }
   }

   async function deleteItem(itemId) {
      setIsDeleting(true);
      const url = `${process.env.REACT_APP_BACKEND_URL}/delete-item/${itemId}`;
      try {
         const {data} = await axios.delete(url);
         //console.log(data);
         //az adatok újra lekérése a szerverről
         fetchInventory();
         
         //erre azért van szükség itt, hogy az 'items' változására futó mellékhatás feltételében igazra értékelődjön ki a kifejezés és ezáltal a form újraposztolása megtörténjen (tehát frissüljön az eredménylista)
         setIsFiltersFromState(true);
      } catch (err) {
         setResponse(err.message);
         //console.log(err);
      } finally {
         setIsDeleting(false);
      }
   }

   async function fetchResponsibleUsers() {
      setIsFetching(true);
      const url = `${process.env.REACT_APP_BACKEND_URL}/get-employees`;
      try {
         const {data} = await axios.get(url);
         setResponsibleUsers(data);
         //setResponse("Az adatok rendelkezésre állnak");
      } catch (err) {
         setResponse(err.message);
      } finally {
         setIsFetching(false);
      }
   }

   async function fetchAvailableStatus() {
      setIsFetching(true);
      const url = `${process.env.REACT_APP_BACKEND_URL}/get-status`;
      try {
         const {data} = await axios.get(url);
         setAvailableStatus(data);
         //setResponse("Az adatok rendelkezésre állnak");
      } catch (err) {
         setResponse(err.message);
      } finally {
         setIsFetching(false);
      }
   }

   async function fetchPlaces() {
      setIsFetching(true);
      const url = `${process.env.REACT_APP_BACKEND_URL}/get-places`;
      try {
         const {data} = await axios.get(url);
         setPlaces(data);
         //setResponse("Az adatok rendelkezésre állnak");
      } catch (err) {
         setResponse(err.message);
      } finally {
         setIsFetching(false);
      }
   }

   //feltölti <option> -ökkel azt a select-et, amiből kiválasztható, hogy melyik oszlop értékeiben akarunk keresni
   function fillUpSelectInWhichFind() {
      const options = [];
      options.push(<option key="first" value=""></option>);
      for (let col in displayedCols) {
         if (displayedCols[col].visibility === 1) {
            let option = 
               <option 
                  key={col} 
                  value={col}
               >
                  {displayedCols[col]["hunName"]}
               </option>;
            options.push(option);
         }
      }
      return options;
   }

   function fillUpSelectStatus() {
      const status = [];
      status.push(<option value="" key="first"></option>);
      if (availableStatus.length > 0) {
         availableStatus.forEach((state, ind) => {
            if (state.status !== "") {
               const option = 
                  <option 
                     key={ind} 
                     value={state.status}
                  >
                     {state.status}
                  </option>
               status.push(option);
            }
         });
      }
      return status;
   }

   function fillUpSelectPlaces() {
      const placesOptions = [];
      placesOptions.push(<option value="" key="first"></option>);
      if (places.length > 0) {
         places.forEach((item, ind) => {
            const option = 
               <option 
                  key={ind} 
                  value={item.place}
               >
                  {item.place.length > 25 ? (`${item.place.slice(0, 25)}...`) : (item.place)}
               </option>
            placesOptions.push(option);
         });
      }
      return placesOptions;
   }

   function fillUpSelectResponsibleUser() {
      const users = [];
      users.push(<option value="" key="first"></option>);
      if (responsibleUsers.length > 0) {
         responsibleUsers.forEach(user => {
            const option = 
               <option 
                  key={user.shortName} 
                  value={user.userId}
               >
                  {user.name}
               </option>
            users.push(option);
         });
      }
      return users;
   }

   function calcTotalQuantity() {
      if (filteredItems.length > 0) {
         const sum = filteredItems.reduce((sum, current) => sum + current.quantity, 0);
         return sum;
      }  
      return 0;
   }

   function isShow(colname) {
      if ([colname] in displayedCols) {
         if (displayedCols[colname]["visibility"] === 1) return true;
      }
      return false;
   }

   function getRowJSX(obj, index) {
      const row = [];
      const firstCell = <td key={index}>{index + 1}</td>;
      row.push(firstCell);
      let cell = "";
      for (let kulcs in obj) {
         if (isShow(kulcs)) {
            if (kulcs === "name") {
               cell = <td key={kulcs}>
                  <Link to={`/szerkesztes/${obj["itemId"]}`} state={filters}>
                     {obj[kulcs]}
                  </Link>
               </td>;
            } else {
               cell = <td key={kulcs}>{obj[kulcs]}</td>;
            }
            row.push(cell);
         }
      }
      let deleteItemCol = 
         <td key={`deleteCol-${index}`}>
            <button
               key={index}
               data-id={obj["itemId"]} 
               onClick={e=>handleDelete(e)}
            >
               Törlés
            </button>
         </td>;
      row.push(deleteItemCol);
      return <tr key={index}>{row}</tr>;
   }

   function renderFilteredItems() {
      const tableRows = filteredItems.map((item, index) => {
         return getRowJSX(item, index);
      });
      return tableRows;
   }

   function renderTableHeader() {
      let obj = allItems[0];
      let thead = [];
      thead.push(<th key="first">#</th>);
      for (let key in obj) {
         if (isShow(key)) {
            let cell = <th key={key}>{displayedCols[key]["hunName"]}</th>;
            thead.push(cell);
         }
      }
      thead.push(<th key={"delete"}>Törlés</th>);
      return <tr>{thead}</tr>;
   }

   function handleDelete(e) {
      let choice = window.confirm("Biztosan törölni szeretnéd ezt a rekordot?");
      if (choice) {
         //console.log(`Törölve: ${e.target.dataset.id}`);
         deleteItem(e.target.dataset.id);
      }
   }

   function handleSubmit(e) {
      e.preventDefault();
      /* console.log("form submitted");
      console.log(filters);
      console.log(`Összes elem száma: ${allItems.length}`); */
      let filteredArray = allItems.filter(item => {
         return (
            filters.keyword !== "" && filters.propertyIn !== "" ?
               (item[[filters.propertyIn]].toString().toLowerCase().includes(filters.keyword.toLowerCase())) 
               : 
               true)
            && (filters.responsibleUser !== "" ? 
               (Number(item.responsibleUser) === Number(filters.responsibleUser)) 
               : 
               true)
            && (filters.status !== "" ?
               (item.status === filters.status)
               :
               true)
            && (filters.place !== "" ?
               (item.place === filters.place)
               :
               true)
      });
      setFilteredItems(filteredArray);
   }

   function handleFilterChange(e) {
      const {name, value} = e.target;
      setFilters(prevFilters => {
         return {...prevFilters, [name]: value}
      });
   }

   function resetFilters() {
      setFilters(defaultFilters);
   }

  return (
    <div className='find-wrapper'>
      <h1>Keresés</h1>

      <div>
      {isFetching ? 
            (<div className='data-info'>
               Az adatok betöltése folyamatban...
            </div>)
            :
            (<div className='data-info'>{response}</div>)
         }
         <form onSubmit={e=>handleSubmit(e)} className='form' ref={formRef}>
            <div className="form-group">
               <label htmlFor="keyword">Keresett kulcsszó</label>
               <input 
                  type="text" 
                  name="keyword" 
                  id="keyword"
                  onChange={e=>handleFilterChange(e)}
                  value={filters.keyword}
               />
            </div>
            <div className="form-group">
               <label htmlFor="propertyIn">Mely tulajdonságban</label>
               <select 
                  name="propertyIn" 
                  id="propertyIn"
                  onChange={e=>handleFilterChange(e)} 
                  value={filters.propertyIn}
                  required={filters.keyword !== ""}
               >
                  {fillUpSelectInWhichFind()}
               </select>
            </div>
            <div className="form-group">
               <label htmlFor="status">Állapot</label>
               <select 
                  name="status" 
                  id="status"
                  onChange={e=>handleFilterChange(e)} 
                  value={filters.status}
               >
                  {fillUpSelectStatus()}
               </select>
            </div>
            <div className="form-group">
               <label htmlFor="places">Hely</label>
               <select 
                  name="place"
                  id="places"
                  onChange={e=>handleFilterChange(e)} 
                  value={filters.place}
               >
                  {fillUpSelectPlaces()}
               </select>
            </div>
            <div className="form-group">
               <label htmlFor="responsibleUser">Felelős</label>
               <select 
                  name="responsibleUser" 
                  id="responsibleUser"
                  onChange={e=>handleFilterChange(e)} 
                  value={filters.responsibleUser}
               >
                  {fillUpSelectResponsibleUser()}
               </select>
            </div>

            <button type="submit" className='submit'>
               Keresés
            </button>
            <button type="reset" className='reset' onClick={()=>resetFilters()}>
               Szűrők alaphelyzetbe
            </button>
         </form>
      </div>
      
      <div>
         {filteredItems.length > 0 ?
            (
               <div className='find-result-wrapper'>
                  <div>
                     <span className='total-find'>
                        {filteredItems.length}
                     </span> rekord, összesen {''}
                     <span className='total-quantity'>
                         {calcTotalQuantity()}
                     </span> db
                  </div>
            
                  <table>
                     <thead>
                        {renderTableHeader()}
                     </thead>
                     <tbody>
                        {renderFilteredItems()}
                     </tbody>
                  </table>
               </div>
            )
            :
            (
               <p>Nincs találat</p>
            )
         }
      </div>
    </div>
  );
}

export default Find;
