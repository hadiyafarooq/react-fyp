import "./IntervieweeDashboard.css"
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import WelcomeGraphics from "../../allimages/WelcomeGraphics.png"
import UserIcon from "../../allimages/usericon.png" 
import Fade from "react-reveal/Fade";

export default function UserDashboard(){
    const [isOpen, setIsOpen] = useState(false);
    const currentDate = new Date().toLocaleDateString('es-ES')
    const toggleDropdown = () => {
    setIsOpen(!isOpen);
    }
    
    function closeDropdown() {
        var dropdownContent = document.getElementById("dropdown-content");
        if (dropdownContent) {
            dropdownContent.style.display = "none";
          }
      }
  
      // Event listener for page load
      window.addEventListener("load", function() {
        closeDropdown();
      });

    return(
        <>
        <div className="WholescreenIntervieweeDashboard">  
        <div className="StartInterviewIntervieweeDashboard">
        <div className = "userheader">
        <img id ="usericon" src= {UserIcon} alt="UserIcon" />
        <p className="usernameheader">Meerub Shami</p>
        <div className="dropdown">
      <button className="dropdown-button" onClick={toggleDropdown}>
        <span className={`arrow ${isOpen ? 'open' : ''}`}>&#9660;</span>
      </button>
      {isOpen && (
        <div className="dropdown-content">
          <ul>
          <Link to ="/UpdateProfile"><li>Update Profile</li>
          </Link>
          <Link to ="/Login"><li>Log Out</li>
          </Link>
          </ul>
        </div>
      )}
        </div>
        </div>
        <div className="WelcomeGraphicIntervieweeDashboard">
          
        <h1 className="WelcomeIntervieweeDashboard">WELCOME!</h1>
        <h1 className="dateIntervieweeDashboard">{currentDate}</h1>
        <img id ="welcomeimage" src= {WelcomeGraphics} alt="WelcomeGraphic" />
        </div>   
        <Fade left duration={1000} delay={200}>
        <div className= "contentincenterinterviewee">
        <h1 className="mainheadinguser">Start your Interview!</h1>
        <h6 className="subheadinguser">As soon as you click the button below, you will be directed to the interview room</h6>
        <Link to ="/InterviewSetup"><button className="getstarteduser">START INTERVIEW</button>
        </Link>
        </div>
        </Fade>
        </div>
        </div>  
        
        </>
    );
}