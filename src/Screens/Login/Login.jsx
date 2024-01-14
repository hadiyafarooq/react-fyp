import "./Login.css";
import UpperDecor from "../../allimages/updecoration.png";
import LowerDecor from "../../allimages/downdecoration.png";
import LoginImage from "../../allimages/LoginImage.png";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Fade from "react-reveal/Fade";
import axios from "axios";
export default function Login() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const [loginSuccess, setLoginSuccess] = useState(true);
  const navigate = useNavigate();

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("credentials", credentials);
  
      // Make sure you have the correct endpoint and data format for your backend
      const response = await axios.post("http://127.0.0.1:5001/Login", credentials, config);
  
      if (response && response.data.success) {
        setLoginSuccess(true);
        if(response.data.role === "recruiter")
        {
            navigate("/RecruiterDashboard");
        } 
        else if(response.data.role === "interviewee"){
            navigate("/IntervieweeDashboard");
        }
      } else {
        setLoginSuccess(false);
      }
    } catch (error) {
      console.error("Error during POST request:", error.message);
      setLoginSuccess(false);
    }
  };
  
  return (
    <>
    <div className="WholescreenLogin">
      <div className="UpDecorLogin">
        <img id="upperdecorationlogin" src={UpperDecor} alt="Decor" />
      </div>

      <Fade left duration={1000} delay={200}>
        <div className="LoginBackground">
          <div className="LoginImage">
            <img id="loginimage" src={LoginImage} alt="LoginImage" />
          </div>

          <div className="Loginbox">
            <form className="Loginform">
              <h1 className="loginheading">Login</h1>
              <div className="usernamedivlogin">
                <label className="UsernamePasswordLogin">Username</label>
                <br></br>
                <br></br>
                <input
                  name="username"
                  type="username"
                  onChange={handleInputChange}
                  className="credentialslogin"
                />
              </div>
              <div className="passworddivlogin">
                <label className="UsernamePasswordLogin">Password</label>
                <br></br>
                <br></br>
                <input
                  name="password"
                  type="password"
                  onChange={handleInputChange}
                  className="credentialslogin"
                />
              </div>
              <div className="errororforgotlogin">
                {loginSuccess && (
                    <>
                    <label className="successlogin">Login successful</label>
                    <label className="forgotloginerror"> Forgot password</label>
                    </>
                  
                )}
                {!loginSuccess && (
                    <>
                    <label className="errorlogin">Incorrect username or password</label>
                    <label className="forgotloginsuccess"> Forgot password</label>
                    </>
                  
                )}
                
              </div>
              <button
                type="submit"
                onClick={(e) => {
                  handleSubmit(e);
                }}
                className="LoginButton"
              >
                Login
              </button>
            </form>

            <div className="CheckifSignUpLogin">
              <p className="accountlogin" href="#">
                Dont have an account?
                <Link to="/SignUp" className="SignUpLogin">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </Fade>
      <div className="DownDecor">
        <img id="downdecoration" src={LowerDecor} alt="Decor" />
      </div>
      </div>
    </>
  );
}
