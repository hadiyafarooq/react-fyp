import "./RecruiterDashboard.css"
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import WelcomeGraphics from "../../allimages/WelcomeGraphics.png"
import UserIcon from "../../allimages/usericon.png" 

export default function RecruiterDashboard(){
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
        <div className="Wholescreen">  
        <div className="StartManage">
        <div className = "userheader">
        <img id ="usericon" src= {UserIcon} alt="UserIcon" />
        <p className="usernameheader">HR Manager</p>
        <div className="dropdown">
      <button className="dropdown-button" onClick={toggleDropdown}>
        <span className={`arrow ${isOpen ? 'open' : ''}`}>&#9660;</span>
      </button>
      {isOpen && (
        <div className="dropdown-content">
          <ul>
          <Link to ="/UserDashboard"><li>Update Profile</li>
          </Link>
          <Link to ="/Login"><li>Log Out</li>
          </Link>
          </ul>
        </div>
      )}
        </div>
        </div>
        <div className="WelcomeGraphic">
        <h1 className="Welcome">WELCOME!</h1>
        <h1 className="date">{currentDate}</h1>
        <img id ="welcomeimage" src= {WelcomeGraphics} alt="WelcomeGraphic" />
        </div>    
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
          <td className="name">John Doe</td>
          <td className="contact">john@example.com</td>
          <td className="status-cell">
            <span className="pending-circle"></span>
          </td>
        </tr>
        <tr>
          <td>Jane Smith</td>
          <td>jane@example.com</td>
          <td className="status-cell">
            <span className="completed-circle"></span>
          </td>
        </tr>
        <tr>
          <td>Alice Johnson</td>
          <td>alice@example.com</td>
          <td className="status-cell">
            <span className="pending-circle"></span>
          </td>
        </tr>
        <tr>
          <td>Bob Brown</td>
          <td>bob@example.com</td>
          <td className="status-cell">
            <span className="completed-circle"></span>
          </td>
        </tr>
        <tr>
          <td>Eve Wilson</td>
          <td>eve@example.com</td>
          <td className="status-cell">
            <span className="pending-circle"></span>
          </td>
        </tr>
      </tbody>
    </table>
        </div>
        </div>
        </div>  
        </>
    );
}