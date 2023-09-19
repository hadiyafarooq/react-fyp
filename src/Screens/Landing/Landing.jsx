import "./Landing.css"

export default function Landing(){
    return(
        <>
        <div class="Logo">
      <img id ="hairelogo" src="src/allimages/FYPWebAppLogo.svg" alt="Logo" />
      <img id ="upperdecoration" src="src/allimages/updecoration.png" alt="Decor" />
      
    </div>
    <div class="StreamlineInterviews">
      <h1 class="mainheading">Streamline your interviews<br /> like never before</h1>
      <h4 class="subheading">Sick of time-consuming interviews? Let AI do the heavy lifting!</h4>
      <button class="getstarted">GET STARTED</button>
      <img id ="downdecoration" src="src/allimages/downdecoration.png" alt="Decor" />
    </div>
    <div class="VectorImage">
        <img src="src/allimages/CoverImage.svg" alt="hello" />
      </div>
        </>
    );
}