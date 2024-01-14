import "./RecruiterDashboard.css"
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import WelcomeGraphics from "../../allimages/WelcomeGraphics.png"
import UserIcon from "../../allimages/usericon.png" 
import axios from "axios";
import Fade from "react-reveal/Fade";
export default function RecruiterDashboard(){
    const [isOpen, setIsOpen] = useState(false);
    const [intervieweeData, setIntervieweeData] = useState([]);
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

      // useEffect(() => {
      //   // Fetch interview data from the API
      //   const fetchData = async () => {
      //     try {
      //       const response = await axios.get("http://127.0.0.1:5001/InterviewData");
      //       setIntervieweeData(response.data);
      //     } catch (error) {
      //       console.error('Error fetching interview data:', error.message);
      //     }
      //   };
    
      //   fetchData();
      // }, []);
    return(
        <>
        <div className="Wholescreen">  
        <div className="StartManage">
        <div className = "userheader">
        <img id ="usericon" src= {UserIcon} alt="UserIcon" />
        <p className="usernameheader">Hadiya Farooq</p>
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
        
        <div className="WelcomeGraphicRecruiterDashboard">
        <h1 className="Welcome">WELCOME!</h1>
        <h1 className="date">{currentDate}</h1>
        <img id ="welcomeimage" src= {WelcomeGraphics} alt="WelcomeGraphic" />
        </div>    
        
        <Fade left duration={1000} delay={200}>
        <div className= "contentincenter">
        <table>
      <thead>
      <tr>
          <th colSpan="3">INTERVIEW STATUS</th>
        </tr>
        <tr>
          <th>Names</th>
          <th>Contact</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
      <tr>
          <td className="name">Taha Farooq</td>
          <td className="contact">ghi@gmail.com</td>
          <td className="status-cell">
            <span className="pending-circle"></span>
          </td>
        </tr>
        <tr>
        <Link to = '/Report' className="name"> 
          <td >Warda Ahmed</td>
          </Link>
          <td className="contact">jkl@gmail.com</td>
          <td className="status-cell">
            <span className="completed-circle"></span> 
          </td>
          
        </tr>
        <tr>
          <td className="name"> Zuha Umar</td>
          <td className="contact">mno@gmail.com</td>
          <td className="status-cell">
            <span className="pending-circle"></span>
          </td>
        </tr>
        <tr>
        <Link to = '/Report' className="name"> 
          <td>Meerub Shami</td>
          </Link>
          <td>def@gmail.com</td>
          <td className="status-cell">       
            <span className="completed-circle"></span>
            
          </td>
        </tr>
        <tr>
          <td>Waleed Bin Osama</td>
          <td>pqr@gmail.com</td>
          <td className="status-cell">         
          <span className="pending-circle"></span>
          </td>
        </tr>

      </tbody>
      {/* {intervieweeData.map((entry, index) => (
                  <tr key={index}>
                    <td className="name">{entry.name}</td>
                    <td className="contact">{entry.contact}</td>
                    <td className="status-cell">
                      <span className={`${entry.status}-circle`}></span>
                    </td>
                  </tr>
                ))} */}
    </table>
        </div>
        </Fade>
        </div>
        </div>  
        </>
    );
}