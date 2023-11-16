import React, {useEffect, useState} from 'react';
import axios from 'axios';

function Find() {

   const [allItems, setAllItems] = useState([]);
   const [isFetching, setIsFetching] = useState(false);
   const [response, setResponse] = useState("");
   const [filterText, setFilterText] = useState("");
   const [filteredItems, setFilteredItems] = useState([]);

   useEffect(()=> {
      fetchInventory();
   }, []);

   useEffect(()=>{
      console.log(filteredItems);
   }, [filteredItems]);

   async function fetchInventory() {
      setIsFetching(true);
      const url = `${process.env.REACT_APP_BACKEND_URL}/get-items`;
      try {
         const {data} = await axios.get(url);
         console.log('data arrived');
         setAllItems(data);
         setResponse("Az adatok rendelkezésre állnak");
      } catch (err) {
         setResponse(err.message);
      } finally {
         setIsFetching(false);
      }
   }

   function getRowJSX(obj, index) {
      const row = [];
      for (let kulcs in obj) {
         let cell = <td key={kulcs}>{obj[kulcs]}</td>;
         row.push(cell);
      }
      return <tr key={index}>{row}</tr>;
   }

   function renderFilteredItems() {
      const tableRows = filteredItems.map((item, index) => {
         return getRowJSX(item, index);
      });
      return tableRows;
   }

   function handleSubmit(e) {
      e.preventDefault();
      console.log(filterText);
      const filteredArray = allItems.filter(item => 
         item["name"].toLowerCase().includes(filterText) 
      );
      setFilteredItems(filteredArray);
   }

  return (
    <div>
      <h1>Keresés</h1>
      <div>
         {isFetching ? 
            (<p>Az adatok betöltése folyamatban...</p>)
            :
            (<p>{response}</p>)
         }
      </div>

      <div>
         <form onSubmit={e=>handleSubmit(e)}>
            <label htmlFor="filterText"></label>
            <input 
               type="text" 
               name="filterText" 
               id="filterText"
               onChange={e=>{setFilterText(e.target.value)}} 
               value={filterText}
            />
            <button type="submit">
               Keresés
            </button>
         </form>
      </div>
      
      <div>
         {filteredItems.length > 0 ?
            (
               <table>
                  {renderFilteredItems()}
               </table>
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
