import { useEffect, useState, useRef } from "react";
import { Redirect, useLocation, Link} from "react-router-dom"; 

import ColorLogo from "../assets/main-logo.png";
import OngoingCard from "./viewComponents/ongoingCard"; // DELETE
import ScheduledCard from "./viewComponents/scheduledCard"; // DELETE

import User from "./viewComponents/users";
import {ReactComponent as Logo} from "../assets/main-logo.svg";
import {ReactComponent as Search} from "../assets/search-icon.svg"; // edit svg properties, change to camel case 
import {ReactComponent as Notification} from "../assets/notification-icon.svg"; // edit svg properties, change to camel case 
import firebase from "../firebase.js";


function MainHall() {
    const nameInput = useRef(null);
    const [bool, setBool] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);
    const emailInput = useRef(null);
    const passInput = useRef(null);

    async function handleLogin() { // setup firebase auth
        let email = emailInput.current.value;
        let pass = passInput.current.value;
        try {
            await firebase.auth().signInWithEmailAndPassword(email, pass);
            setLoggedIn(true);
            window.location.href = '/mainHall';
        } catch (error) {
            alert("Wrong Credentials. If you're interested in using this service to create rooms, please email our lead developer at echang49@uwo.ca");
        }
    }

    if(loggedIn === false) {
        return(
            <div className="enterRoom center">
                <img src={Logo} alt="LingoThyme Logo" height="250px"/>
                <div className="input">
                    <label>Email:</label>
                    <input type="text" ref={emailInput} />

                    <label>Password:</label>
                    <input type="password" ref={passInput} />
                    
                    <Link to="/signup">Sign up</Link>
                    <Link to="/passwordReset">Forgot passowrd?</Link>
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
    
export default MainHall;

//components are question component, editor list component, pt 1 response, pt 2 response
//Three different stages : Brainstorming, pargraph writing, finish