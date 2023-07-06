import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { userLogin, phoneLogin, getUser } from "../../firebase/firebase-calls";
import { auth, db} from "../../firebase/firebase"

// import { signInWithGoogle } from "../../firebase/firebase";
import { getAnalytics, logEvent } from "firebase/analytics";
import SignUpPop from "../../pages/circles/Signup"
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import OtpInput from 'react-otp-input';



import { defaultAvatar } from "utils/Constants";
import toast from "react-hot-toast";
import { collection, doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile, PhoneAuthProvider} from "firebase/auth";
import { signup } from "./userSlice";


import { login, updateDP } from "features/user/userSlice";
import { signInWithEmailAndPassword, signInWithPhoneNumber,RecaptchaVerifier } from "firebase/auth";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useSelector } from "react-redux";
import { handleBreakpoints } from "@mui/system";

import disko_logo from "assets/disko_logo.png";
import us_flag from "assets/usa_flag.png";



function recordLogin() {
  const analytics = getAnalytics();
  logEvent(analytics, 'disko_login');
  console.log("login recorded to analytics\n");
};

export default function Login() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [showPassword, setShowPassword] = useState(false);
//   const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
//   let userAuth;


//   const [loginDetails, setLoginDetails] = useState({
//     phoneNum: "",
//     name: "",
//     password: "",
//     email: "",
//   });
  



// const signin = () => {
//   // if (mynumber === "" || mynumber.length < 10) return;
//   let verify = new RecaptchaVerifier('recaptcha-container',{
//     size: "invisible"
// }, auth);
//   userAuth = signInWithPhoneNumber(auth, "+1" +mynumber, verify).then((result) => {
//       setfinal(result);
//       toast.success("Sent Code");
//       // alert("code sent")
//       setshow(true);
//       document.body.style.zoom = "100%";
//   })
//       .catch((err) => {
//           // alert(err);
//           toast.error(err);
//           window.location.reload()
//       });
// }

// const ValidateOtp = () => {
//   if (otp === null || final === null)
//       return;
//   final.confirm(otp).then((result) => {
//       // alert("Success");
//       toast.success("Success!");
//       localStorage.setItem("authToken", result.user.accessToken);
//       console.log(result)
//       recordLogin()
//       // check if signedup yet if have, walk on in
     
//       navigate("/");
      
      
      
//   }).catch((err) => {
//     console.log(err)
//     console.log("final: " + JSON.stringify(final) + ", OTP: " + otp + "userAuth+ " + userAuth)
//       toast.error("Wrong code inputted");
//       //alert("Wrong code");
//   })
// }



// const [mynumber, setnumber] = useState("");
// const [otp, setotp] = useState('');
// const [show, setshow] = useState(false);
// const [final, setfinal] = useState('');

const { user } = useSelector((state) => state.user);
const currentUser = auth?.currentUser;
const navigate = useNavigate();

let userAuth;


const dispatch = useDispatch();
const [userInfo, setUserInfo] = useState({
  title: "",
  adddress: "",
  description: "",
  costs: "",
  coverPic: ""
});




const signin = () => {
// if (mynumber === "" || mynumber.length < 10) return;
console.log(mynumber)
let verify = new RecaptchaVerifier('recaptcha-container',{'size': 'invisible'}, auth);

// change flow of signin

userAuth = signInWithPhoneNumber(auth, "+1" + mynumber, verify).then((result) => {
    setfinal(result);
    toast.success("Sent Verifcation Code")
    setshow(true);
})
    .catch((err) => {
        toast.error(err);
        window.location.reload();
    });
}

const ValidateOtp = () => {
if (otp === null || final === null)
    return;
final.confirm(otp).then((result) => {
    toast.success("Successful! Logging in")
    localStorage.setItem("authToken", result.user.accessToken);
    console.log(result)
    //check if signedup yet if have, walk on in
    if (result.user.metadata.creationTime == result.user.metadata.lastSignInTime){
      phoneLogin("+1"+ mynumber, result.user.uid, name, dispatch)
      navigate("/")
    }
    else{navigate("/")}

      
  }).catch((err) => {
    console.log(err)
    console.log("final: " + JSON.stringify(final) + ", OTP: " + otp + "userAuth+ " + userAuth)
      toast.error("Wrong Code")
  })
}
function handleOnChange(value) {
  setName(value);
}

const handleSubmit = (event) => {
  event.preventDefault();
  if (!name) {
    toast.error('Name input cannot be empty!');
  } else {
    // Submit the form
    signin();
  }
};

