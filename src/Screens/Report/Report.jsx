import "./Report.css";
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import WelcomeGraphics from "../../allimages/WelcomeGraphics.png";
import UserIcon from "../../allimages/usericon.png";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis } from 'recharts';

const data1 = [
  { name: 'Red', value: 12 },
  { name: 'Blue', value: 19 },
  { name: 'Yellow', value: 3 },
];

const data2 = [
  { name: 'A', value: 8 },
  { name: 'B', value: 15 },
  { name: 'C', value: 5 },
];

const PieChartComponent1 = () => (
  <div className="chart-container">
    <div className="chart-header">Audio Analysis</div>
    <PieChart width={300} height={300}>
      <Pie data={data1} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
        {data1.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={['#007E85', '#005C64', '#00484F'][index]} />
        ))}
      </Pie>
    </PieChart>
  </div>
);

const PieChartComponent2 = () => (
  <div className="chart-container">
    <div className="chart-header">Video Analysis</div>
    <PieChart width={300} height={300}>
      <Pie data={data2} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
        {data2.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={['#007E85', '#005C64', '#00484F'][index]} />
        ))}
      </Pie>
    </PieChart>
  </div>
);

const BarChartComponent = () => (
  <div className="chart-container">
    <div className="chart-header">Question Response</div>
    <BarChart width={300} height={300} data={data1}>
      <XAxis dataKey="name" />
      <YAxis />
      <Bar dataKey="value" fill="#8884d8" />
    </BarChart>
  </div>
);

export default function Report() {
  const [isOpen, setIsOpen] = useState(false);
  const currentDate = new Date().toLocaleDateString('es-ES');
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    var dropdownContent = document.getElementById("dropdown-content");
    if (dropdownContent) {
      dropdownContent.style.display = "none";
    }
  }

  window.addEventListener("load", function () {
    closeDropdown();
  });

  return (
    <div className="Wholescreen">
      <div className="StartInterview">
        <div className="userheader">
          <img id="usericon" src={UserIcon} alt="UserIcon" />
          <p className="usernameheader">HR Manager</p>
          <div className="dropdown">
            <button className="dropdown-button" onClick={toggleDropdown}>
              <span className={`arrow ${isOpen ? 'open' : ''}`}>&#9660;</span>
            </button>
            {isOpen && (
              <div className="dropdown-content">
                <ul>
                  <Link to="/UpdateProfile"><li>Update Profile</li></Link>
                  <Link to="/Login"><li>Log Out</li></Link>
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="WelcomeGraphic">
          <h1 className="Welcome">Report</h1>
          <h1 className="date">{currentDate}</h1>
          <img id="welcomeimage" src={WelcomeGraphics} alt="WelcomeGraphic" />
        </div>
        <div className="charts-container">
          <PieChartComponent1 />
          <PieChartComponent2 />
          <BarChartComponent />
        </div>
      </div>
    </div>
  );
}
