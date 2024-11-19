const User = require('../models/users')

const bcrypt = require('bcrypt');
const saltRounds = 10;

let userAuthCheck;
const login = async (req, res) => {
    console.log(req.body);
    // res.send("hi");
    try {
    
      const user = await User.findOne({
        email: req.body.email,
      });

      console.log("Entered pass: ",req.body.password)
      console.log("USER: ", user);
      if (!user) {
        console.log('User not found!');
        res.status(400).send("User not found")
        return;
    }
      if (user) {
        const match = await bcrypt.compare(req.body.password, user.password);
        if(match){
            res.send(user);
            userAuthCheck = user;
        }
      } else {
        res.status(401).send("Invalid Credentials");
        userAuthCheck = null;
      }
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  const loginGet = (req,res) =>{
    res.send(userAuthCheck);
  }

  const signup = async(req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    let registerUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
      phoneNumber: req.body.phoneNumber,
      imageUrl: req.body.imageUrl,
    });
  
    registerUser
      .save()
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => console.log("Signup: ", err));
    console.log("request: ", req.body);
  }

  module.exports = {login,signup,loginGet}