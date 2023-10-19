import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Landing from './Screens/Landing/Landing'
import Login from './Screens/Login/Login'
import SignUp from './Screens/SignUp/SignUp'
import UserDashboard from './Screens/IntervieweeDashboard/IntervieweeDashboard'
import IntervieweeDashboard from './Screens/IntervieweeDashboard/IntervieweeDashboard'
import RecruiterDashboard from './Screens/RecruiterDashboard/RecruiterDashboard'
import InterviewSetup from './Screens/InterviewSetup/InterviewSetup'
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
        <Route path='/' element={Landing()}/>
        <Route path='/Login' element={Login()}/>
        <Route path='/SignUp' element={SignUp()}/>
        <Route path='/IntervieweeDashboard' element={IntervieweeDashboard()}/>
        <Route path='/RecruiterDashboard' element={RecruiterDashboard()}/>
        <Route path='/InterviewSetup' element={InterviewSetup()}/>
        </Routes>
      </BrowserRouter>
    
    </>
  );
}

export default App;