const [mynumber, setnumber] = useState("+1");
const [otp, setotp] = useState('');
const [show, setshow] = useState(false);
const [final, setfinal] = useState('');
const [name, setName] = useState('');
const handleChange = (code) => setotp(code);





  return (
    <div classname="w-full h-full">
        {(!show) ? (
        <div class="blue_bg flex flex-col items-center mx-auto min-h-screen">
          <img src={disko_logo} alt="logo" className="h-1/3 w-1/3 mt-48 md:mt-0 md:h-[650px] md:w-[650px]"></img>
          <div class="text-white font-semibold md:text-2xl">What's your number?</div>
          <div class="mt-8 rounded-md flex flex-row justify-center w-90">
            <img src={us_flag} className="h-10 w-10 md:h-[49px] md:w-[49px] border border-white p-2 rounded-md grey_bg border-solid"></img>
          { /*<label for="default-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Default input</label> */ }
          <input type="text" placeholder="XXX-XXX-XXXX" pattern="[0-9]*" id="number" onChange={(e) => { setnumber(e.target.value) }} class="mx-2 grey_bg border border-solid border-white rounded-lg text-white text-sm md:text-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"/>
          </div>

          <div id="recaptcha-container"></div>
          <div className="flex flex-row space-x-4 md:space-x-8">
          <button class="mt-8 login-btn fontInter" onClick={signin}>Login</button>
          <button class="mt-8 login-btn fontInter" onClick={() => setShowSignUp((prev) => !prev)}>Sign up</button>
          </div>

        </div>): (
            <div class= "blue_bg flex flex-col items-center mx-auto w-full min-h-screen">
            <img src={disko_logo} alt="logo" class="h-1/3 w-1/3 mt-48 mx-auto md:mt-0"></img>
            <div class="text-white font-semibold">Enter 6-Digit Code</div>
            <div class="mt-8">
            <input type="text" placeholder="XXXXXX" pattern="[0-9]*" id="" value={otp} onChange={(e) => { handleChange(e.target.value) }} class="mx-2 grey_bg border border-solid border-white rounded-lg text-white text-md focus:ring-gray-500 focus:border-gray-500 block w-50 p-2.5"/>

             {/* <OtpInput classname= ""
            value={otp}
            onChange={handleChange}
            numInputs={6}
            separator={<span style={{ width: "8px" }}></span>}
            isInputNum={true}
            shouldAutoFocus={true}
            inputStyle={{
              border: "1px solid #f8fafc",
              borderRadius: "8px",
              width: "42px", 
              fontSize: "12px",
              color: "#f8fafc",
              fontWeight: "400",
              caretColor: "black"
            }}
            focusStyle={{
              border: "1px solid #CFD3DB",
              outline: "none"
            }} /> */}
            </div>
            <button class="mt-8 m-2 login-btn fontInter" onClick={ValidateOtp}>Verify</button>
          </div>)}
          {showSignUp && (
        <div className="h-full w-full">
          <div className="fixed flex h-1/2 w-80 items-center justify-center bg-gray-900 opacity-70 "></div>
          <SignUpPop
            setShowModal={setShowSignUp}
            joining={false}
          />
        </div>
      )}
          </div>
    // <div className="flex justify-center bg-white">
     
    //   {
    //     // (showLogin)?
    //   (<div
    //     className=""
    //   >
    //     <div><h1 className="text-xl font-semibold">What's your phone number?</h1>
    //     <input
    //       className="h-9 w-full bg-gray-100 p-2"
    //       placeholder="+1"
    //       onChange={(e) => { setnumber(e.target.value) }}
  
    //     />
    //     <br /><br />

    //     <div id="recaptcha-container">hello</div>
    //     </div>
        

        
        
    //     <div className="mt-10 flex w-full gap-2">
    //       {!show ? (<button
    //         onClick={signin}
    //         className="w-1/2 text-lg rounded-md border-2 bg-gray-200 py-1 px-4"
    //       >
    //         Send OTP
    //       </button>):
    //       (<button
    //         type="submit"
    //         className="w-1/2 text-lg rounded-md border-2 bg-gray-200 py-1 px-4"
    //       >
    //         Verify
    //       </button>)}
    //     </div>
    //     <p>
    //     <div>
    //   {/* <button className="button" onClick={signInWithGoogle}>Sign in with google</button> */}
    // </div>
    //       {/* <Link to="/signup" className="font-semibold text-gray-500">
    //         Create Account
    //       </Link> */}
    //     </p>
    //   </div>)
      
    //   //   <div className="main mt-0 flex flex-col overflow-hidden w-full">
    //   //     <main className="flex-grow">
    //   //       <HeroHome />
    //   //       <CircleFeatures/>
    //   //       <div className="w-full flex flex-col p-4">
    //   //         <button type="button" class=" text-white text-center md:w-1/2 md:mx-auto font-bold bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 rounded-lg text-sm py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
    //   //               onClick={()=>setShowLogin(true)}
    //   //               >Login
    //   //         </button>
    //   //       </div>
    //   //       <Footer/>
    //   //       {/* <FeaturesHome setShowLogin={loginClick}/> */}
    //   //       {/* <Testimonials/> */}
    //   //     </main>

    //   // </div>
      

      
    //   }
    // </div>
  );
}

