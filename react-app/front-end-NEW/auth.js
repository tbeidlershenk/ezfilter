
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

let tokenClient;
let gapiInited = false;
let gisInited = false;

document.getElementById("authorize_button").style.visibility = "hidden";

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
  maybeEnableButtons();
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
  maybeEnableButtons();
}

/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    document.getElementById("authorize_button").style.visibility = "visible";
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      throw resp;
    }
    document.getElementById("signout_button").style.visibility = "visible";
    document.getElementById("authorize_button").innerText = "Refresh";
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

async function getFiltersFromFirebase() {
  await fetch("/filters").then((res) => {
    return res.json();
  });
}

async function syncFiltersWithGmail(client) {
    console.log("here");
    await fetch("/sync").then((res) => {
      return res.json();
    });
  }
  


// stuff for UI
const people = [
  { name: 'Newletters'},
  { name: 'College Emails'},
  { name: 'Jobs'},
  { name: 'Verification Emails'},
  { name: 'Venmo Receipts'},
  { name: 'Uber Receipts'},
  { name: 'LinkedIn Jobs'},
  { name: 'Social Media'},
]

// filters the differents things based on what was typed
const searchInput = document.querySelector('input');
searchInput.addEventListener("input", (e) => {
  // inside, we will need to achieve a few things:
  // 1. declare and assign the value of the event's target to a variable AKA whatever is typed in the search bar
  let value = e.target.value

  // 2. check: if input exists and if input is larger than 0
  if (value && value.trim().length > 0){
      // 3. redefine 'value' to exclude white space and change input to all lowercase
       value = value.trim().toLowerCase()
      // 4. return the results only if the value of the search is included in the person's name
      // we need to write code (a function for filtering through our data to include the search input value)
      setList(people.filter(person => {
        return person.name.includes(value)
    }));
    } else {
      // 5. return nothing
      clearList()
      // input is invalid -- show an error message or show no results

  }

});
let checkedValues = [];

function displayAllPeople() {
  setList(people);
}

document.addEventListener("DOMContentLoaded", function() {
  displayAllPeople();
});

function noResults(){
  // create an element for the error; a list item ("li")
  const error = document.createElement('li')
  // adding a class name of "error-message" to our error element
  error.classList.add('error-message')

  // creating text for our element
  const text = document.createTextNode('No results found. Sorry!')
  // appending the text to our element
  error.appendChild(text)
  // appending the error to our list element
  list.appendChild(error)
}

const clearButton = document.getElementById('clear')

clearButton.addEventListener("click", () => {
  clearList()
})

function clearList(){
  // looping through each child of the search results list and remove each child
  while (list.firstChild){
      list.removeChild(list.firstChild);
  }
}

function setList(results){
  clearList();
  checkedValues = []; // Clear the array when resetting the list
  for (const person of results) {
    const resultItem = document.createElement('li');
    resultItem.classList.add('result-item');

    const container = document.createElement('label');
    container.classList.add('container');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'personCheckbox';
    checkbox.value = person.name;

    // Add an event listener to the checkbox
    checkbox.addEventListener('change', function () {
      if (this.checked) {
        checkedValues.push(this.value);
      } else {
        const index = checkedValues.indexOf(this.value);
        if (index !== -1) {
          checkedValues.splice(index, 1);
        }
      }
      console.log('Checked values:', checkedValues);
    });

    const checkmark = document.createElement('span');
    checkmark.classList.add('checkmark');

    container.appendChild(checkbox);
    container.appendChild(checkmark);

    const text = document.createTextNode(person.name);

    resultItem.appendChild(container);
    resultItem.appendChild(text);

    list.appendChild(resultItem);
  }

  if (results.length === 0) {
    noResults();
  }
}