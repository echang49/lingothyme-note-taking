import { useEffect, useState, useRef } from "react";
import { Redirect, useLocation, Link} from "react-router-dom"; 

import ColorLogo from "../assets/main-logo.png";
import OngoingCard from "./viewComponents/ongoingCard"; // DELETE
import ScheduledCard from "./viewComponents/scheduledCard"; // DELETE

import {ReactComponent as Logo} from "../assets/main-logo.svg";
import firebase from "../firebase.js";


function SignUp() {
    const nameInput = useRef(null);
    const [bool, setBool] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);
    const emailInput = useRef(null);
    const passInput = useRef(null);
    const confirmPassInput = useRef(null);
    const auth = firebase.auth();
    const db = firebase.firestore();
    const [ url, setURL ] = useState("/signup");

    async function handleSubmit() { // signup
        let email = emailInput.current.value;
        let pass = passInput.current.value;
        let confirmPass = confirmPassInput.current.value;

        // let code = textInput.current.value;
        // axios.post("/api/auth/enterRoom", {code})
        // .then((res) => {
        //   if(res.data[0]) {
        //     if(res.data[1]) {
        //       setURL("/admin/room?id=".concat(code));
        //     }
        //     else {
        //       setURL("/room?id=".concat(code));
        //     }
        //     setBool(false);
        //   }
        //   else {
        //     alert("Incorrect code. Ensure you have the proper room code.");
        //   }
        // })
        // .catch((err) => {
        //   alert(err);
        // });
        
        if(pass === confirmPass){ // check to see if passwords match
            firebase.auth().createUserWithEmailAndPassword(email, password)
            .catch(function(error) { 
                // if email or password not valid, throw error
                var errorCode = error.code;
                //var errorMessage = error.message;
                if (errorCode == 'auth/weak-password') {
                    alert('The password is too weak, please try again.');
                } else if(errorCode == 'auth/email-already-in-use') {
                    alert('This email is already in use.');
                } else if(errorCode == 'auth/invalid-email'){
                    alert('Email is invalid, please try again.');
                }else{
                    alert(errorCode);
                }
                console.log(error);
            });
            // if no errors thrown, send user to mainHall
            setURL("/mainHall");
            <Redirect push to={url} />;
        }else{
            alert("passwords do not match, please try again");
        }
    }
    if(loggedIn === false) {
        return(
            <div className="enterRoom center">
                <img src={Logo} alt="LingoThyme Logo" height="250px"/>
                <div className="input">
                    <label>Email:</label>
                    <input type="email" ref={emailInput} />

                    <label>Password:</label>
                    <input type="password" ref={passInput} />

                    <label>Confirm Password:</label>
                    <input type="password" ref={confirmPassInput} />

                    <div className="buttons">
                        <button className="primary-button" onClick={() => handleSubmit()} >SUBMIT</button> 
                        <Link className="secondary-button" to="/">CANCEL</Link>
                    </div>

                </div>
            </div>
        );
    }
    else {
        switch(phase) {
            case 1:
                return(
                    <div>
                        {
                            bool ?
                                <div className="MainHall">
                                    <nav>
                                        <span className="nav-start">
                                            <img src={ColorLogo} alt="LingoThyme logo" height="50px"/>
                                        </span>
                                        <span></span>
                                        <span className="nav-center">
                                            <p><div className="current-tab"> Hall</div></p>
                                            <div className="break"></div>
                                            <p><div className="other-tab"> Schedule</div></p>
                                            <div className="break"></div>
                                            <p><div className="other-tab"> Academy</div></p>
                                            <div className="break"></div>
                                            <p><div className="other-tab"> Profile</div></p>
                                        </span>

                                        <span className="nav-end">
                                            <button>
                                                <Search />
                                            </button>
                                            
                                            <button>
                                                <Notification />
                                            </button>

                                            
                                        </span>
                                    </nav>
                                    <div className="body">
                                        <div className="canvas">
                                            <div>
                                                <h>main hall</h> <div className="break"></div>
                                                <h>Ongoing</h> <div className="break"></div> 
                                                <OngoingCard />
                                                <h>Scheduled</h> <div className="break"></div>
                                                <ScheduledCard />

                                                <Link to="/" style={{ textDecoration: 'none' }}>  {/* remove link styling */}
                                                    <button>
                                                        <p>Leave </p>
                                                        <Brace />
                                                    </button>
                                                </Link>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            :
                                <Redirect to="/" />
                        }
                    </div>
                );
        }
    }
}
    
export default SignUp;

//components are question component, editor list component, pt 1 response, pt 2 response
//Three different stages : Brainstorming, pargraph writing, finish