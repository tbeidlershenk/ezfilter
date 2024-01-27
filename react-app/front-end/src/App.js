import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const [first, setFirst] = useState(true);
  const [second, setSecond] = useState(false);

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
      <div>EzFilter
        {/* header - textbox w search functionality */}
        {/* filter options */}
        <input type="checkbox" value={first} onChange={()=> handleChange("first")}/> First
        <input type="checkbox" value={second} onChange={()=> handleChange("second")}/> Second

        </div>
    </div>

    
  );
}

export default App;