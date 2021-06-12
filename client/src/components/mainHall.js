import { useEffect, useState, useRef } from "react";
import { Redirect, useLocation, Link} from "react-router-dom"; 

import ColorLogo from "../assets/main-logo.png";
import OngoingCard from "./viewComponents/ongoingCard"; 
import ScheduledCard from "./viewComponents/scheduledCard";
import Navbar from "./viewComponents/navbar"; 


import {ReactComponent as Logo} from "../assets/main-logo.svg";
import {ReactComponent as Search} from "../assets/search-icon.svg"; // edit svg properties, change to camel case 
import {ReactComponent as Notification} from "../assets/notification-icon.svg"; // edit svg properties, change to camel case 
import firebase from "../firebase.js";


function MainHall() {
    const nameInput = useRef(null);
    const [bool, setBool] = useState(true);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const emailInput = useRef(null);
    const passInput = useRef(null);
    const [phase, setPhase] = useState(1);

    async function handleLogin() { 
        let email = emailInput.current.value;
        let pass = passInput.current.value;
        firebase.auth().signInWithEmailAndPassword(email, pass)
        .then(() => {
            setUserLoggedIn(firebase.auth.currentUser);
            <Redirect to="/mainHall" />
        }).catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === 'auth/wrong-password') {
                alert('Wrong password.');
            } else {
                alert('Error: ' + errorMessage);
            }
            console.log(error);
        });     
    }

    async function handleLogout() { // logout user
        firebase.auth.currentUser = false;
        setUserLoggedIn(false);
    }

    //firebase WIP

    // firebase.auth().onAuthStateChanged((userLoggedIn) => {
    //     if (userLoggedIn) {
    //       // User is signed in, see docs for a list of available properties
    //       // https://firebase.google.com/docs/reference/js/firebase.User
    //         return(
    //             <div>
    //                 {
    //                     bool ?
    //                         <div className="MainHall">
    //                             <Navbar />

    //                             <div className="body">
    //                                 <div className="canvas">
    //                                     <div>
    //                                         <h>main hall</h> <div className="break"></div>
    //                                         <h>Ongoing</h> <div className="break"></div> 
    //                                         <OngoingCard />
    //                                         <h>Scheduled</h> <div className="break"></div>
    //                                         <ScheduledCard />

    //                                         <Link to="/mainHall" style={{ textDecoration: 'none' }}>  {/* remove link styling */}
    //                                             <button onClick={() => handleLogout()}>
    //                                                 <p>Logout</p>
    //                                             </button>
    //                                         </Link>

    //                                     </div>
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     :
    //                         <Redirect to="/" />
    //                 }
    //             </div>
    //         );
    //     } else {
    //       // User is signed out
    //         return(
    //             <div className="enterRoom center">
    //                 <img src={ColorLogo} alt="LingoThyme Logo" height="250px"/>
    //                 <div className="input">
    //                     <label>Email:</label>
    //                     <input type="text" ref={emailInput} />
    
    //                     <label>Password:</label>
    //                     <input type="password" ref={passInput} />
                        
    //                     <Link to="/signup" style={{ textDecoration: 'none' }}>Sign up</Link>
    //                     <Link to="/passwordReset" style={{ textDecoration: 'none' }}>Forgot password?</Link>
    //                     <div className="buttons">
    //                         <button className="primary-button" onClick={() => handleLogin()} >LOGIN</button> 
    //                         <Link className="secondary-button" to="/">RETURN</Link>
    //                     </div>
    
    //                 </div>
    //             </div>
    //             );
    //     }
    //   });
    if(userLoggedIn === false) {
        return(
            <div className="enterRoom center">
                <img src={ColorLogo} alt="LingoThyme Logo" height="250px"/>
                <div className="input">
                    <label>Email:</label>
                    <input type="text" ref={emailInput} />

                    <label>Password:</label>
                    <input type="password" ref={passInput} />
                    
                    <Link to="/signup" style={{ textDecoration: 'none' }}>Sign up</Link>
                    <Link to="/passwordReset" style={{ textDecoration: 'none' }}>Forgot password?</Link>
                    <div className="buttons">
                        <button className="primary-button" onClick={() => handleLogin()} >LOGIN</button> 
                        <Link className="secondary-button" to="/">RETURN</Link>
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
                                    <Navbar />

                                    <div className="body">
                                        <div className="canvas">
                                            <div>
                                                <h>main hall</h> <div className="break"></div>
                                                <h>Ongoing</h> <div className="break"></div> 
                                                <OngoingCard />
                                                <h>Scheduled</h> <div className="break"></div>
                                                <ScheduledCard />

                                                <Link to="/mainHall" style={{ textDecoration: 'none' }}>  {/* remove link styling */}
                                                    <button onClick={() => handleLogout()}>
                                                        <p>Logout</p>
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
    
export default MainHall;
