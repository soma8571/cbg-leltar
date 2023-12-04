import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { 
   defaultCols, 
   translateLabel, 
   propsDisplayInSelect } from '../utils/util';

function NewItem() {

   const [responsibleUsers, setResponsibleUsers] = useState([]);
   const [availableStatus, setAvailableStatus] = useState([]);
   const [places, setPlaces] = useState([]);
   const [isFetching, setIsFetching] = useState(false);
   const [response, setResponse] = useState("");
   const [error, setError] = useState("");
   const [newItem, setNewItem] = useState({});
   const [dataSending, setDataSending] = useState(false);
   const [updateMsg, setUpdateMsg] = useState("");
   const [saveError, setSaveError] = useState("");

   useEffect(()=> {
      fetchAvailableStatus();
      fetchPlaces();
      fetchResponsibleUsers();
   }, []);

   /* useEffect(()=>{
      console.log(responsibleUsers);
   }, [responsibleUsers]);

   useEffect(()=>{
      console.log(availableStatus);
   }, [availableStatus])

   useEffect(()=>{
      console.log(places);
   }, [places])

   useEffect(()=> {
      console.log(newItem);
   }, [newItem]); */

   useEffect(()=>{
    if (response === "") {
       fetchItemData();
    }
   }, []);

   
   //lekér az adatbázisból 1 leltári elemet. Ezen elem (objektum) tulajdonságait alapul véve jön létre egy minta objektum (A form módosítások ezt fogjuk manipulálni és ezt küldjük majd el mentéskor)
   async function fetchItemData() {
      setIsFetching(true);
      const url = `${process.env.REACT_APP_BACKEND_URL}/get-item-data/empty`;
      try {
         const {data} = await axios.get(url);
         if (Array.isArray(data) && data.length > 0) {
            //console.log(data);
            createEmptyObjectStructure(data[0]);
         } else {
            setError("Hiba az adatok lekérése során.");
         }
      } catch (err) {
         setError(err.message);
      } finally {
         setIsFetching(false);
      }
   }

   //Lekéri az összes alkalmazottat, akik egy felelősnek választhatók a leltári elem kapcsán
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

   //lekéri az összes lehetséges állapotot (Normál, hibás, stb...), mely kiválasztható egy leltári elemhez
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

   //lekéri az összes lehetséges helységet
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

   //a form mentésekor az adatokat posztoljuk az API felé
   async function saveNewItem() {
      setDataSending(true);
      setUpdateMsg("");
      setSaveError("");
      const url = `${process.env.REACT_APP_BACKEND_URL}/save-new-item`;
      try {
         const {data} = await axios.post(url, { itemData: newItem });
         //console.log(data);
         setUpdateMsg(`A leltári tétel mentése sikeres volt '${data.id}' azonosítóval.`);
      } catch (err) {
         console.log(err);
         setSaveError(err.response.data.msg);
      } finally {
         setDataSending(false);
      }
   }

   //paraméterül kap egy mintaobjektumot és ez alapján állítja be az új elem tárolására hivatott objektumot (newItem)
   function createEmptyObjectStructure(objectFromDB) {
      const {itemId, ...rest} = objectFromDB;
      if (Object.keys(rest).length > 0) {
         for (let key in rest) {
            rest[key] = "";
         }
         setNewItem(rest);
      }
   }

   const handleChange = (e) => {
      const {name, value} = e.target;
      setNewItem(prev => {
         return {...prev, [name]: value}
      });
   }

   const fillSelectOptionsByProperty = (property)=> {
      const options = [];
      options.push(<option value="" key="first"></option>);
      let optionsArray = [];
      switch (property) {
         case "place": 
            optionsArray = places.map((item, index) => 
               <option 
                  value={item.place} 
                  key={index}
               >
                  {item.place}
               </option>
            );
            break;
         case "status":
            optionsArray = availableStatus.map((item, index) => 
               <option 
                  value={item.status} 
                  key={index}
               >
                  {item.status}
               </option>
            );
            break;
         case "responsibleUser":
            optionsArray = responsibleUsers.map((item, index) => 
               <option 
                  value={item.userId} 
                  key={index}
               >
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
      for (let kulcs in newItem) {
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
                     value={newItem[kulcs]}
                  >
                     {fillSelectOptionsByProperty(kulcs)}
                  </select>)
                  :
                  (<input 
                     type={kulcs==="quantity" ? "number" : "text"}
                     name={kulcs}
                     value={newItem[kulcs]}
                     disabled={kulcs === "itemId"}
                     onChange={e=>handleChange(e)}
                     required={defaultCols[kulcs]["required"]}
                     min={kulcs==="quantity" ? 1 : ""}
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
      //console.log(newItem);
      saveNewItem();
   }

   return (
      <div className='editor-wrapper'>
      <h1>Új leltári elem hozzáadása</h1>
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
      {saveError === "" ? 
         (
            <div className='update-msg'>
               {!dataSending && updateMsg !=="" && updateMsg}
            </div>
         )
         :
         (
            <div className="save-error-msg">
               {saveError}
            </div>
         )
      }
      </div>
   );
}

export default NewItem;
