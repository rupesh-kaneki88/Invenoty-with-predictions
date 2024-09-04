const express = require("express");
const app = express();
const store = require("../controller/store");

// Add Store 
app.post("/add", store.addStore);

// Get All Store
app.get("/get/:userID", store.getAllStores)

//udpate
app.post("/update", store.updateSelectedStore)

//delete
app.get("/delete/:id", store.deleteSelectedStore)

module.exports = app;
