import "./SignUp.css"
import UpperDecor from "../../allimages/updecoration.png"
import LowerDecor from "../../allimages/downdecoration.png"
import SignUpImage from "../../allimages/SignUpImage.png"
import { Link } from 'react-router-dom'
export default function SignUp(){
    return(
        <>
        <div className="UpDecor">
        <img id ="upperdecoration" src= {UpperDecor} alt="Decor" />
        </div>
        
        <div className="SignUpBackground">
            
            <div className= "SignUpImage">
            <img id ="loginimage" src= {SignUpImage} alt="LoginImage" />
            </div>
    
            <div className="SignUpbox">           
                <form className="SignUpform">
                <h1 className="SignUpheading">Sign Up</h1>
                <div className="usernamediv">
                <label className="Inputtextbox">Full Name</label><br></br>
                <input type="text" className="credentials"/>
                </div>
                <div className="emaildiv">
                <label className="Inputtextbox">User Name</label><br></br>
                <input type="text" className="credentials"/>
                </div>
                <div className="passworddiv">
                <label className="Inputtextbox">Email</label><br></br>
                <input type="email" className="credentials"/>
                </div>
                <div className="confirmpassworddiv">
                <label className="Inputtextbox">Password</label><br></br>
                <input type="password" className="credentials"/>
                </div>
                <div className="termsandservices">
                <input type="checkbox" className="checkboxforterm"/>
                <label className="termandserv"> By creating an account, I agree to the <strong>Terms of use</strong> and <strong>Privacy policy.</strong></label>
                </div>
                <Link to ="/RecruiterDashboard"><button type="submit" className="SignUpButton">Sign Up</button>
                </Link>
                </form>
                <div className="CheckifLogin">
                <p className="account">Already have an account?
                <Link to ="/Login"><a className="SignUp" href="#">Log In</a>
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