// DB Variables ~ Initial States
let dbOpenReq;
let version = 1;
let db = null;
let objectStore = null;

/**-------------------------------------------------------------------------
 *                       CREATE DATABASE & STORE
 *------------------------------------------------------------------------**/
// Create Database
window.onload = () => {
  // Connect to DB, create if it doesn't exist
  dbOpenReq = indexedDB.open("budgetDB", version);

  // If DB doesn't connect
  dbOpenReq.addEventListener("error", (err) => {
    console.warn(err);
  });

  // If DB connected successfully
  dbOpenReq.addEventListener("success", (e) => {
    // DB has opened after upgradeNeeded
    db = e.target.result;
    console.log(`${db.name} successfully connected`, db);
  });

  // If versionNumber is changed
  dbOpenReq.addEventListener("upgradeneeded", (e) => {
    // Is fired off when: First time opening this DB
    // OR a new version was passed into open()
    db = e.target.result;
    let oldVersion = e.oldVersion;
    let newVersion = e.newVersion;
    console.log(`DB upgraded from ver.${oldVersion} to ver.${newVersion}`);

    // Check if store(collection) exists, if not, create it
    if (!db.objectStoreNames.contains("transactions")) {
      // We only have one store so I won't assign it to a variable
      db.createObjectStore("transactions", { keyPath: "id" });
    }
  });
};

/**-------------------------------------------------------------------------
 *                                 ADD FUNDS
 *------------------------------------------------------------------------**/
document.getElementById("add-btn").addEventListener("click", function (e) {
  e.preventDefault();

  // Variables
  const name = document.getElementById("t-name").value;
  const value = parseInt(document.getElementById("t-amount").value);
  const date = Date.now();

  // Document
  const transaction = {
    id: UUID(),
    name,
    value,
    date,
  };

  // Create transaction
  const tx = makeTX("transactions", "readwrite");
  // Will run once transaction is complete
  tx.oncomplete = (e) => {
    console.log(`Added transaction`, e);
  };

  // Target the store
  let store = tx.objectStore("transactions");

  // POST REQUEST
  let request = store.add(transaction);

  // What will happen after the object has been added to the DB (yet before the the transaction is considered complete)
  request.onsuccess = (e) => {
    console.log("Successfully added transaction");
  };

  // What happens if there is an error
  request.onerror = (err) => {
    console.log("Error in request to add transaction");
  };
});

/**-------------------------------------------------------------------------
 *                           SUBTRACT FUNDS
 *------------------------------------------------------------------------**/
document.getElementById("sub-btn").addEventListener("click", function (e) {
  e.preventDefault();

  // Variables
  const name = document.getElementById("t-name").value;
  const value = parseInt(document.getElementById("t-amount").value) * -1;
  const date = Date.now();

  // Document
  const transaction = {
    id: UUID(),
    name,
    value,
    date,
  };

  // Create transaction
  const tx = makeTX("transactions", "readwrite");
  // Will run once transaction is complete
  tx.oncomplete = (e) => {
    console.log(`Added transaction`, e);
  };

  // Target the store
  let store = tx.objectStore("transactions");

  // POST REQUEST
  let request = store.add(transaction);

  // What will happen after the object has been added to the DB (yet before the the transaction is considered complete)
  request.onsuccess = (e) => {
    console.log("Successfully added transaction");
  };

  // What happens if there is an error
  request.onerror = (err) => {
    console.log("Error in request to add transaction");
  };
});

/**-------------------------------------------------------------------------
 *                              HELPER FUNCTIONS
 *------------------------------------------------------------------------**/
// Function to generate unique ID's
function UUID() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

// Transaction Function
function makeTX(storeName, mode) {
  let tx = db.transaction(storeName, mode);
  tx.onerror = (err) => {
    console.warn(err);
  };
  return tx;
}
