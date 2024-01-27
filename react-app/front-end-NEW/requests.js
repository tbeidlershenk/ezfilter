async function getFiltersFromFirebase() {
  fetch("/filters").then((res) => {
    return res.json();
  });
}

async function syncFiltersWithGmail(client) {
    console.log("here");
    fetch("/sync", {body: JSON.stringify(client)}).then((res) => {
      return res.json();
    });
  }
  
