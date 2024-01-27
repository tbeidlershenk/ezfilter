import React, { useState, useEffect } from "react";
import "./App.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleOneTapLogin } from "@react-oauth/google";
import {
  GoogleAuth,
  GoogleButton,
  GoogleAuthConsumer,
  IOAuthState,
} from "react-google-oauth2";
import THANK_U_NEXT from "./THANK_U_NEXT";
import db from "./firebase"
import { onSnapshot, collection } from 'firebase/firestore';

function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const [first, setFirst] = useState(true);
  const [second, setSecond] = useState(false);
  const [query, setQuery] = useState("");
  const [firebaseData, setFirebaseData] = useState([]);
  const { tracks } = THANK_U_NEXT;
  const { items } = tracks;
  const getFilteredItems = (query, items) => {
    if (!query) {
      return items;
    }
    return items.filter((song) => song.name.includes(query));
  };
  const filteredItems = getFilteredItems(query, items);
  // useEffect(() => {
  //   fetch("/time")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setCurrentTime(data.time);
  //     });
  // }, []);

  useEffect(() => {
    // Firebase subscription using onSnapshot
    const unsubscribe = onSnapshot(collection(db, "colors"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setFirebaseData(data);
    });

    // Cleanup function to unsubscribe when the component unmounts
    return () => unsubscribe();
  }, []);
  const handleChange = (data) => {
    console.log(data);
  };
  const options = {
    // clientId: (process.env.CLIENT_ID),
    clientId: "1088400508244-eotoi28bfta05ac306sjukpvufst9aq2.apps.googleusercontent.com",
    redirectUri: "http://localhost:3000/react-google-Oauth2.0/dist/index.html",
    scopes: ["openid", "profile", "email"],
    includeGrantedScopes: true,
    accessType: "offline",
};

  return (
    <div className="App">
      {/* <header className="App-header">

        ... no changes in this part ...

        <p>The current time is {currentTime}.</p>
      </header> */}
      <label className="dynamic"> Search </label>
      <input
        className="dynamic"
        type="text"
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul>
        {filteredItems.map((value) => (
          <h3 key={value.name}>
            <input type="checkbox" onChange={() => handleChange(value.name)} />
            {value.name}
          </h3>
        ))}
      </ul>
      <div>
        EzFilter
        {/* header - textbox w search functionality */}
        {/* filter options */}
      </div>
      <GoogleButton
        placeholder="demo/search.png" // Optional
        options={options}
        apiUrl="http://localhost:5000/google_login"
        defaultStyle={true} // Optional
      />
    </div>
  );
}

export default App;