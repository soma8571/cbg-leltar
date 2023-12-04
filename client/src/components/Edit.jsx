import React, {useState, useEffect} from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { 
   defaultCols, 
   translateLabel, 
   propsDisplayInSelect } from '../utils/util';

function Edit() {

   const {state} = useLocation();
   let {itemId} = useParams();
   const [responsibleUsers, setResponsibleUsers] = useState([]);
   const [availableStatus, setAvailableStatus] = useState([]);
   const [places, setPlaces] = useState([]);
   const [isFetching, setIsFetching] = useState(false);
   const [response, setResponse] = useState("");
   const [itemData, setItemData] = useState({});
   const [error, setError] = useState("");
   const [dataSending, setDataSending] = useState(false);
   const [updateMsg, setUpdateMsg] = useState("");

   useEffect(()=> {
      fetchAvailableStatus();
      fetchPlaces();
      fetchResponsibleUsers();
   }, []);

   /* useEffect(()=>{
      if (Object.keys(state).length > 0) {
         console.log(state);
      }
   }, [state]); */

   /* useEffect(()=>{
      console.log(responsibleUsers);
   }, [responsibleUsers]);

   useEffect(()=>{
      console.log(availableStatus);
   }, [availableStatus])

   useEffect(()=>{
      console.log(places);
   }, [places]) */

   useEffect(()=>{
      if (response === "") {
         fetchItemData();
      }
   }, [itemId]);

   /* useEffect(()=> {
      console.log(itemData);
   }, [itemData]) */

   async function fetchItemData() {
      setIsFetching(true);
      const url = `${process.env.REACT_APP_BACKEND_URL}/get-item-data/${itemId}`;
      try {
         const {data} = await axios.get(url);
         if (Array.isArray(data) && data.length > 0) {
            setItemData(data[0]);
            //console.log(data);
         } else {
            setError("Hiba az adatok lekérése során.");
         }
      } catch (err) {
         setError(err.message);
      } finally {
         setIsFetching(false);
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

   async function sendUpdateRequest() {
      setDataSending(true);
      const url = `${process.env.REACT_APP_BACKEND_URL}/update-item`;
      try {
         await axios.patch(url, {itemData});
         setUpdateMsg("A leltári tétel módosítása sikeres volt.");
      } catch (err) {
         setResponse(err.message);
         setUpdateMsg("A leltári tétel módosítása sikertelen volt.");
      } finally {
         setDataSending(false);
      }
   }

   const handleChange = (e) => {
      const {name, value} = e.target;
      setItemData(prev => {
         return {...prev, [name]: value}
      });
   }

   const fillSelectOptionsByProperty = (property, value)=> {
      const options = [];
      options.push(<option value="" key="first"></option>);
      let optionsArray = [];
      switch (property) {
         case "place": 
            optionsArray = places.map((item, index) => 
               <option value={item.place} key={index}>
                  {item.place}
               </option>
            );
            break;
         case "status":
            optionsArray = availableStatus.map((item, index) => 
               <option value={item.status} key={index}>
                  {item.status}
               </option>
            );
            break;
         case "responsibleUser":
            optionsArray = responsibleUsers.map((item, index) => 
               <option value={item.userId} key={index}>
                  {item.name}
               </option>
            );
            break;
         case "ownerIsKK":
            const opt1 = <option value="0" key="opt0">Nem</option>;
            const opt2 = <option value="1" key="opt1">Igen</option>;
            options.push(opt1, opt2);
            break;
         case "responsibilityLevel":
            const opt3 = <option 
                           value="Elsődleges" 
                           key="opt3"
                        >
                           Elsődleges
                        </option>;
            const opt4 = <option 
                           value="Másodlagos" 
                           key="opt4"
                        >
                           Másodlagos
                        </option>;
            options.push(opt3, opt4);
            break;
         default:
            return options;
      }
      if (optionsArray.length > 0) {
         options.push(optionsArray);
      }
      return options;
   }

   const renderProperties =() => {
      let fields = [];
      let index = 0;
      for (let kulcs in itemData) {
         if (kulcs === "itemId") continue;
         let field = 
            <div 
               className='prop-wrapper' 
               key={index} 
               style={{gridArea: kulcs}}
            >
               <label 
                  htmlFor={kulcs} 
                  className={defaultCols[kulcs]["required"] ? "required" : ""}
               >
                  {translateLabel(kulcs)}
               </label>
               {/* bizonyos kulcsok esetén select-re van szükségünk */}
               {propsDisplayInSelect.includes(kulcs) ? 
                  (<select 
                     name={kulcs} 
                     onChange={e=>handleChange(e)}
                     required={defaultCols[kulcs]["required"]}
                     value={itemData[kulcs] ?? ""}
                  >
                     {fillSelectOptionsByProperty(kulcs, itemData[kulcs])}
                  </select>)
                  :
                  (<input 
                     type={kulcs==="quantity" ? "number" : "text"}
                     name={kulcs}
                     value={itemData[kulcs]}
                     disabled={kulcs === "itemId"}
                     onChange={e=>handleChange(e)}
                  />)
               }
            </div>
         index++;
         fields.push(field);
      }
      return fields;
   }

   const handleSubmit = (e) => {
      e.preventDefault();
      //console.log("ok");
      sendUpdateRequest();
   }


  return (
    <div className='editor-wrapper'>
      <div className="return-back">
         <Link 
            to={"/kereses"} 
            state={state}
         >
            <button className='back'>Vissza a találatokhoz</button>   
         </Link>
      </div>
      <h1>Leltári tétel szerkesztése</h1>
      <div>
         {isFetching ? 
            (<div>Betöltés...</div>)
            :
            (error === "" ?
               (<form onSubmit={e=>handleSubmit(e)}>
                  <div className='properties-wrapper'>
                     {renderProperties()}
                  </div>
                  <div className="button-wrapper">
                     <button type="submit" >
                        {dataSending ? "Küldés..." : "Mentés"}
                     </button>
                  </div>
               </form>)
                : 
                (<div className='error'>{error}</div>)
            )
         }
      </div>
      <div className='update-msg'>
         {!dataSending && updateMsg !=="" && updateMsg}
      </div>
    </div>
  )
}

export default Edit;
