import React, { useState, useEffect, useContext } from "react";
import AddStore from "../components/AddStore";
import AuthContext from "../AuthContext";
import UpdateStore from "../components/UpdateStore";

function Store() {
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateStore, setUpdateStore ] =useState([])
  const [updatePage, setUpdatePage] = useState(true);
  const [stores, setAllStores] = useState([]);

  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchData();
  }, [updatePage]);

  // Fetching all stores data
  const fetchData = () => {
    fetch(`http://localhost:4000/api/store/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => {
        setAllStores(data);
      })
      .catch((err) => console.log(err));
  };

  const modalSetting = () => {
    setShowModal(!showModal);
  };

  // Modal for Product UPDATE
  const updateStoreModalSetting = (selectedStoreData) => {
    console.log("Clicked: edit");
    setUpdateStore(selectedStoreData);
    setShowUpdateModal(!showUpdateModal);
  };


  const handleDelete = (id) => {
    // Logic to handle deleting a store
    console.log("Store ID: ", id);
    console.log(`http://localhost:4000/api/store/delete/${id}`);
    fetch(`http://localhost:4000/api/store/delete/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setUpdatePage(!updatePage);
      });
  };

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center ">
      <div className=" flex flex-col gap-5 w-11/12 border-2">
        <div className="flex justify-between">

          {showModal && <AddStore />}
          {showUpdateModal && (
          <UpdateStore
            updateStoreData={updateStore}
            updateModalSetting={updateStoreModalSetting}
          />
        )}

          <span className="font-bold">Manage Store</span>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs  rounded"
            onClick={modalSetting}
          >
            Add Store
          </button>
        </div>

        {stores.map((element, index) => {
          return (
            <div
              className="bg-white w-50 h-fit flex flex-col gap-4 p-4 "
              key={element._id}
            >
              <div>
                <img
                  alt="store"
                  className="h-60 w-full object-cover"
                  src={element.image}
                />
              </div>
              <div className="flex flex-col gap-3 justify-between items-start">
                <span className="font-bold">{element.name}</span>
                <div className="flex w-full items-center">
                  <img
                    alt="location-icon"
                    className="h-6 w-6"
                    src={require("../assets/location-icon.png")}
                  />
                  <span className="ml-2">{element.address + ", " + element.city}</span>
                  <div className="flex-1"></div>
                  <span>{element.owner}</span>
                </div>
                <div className="flex justify-between ">
                  <button
                    className="bg-yellow-500 hover:bg-yellow-700 text-white mr-2 font-bold p-2 text-xs rounded"
                    onClick={() => updateStoreModalSetting(element)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold p-2 text-xs rounded"
                    onClick={() => handleDelete(element._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Store;
