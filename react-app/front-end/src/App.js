import React, { useState } from 'react'

const App = () => {
    const [first, setFirst] = useState(true);
    const [second, setSecond] = useState(true);

    const handleChange=(data)=>{
        console.log(data); {/* this just prints what box they checked into the console*/}
    }

    return (
        <div>EzFilter
        {/* header - textbox w search functionality */}
        {/* filter options */}
        <input type="checkbox" value={first} onChange={()=> handleChange("first")}/> First
        <input type="checkbox" value={second} onChange={()=> handleChange("second")}/> Second

        </div>
  )
}

export default App;