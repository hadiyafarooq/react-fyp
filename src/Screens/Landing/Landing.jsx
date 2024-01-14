import "./Landing.css"
import Logo from "../../allimages/FYPWebAppLogo.svg"
import UpperDecor from "../../allimages/updecoration.png"
import LowerDecor from "../../allimages/downdecoration.png"
import CoverImage from "../../allimages/CoverImage.svg"
import { Link } from 'react-router-dom'
import Fade from 'react-reveal/Fade';

export default function Landing(){
    return(
        <>
        
        <div className="LandingLogo">
        <img id ="hairelandinglogo" src={Logo} alt="Logo" />
        <img id ="upperdecorationlanding" src= {UpperDecor} alt="Decor" />
        </div>
        <Fade left duration={1000} delay={200}>   
        <div className="StreamlineInterviewsLanding">
        <h1 className="mainheadinglanding">Streamline your interviews<br /> like never before</h1>
        <h4 className="subheadinglanding">Sick of time-consuming interviews? Let AI do the heavy lifting!</h4>
        <Link to ="/Login"><button className="getstartedlanding">GET STARTED</button>
        </Link>
        </div>
        </Fade>
        <img id ="downdecorationlanding"src={LowerDecor} alt="LowerDecor" />
        <Fade left duration={1000} delay={200}>   
        <div className="VectorImageLanding">
        <img src={CoverImage} alt="VectorImage" />
        </div>
        </Fade>
        </>
    );
}