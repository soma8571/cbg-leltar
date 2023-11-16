import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { base } from '../utils/util';

function ReadFromDrive() {

  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  const [googleSheetCols, setGoogleSheetCols] = useState([]);
  const [googleSheetRows, setGoogleSheetRows] = useState([]);
  const [isPending, setPending] = useState(false);
  const [myData, setMyData] = useState([]);
  const [colNames, setColNames] = useState([]);
  const [userId, setUserId] = useState("");

  useEffect(()=> {
    fetchEmployees();
  },[]);

  /* useEffect(()=> {
    console.log(myData);
  }, [myData]); */

  useEffect(()=> {
    if (userId !== "")
      fetchGsData();
  }, [userId]);

  useEffect(()=> {
    if (googleSheetCols.length > 0) 
      mapColnames();
  }, [googleSheetCols]);

  useEffect(()=> {
    if (colNames.length > 0)
      myFunction();
  }, [colNames]);
  
  const fetchEmployees = async () => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/get-employees`;
    try {
       const {data} = await axios.get(url);
       //console.log(data);
       setEmployees(data);
       //console.log(data);
    } catch(err) {
       console.log(err.message);
       setEmployees([]);
       setError(err.message);
    }
  }

  const saveData = async () => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/new-items`;
    try {
       const {data} = await axios.post(url, {items: myData});
       console.log(data);
    } catch(err) {
       console.log(err.message);
       setError(err.message);
    }
  }

  const fetchGsData = () => {
    let select = "SELECT B, C, E, F, G, H, I, J, K, L, M";
    const selectedEmployee = employees.filter(employee => 
      employee.userId === Number(userId));
    const sheet = selectedEmployee[0].shortName;
    //console.log(selectedEmployee);
    const query = encodeURIComponent(`${select} WHERE C > 0`);
    const url = `${base}&sheet=${sheet}&tq=${query}`;
    
    if (sheet !== "") {
      setPending(true);
      fetch(url)
        .then((res) => res.text())
        .then((rep) => {
          const jsData = JSON.parse(rep.slice(47).slice(0, -2));
          setGoogleSheetCols(jsData.table.cols);
          setGoogleSheetRows(jsData.table.rows)

      }).catch((e) => {
          console.log(e);
      }).finally(() => setPending(false));
    } 
  }

  const translateColnames = (colname) => {
    if (colname.toLowerCase().includes("azonosító"))
        return "inventoryNr";
    if (colname.toLowerCase().includes("érték"))
        return "value";
    if (colname.toLowerCase().includes("beszerzés helye"))
        return "getFrom";
    if (colname.toLowerCase().includes("helység"))
        return "place";
    if (colname.toLowerCase().includes("mennyiség"))
        return "quantity";
    if (colname.toLowerCase().includes("állapot"))
        return "status";
    if (colname.toLowerCase().includes("éve"))
        return "getInYear";
    if (colname.toLowerCase().includes("felelősségi"))
        return "responsibilityLevel";
    if (colname.toLowerCase().includes("megnevezése"))
        return "name";
    if (colname.toLowerCase().includes("kk"))
        return "ownerIsKK";
    if (colname.toLowerCase().includes("megjegyzés"))
        return "description";
    return colname;
  }

  const mapColnames = () => {
      const headings = googleSheetCols.map(item => {
        return translateColnames(item.label)
      });
      //console.log(headings);
      setColNames(headings);
  }

  const myFunction = () => {
      const myArray = [];
      /* console.log(googleSheetRows);
      console.log(colNames); */
      googleSheetRows.forEach(item => {
          let col = item.c;
          let objItem = {};
          col.forEach((item2, ind2) => {
              let keyName = colNames[ind2] ? colNames[ind2] : "none";
              let value = item2?.v ? item2.v : "";
              objItem = {...objItem, [keyName]: value, responsibleUser: userId};
          });
          myArray.push(objItem);
      });
      setMyData(myArray);
  }

  const fillSelect = () => {
    let options = employees.map((user, ind) => 
      <option 
        key={ind} 
        value={user.userId}
      >
        {user.name}
      </option>
    );
    return options;
  }

  const handleSelect = (e) => {
    setUserId(e.target.value);
  }

  const getTableHeader = () => {
    let headerRow = [];
    colNames.forEach((item, ind) => {
      let cell = <th key={ind}>{item}</th>;
      headerRow.push(cell);
    });
    return <tr>{headerRow}</tr>;
  }

  const getDataRowJSX = (dataRowObj) => {
    let row = [];
    for (let key in dataRowObj) {
      if (key === "responsibleUser") 
        continue;
      let cell = <td key={key}>{dataRowObj[key]}</td>;
      row.push(cell);
    }
    return row;
  }

  const getDataTable = () => {
    let rows = [];
    myData.forEach((item, index) => {
      let row = <tr key={index}>{getDataRowJSX(item)}</tr>;
      rows.push(row);
    });
    return rows;
  }


  return (
    <div className='read-from-drive-wrapper'>
      <h1>ReadFromDrive</h1>
      <div>
        {employees.length > 0 ?
          (<select onChange={e=>handleSelect(e)}>
            <option value=""></option>
            {fillSelect()}
          </select>
          )
          :
          (<p>Jelenleg nincs alkalmazott.</p>)
        }
      </div>
      
      <div>
        {isPending ? 
          (<div>Betöltés folyamatban...</div>) 
          : 
          (myData.length > 0 ? 
            (
            <div>
              <table className='leltar-data'>
                <thead>
                  {getTableHeader()}
                </thead>
                <tbody>
                  {getDataTable()}
                </tbody>
              </table>
              <div>
                <button 
                  type="button"
                  onClick={saveData}
                >
                  Mentés
                </button>
              </div>
            </div>
            )
            :
            (<div>Nincsenek adatok</div>)
          )
        }
        <div className='error'>{error}</div>
      </div>
    </div>
  )
}

export default ReadFromDrive;
