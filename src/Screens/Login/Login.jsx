import "./Login.css"
import UpperDecor from "../../allimages/updecoration.png"
import LowerDecor from "../../allimages/downdecoration.png"
import LoginImage from "../../allimages/LoginImage.png"
import { Link } from 'react-router-dom'
export default function Login(){
    return(
        <>
        <div className="UpDecor">
        <img id ="upperdecoration" src= {UpperDecor} alt="Decor" />
        </div>
        
        <div className="LoginBackground">
            
            <div className= "LoginImage">
            <img id ="loginimage" src= {LoginImage} alt="LoginImage" />
            </div>
    
            <div className="Loginbox">           
                <form className="Loginform">
                <h1 className="loginheading">Login</h1>
                <div className="usernamediv">
                <label className="UsernamePassword">Username</label><br></br><br></br>
                <input type="email" className="credentials"/>
                </div>
                <div className="passworddiv">
                <label className="UsernamePassword">Password</label><br></br><br></br>
                <input type="password" className="credentials"/>
                </div>
                <div className="errororforgot">
                <label className="error"> *Incorrect username or password</label>
                <label className="forgot"> Forgot password</label>
                </div>
                <Link to ="/IntervieweeDashboard"><button type="submit" className="LoginButton">Login</button>
                </Link>
                </form>
                <div className="CheckifSignUp">
                <p className="account" href="#">Dont have an account?
                <Link to ="/SignUp"><a className="SignUp" href="#">Sign Up</a>
                </Link>
                </p>
                </div>
            </div>    
        </div>
        
        <div className="DownDecor">
        <img id ="downdecoration" src={LowerDecor} alt="Decor"/>
        </div>
     
        </>
    );
}