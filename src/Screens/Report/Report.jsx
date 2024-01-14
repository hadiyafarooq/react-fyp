import "./Report.css";
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import WelcomeGraphics from "../../allimages/WelcomeGraphics.png";
import UserIcon from "../../allimages/usericon.png";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,Legend } from 'recharts';

const data1 = [
  { name: 'Excited', value: 12 },
  { name: 'SpeakingRate', value: 19 },
  { name: 'Fillers', value: 3 },
  { name: 'Pauses', value: 12 },
  { name: 'Tone', value: 20 },
  { name: 'Answers', value: 10 },
];

const data3 = [
  { name: 'Excited', value: 12 },
  { name: 'SpeakRate', value: 19 },
  { name: 'Fillers', value: 3 },
  { name: 'Engaged', value: 12 },
  { name: 'Stressed', value: 20 },
  { name: 'Friendly', value: 10 },
];

const data2 = [
  { name: 'Engaged', value: 8 },
  { name: 'Smiled', value: 15 },
  { name: 'Friendly', value: 5 },
  { name: 'Focused', value: 12 },
  { name: 'Stressed', value: 5 },
];

const PieChartComponent1 = () => (
  <div className="chart-container">
      <div className="chart-header">Audio Features</div>
      <PieChart width={300} height={300}>
        <Pie data={data1} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
          {data1.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={['#9ABFAC', '#E8B296', '#9FAAA7', '#E88E9D', '#B49AC5', '#9CC06C'][index]} />
          ))}
        </Pie>
        <Legend
          verticalAlign="bottom"
          height={36}
          wrapperStyle={{ fontSize: '16px' }}
        />
      </PieChart>
    </div>
  );


const PieChartComponent2 = () => (
  <div className="chart-container">
    <div className="chart-header">Video Features</div>
    <PieChart width={300} height={300}>
      <Pie data={data2} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
        {data2.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={['#9ABFAC', '#E8B296', '#9FAAA7', '#E88E9D', '#B49AC5', '#9CC06C'][index]} />
        ))}
      </Pie>
      <Legend
          verticalAlign="bottom"
          height={36}
          wrapperStyle={{ fontSize: '16px' }}
        />
    </PieChart>
  </div>
);

const BarChartComponent = () => (
  <div className="chart-container">
    <div className="chart-header">Candidate's Evaluation</div>
    <BarChart width={350} height={300} data={data3}>
      <XAxis dataKey="name" tick={{ fontSize: 8.5 }} />
      <YAxis />
      {data3.map((entry, index) => (
        <Bar key={`bar-${index}`} dataKey="value" fill="#007E85" name={entry.name} />
      ))}
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
    <div className="WholescreenReport">
      <div className="StartInterviewReport">
        <div className="userheader">
          <img id="usericon" src={UserIcon} alt="UserIcon" />
          <p className="usernameheader">Hadiya Farooq</p>
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
        <div className = "ReportAnalysis">
          <div className="UpperBorder">
          <h1 className="UpperBorderText">General Information</h1>
          <h1 className="NameInterviewee">Interviewee Name: Warda Ahmed</h1>
        <h1 className="InterviewDuration">Interviewee Duration: 15 min 30 sec</h1>
        <h1 className="CorectnessScore">Correctness Score: 11/20</h1>
          </div>
        </div>
        <div class= "LowerBorder">
        <h1 className="LowerBorderText">Graphical Representation</h1>
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
