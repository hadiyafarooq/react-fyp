import "./Landing.css"
import Logo from "../../allimages/FYPWebAppLogo.svg"
import UpperDecor from "../../allimages/updecoration.png"
import LowerDecor from "../../allimages/downdecoration.png"
import CoverImage from "../../allimages/CoverImage.svg"
import { Link } from 'react-router-dom'

export default function Landing(){
    return(
        <>
        <div className="Logo">
        <img id ="hairelogo" src={Logo} alt="Logo" />
        <img id ="upperdecoration" src= {UpperDecor} alt="Decor" />
        </div>
        
        <div className="StreamlineInterviews">
        <h1 className="mainheading">Streamline your interviews<br /> like never before</h1>
        <h4 className="subheading">Sick of time-consuming interviews? Let AI do the heavy lifting!</h4>
        <Link to ="/Login"><button className="getstarted">GET STARTED</button>
        </Link>
        <img id ="downdecoration" src={LowerDecor} alt="Decor"/>
        </div>
     
        <div className="VectorImage">
        <img src={CoverImage} alt="VectorImage" />
        </div>
        </>
    );
}