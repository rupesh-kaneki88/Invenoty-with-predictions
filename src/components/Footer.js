import { useState } from "react";
import { Link } from "react-router-dom";

function Footer() {
  const [formData, setFormData] = useState({
    name : "",
    message : "",
  })

  const handleInputChange = (nm,value) => {
    setFormData({...formData, [nm]: value})
  }

  const handleSubmit = async() => {
    if (formData.email === "" || formData.message === ""){
      alert("Please provide more details.")
    }
    else{
      await fetch("https://inventoryapi-l88i.onrender.com/api/sendmail/",{
        method: "post",
        headers: {
          "content-type":"application/json",
        },
        body: JSON.stringify(formData)
      })
      .then((result) => {
        console.log(result)
        alert("Your message has been sent successfully! Thank you...")
        setFormData({
          name: "",
          message: "",
        })
      })
      .catch((err) => {
        console.error(err);
        alert("Sorry, there was some issue delivering your message.")
      })

    }
  }

    return (
      <div className="min-h-full bg-gray-800">
        <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-4 py-4 item-center justify-center">
          {/* Left Column */}
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <div className="text-white italic flex flex-col">
              <p>
                Started as a freelancing project, made a few changes, and decided to make it public. Any suggestions are welcome.
                Feel free to contact. Will deploy changes soon. Thank you!
              </p>
              <span className="mt-auto self-end mr-10">-Rupesh Chavan</span><br/>
              <div className="flex justify-center items-center space-x-4 mt-4">
                <img
                  className="h-16 w-16 rounded-full"
                  src={require("../assets/rupesh.jpg")}
                  alt="profile"
                />
  
                <Link to={'https://www.linkedin.com/in/rupesh-chavan-926409154/'} target="blank">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={require("../assets/linkedin.png")}
                    alt="linkedin"
                  />
                </Link>
  
                <Link to={'https://www.instagram.com/rupesh8_8/'} target="blank">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={require("../assets/instagram.png")}
                    alt="instagram"
                  />
                </Link>
  
                <Link to={'https://github.com/rupesh-kaneki88/'} target="blank">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={require("../assets/github.png")}
                    alt="github"
                  />
                </Link>
              </div>
            </div>
          </div>
  
          {/* Right Column (Suggestions Form) */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <span className="font-bold text-white italic p-2">
                Shoot your suggestions
              </span>
              <img
                className="h-10 w-10"
                src={require("../assets/technology.png")}
                alt="technology"
              />
            </div>
  
            <input
              type="text"
              name="name"
              placeholder="Your name please"
              value={formData.name}
              onChange={(e) => {
                handleInputChange(e.target.name, e.target.value)
              }}
              className="w-full max-w-md px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              name="message"
              placeholder="Enter your message"
              rows="2"
              value={formData.message}
              onChange={(e) => {
                handleInputChange(e.target.name, e.target.value)
              }}
              className="w-full max-w-md px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            <button
              className="w-full max-w-md bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
              onClick={handleSubmit}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  export default Footer;