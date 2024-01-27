import React, { useState, useEffect } from 'react';
import './App.css';
import THANK_U_NEXT from './THANK_U_NEXT';

function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const [first, setFirst] = useState(true);
  const [second, setSecond] = useState(false);
  const [query, setQuery] = useState("");
  const {tracks} = THANK_U_NEXT;
  const {items} = tracks;
  const getFilteredItems = (query, items) => {
    if(!query){
        return items;
    }
    return items.filter(song => song.name.includes(query))
  }
  const filteredItems = getFilteredItems(query, items);
  useEffect(() => {
    fetch('/time').then(res => res.json()).then(data => {
      setCurrentTime(data.time);
    });
  }, []);

    const handleChange=(data)=>{
        console.log(data); {/* this just prints what box they checked into the console*/}
    }

  return (
    <div className="App">
      {/* <header className="App-header">

        ... no changes in this part ...

        <p>The current time is {currentTime}.</p>
      </header> */}
      <label>Search </label>
      <input type="text" onChange={e => setQuery(e.target.value)}/>
      <ul>
      {filteredItems.map(value => <h2 key={value.name}><input type="checkbox" onChange={()=> handleChange(value.name)}/>{value.name}</h2>)}
      </ul>
      <div>EzFilter
        {/* header - textbox w search functionality */}
        {/* filter options */}
      </div>
    </div>

    
  );
}

export default App;