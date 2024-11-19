const mongoose = require("mongoose");
const dotenv = require("dotenv")

dotenv.config()

const uri = process.env.mongouri;

function main() {
    mongoose.connect(uri).then(() => {
        console.log("Succesfull")
    
    }).catch((err) => {
        console.log("Error: ", err)
    })
}

module.exports = { main };