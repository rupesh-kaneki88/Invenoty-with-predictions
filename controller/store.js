const Store = require("../models/store");

// Add Store
const addStore = async (req, res) => {
    console.log(req.body)
  const addStore = await new Store({
    userID : req.body.userId,
    name: req.body.name,
    pincode: req.body.pincode,
    address: req.body.address,
    city: req.body.city,
    owner: req.body.owner,
    gst_no: req.body.gst_no,
    image: req.body.image
  });

  addStore.save().then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(402).send(err);
    });
};

// Get All Stores
const getAllStores = async (req, res) => {
  const findAllStores = await Store.find({"userID": req.params.userID}).sort({ _id: -1 }); // -1 for descending;
  res.json(findAllStores);
};

//Update selected store
const updateSelectedStore = async(req,res) =>{
  try{
    const updatedResult = await Store.findByIdAndUpdate(
      {_id: req.body.storeID},
      {
        name: req.body.name,
        pincode: req.body.pincode,
        address: req.body.address,
        city: req.body.city,
        owner: req.body.owner,
        gst_no: req.body.gst_no,
      },
      { new: true}
    );
    console.log(updatedResult)
    res.json(updatedResult)
  }
  catch(e) {
    console.log(e)
    res.status(400).send("error")
  }
}

const deleteSelectedStore = async(req,res) =>{
  const deleteStore = await Store.deleteOne(
    {_id: req.params.id}
  )
  res.json(deleteStore)
}

module.exports = { addStore, getAllStores, updateSelectedStore, deleteSelectedStore };
