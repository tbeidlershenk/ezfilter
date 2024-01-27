import React from "react";
import "./index.css";
import * as ReactDOMClient from "react-dom/client";

import App from "./App";

/* exported gapiLoaded */
/* exported gisLoaded */
/* exported handleAuthClick */
/* exported handleSignoutClick */

// TODO(developer): Set to client ID and API key from the Developer Console
const CLIENT_ID =
  "1088400508244-1943m2vkp0h1ohupsedpn480utim5d67.apps.googleusercontent.com";
const API_KEY = "AIzaSyC7eggmVj2OmvBhYWz1OLJw_1BNoZBhBnk";

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC =
  "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest";

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = "https://mail.google.com/";

const root = ReactDOMClient.createRoot(document.getElementById("root"));
root.render(<App />);

let tokenClient;
let gapiInited = false;
let gisInited = false;
let gapi = null;
let google = null;

/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
  gapi.load("client", initializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
  });
  gapiInited = true;
}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: "", // defined later
  });
  gisInited = true;
}

/**
 *  Sign in the user upon button click.
 */
export function handleAuthClick() {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      throw resp;
    }
    await syncFiltersWithGmail(gapi.client);
  };

  if (gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    tokenClient.requestAccessToken({ prompt: "consent" });
  } else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({ prompt: "" });
  }
}

/**
 * Print all Labels in the authorized user's inbox. If no labels
 * are found an appropriate message is printed.
 */
async function listLabels() {
  let response;
  try {
    response = await gapi.client.gmail.users.labels.list({
      userId: "me",
    });
  } catch (err) {
    document.getElementById("content").innerText = err.message;
    return;
  }
  const labels = response.result.labels;
  if (!labels || labels.length == 0) {
    document.getElementById("content").innerText = "No labels found.";
    return;
  }
  // Flatten to string to display
  const output = labels.reduce(
    (str, label) => `${str}${label.name}\n`,
    "Labels:\n"
  );
  document.getElementById("content").innerText = output;
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
