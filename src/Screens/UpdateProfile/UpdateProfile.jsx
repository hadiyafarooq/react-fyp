import "./UpdateProfile.css"
import UpperDecor from "../../allimages/updecoration.png"
import LowerDecor from "../../allimages/downdecoration.png"
import UpdateProfileImage from "../../allimages/SignUpImage.png"
import { Link } from 'react-router-dom'
import Fade from "react-reveal/Fade";
export default function UpdateProfile(){
    return(
        <>
        <div className="WholescreenUpdateProfile"> 
        <div className="UpDecor">
        <img id ="upperdecoration" src= {UpperDecor} alt="Decor" />
        </div>
        <Fade left duration={1000} delay={200}>
        <div className="UpdateProfileBackground">
            
            <div className= "UpdateProfileImage">
            <img id ="loginimage" src= {UpdateProfileImage} alt="LoginImage" />
            </div>
    
            <div className="UpdateProfilebox">           
                <form className="UpdateProfileform">
                <h1 className="UpdateProfileheading">Update Profile</h1>
                <div className="usernamedivupdateprofile">
                <label className="Inputtextboxupdateprofile">Full Name</label><br></br>
                <input type="text" className="credentials"/>
                </div>
                <div className="emaildivupdateprofile">
                <label className="Inputtextboxupdateprofile">User Name</label><br></br>
                <input type="text" className="credentials"/>
                </div>
                <div className="passworddivupdateprofile">
                <label className="Inputtextboxupdateprofile">Email</label><br></br>
                <input type="email" className="credentials"/>
                </div>
                <div className="confirmpassworddivupdateprofile">
                <label className="Inputtextboxupdateprofile">Password</label><br></br>
                <input type="password" className="credentials"/>
                </div>
                <Link to ="/RecruiterDashboard"><button type="submit" className="UpdateProfileButton">Submit</button>
                </Link>
                </form>
                </div>    
        </div>
        </Fade>
        <div className="DownDecor">
        <img id ="downdecoration" src={LowerDecor} alt="Decor"/>
        </div>
        </div>
        </>
    );
}