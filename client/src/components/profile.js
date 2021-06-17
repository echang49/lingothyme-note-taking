import { useEffect, useState, useRef } from "react";
import { Redirect, useLocation, Link} from "react-router-dom"; 

import ColorLogo from "../assets/main-logo.png";
import ProfilePic from "../assets/users/Profile1.webp";

import {ReactComponent as Logo} from "../assets/main-logo.svg";
import {ReactComponent as Search} from "../assets/search-icon.svg"; // edit svg properties, change to camel case 
import {ReactComponent as Notification} from "../assets/notification-icon.svg"; // edit svg properties, change to camel case 
import firebase from "../firebase.js";
import Navbar from "./viewComponents/navbar";


function Profile() {
    const [bool, setBool] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);
    const [phase, setPhase] = useState(1);

        return(
            <div>
                {
                    bool ?
                        <div className="MainHall">
                            <Navbar />
                            <div className="profile">
                                <div className="profile-left-container">

                                </div>
                                <div className="profile-container">
                                    <div className="remind">
                                        <h>Remind</h>
                                    </div>

                                    <div className="achievments">
                                        <h>Achievements</h>
                                    </div>

                                    <div className="friends">
                                        <h>Friends</h>
                                    </div>
                                    

                                    <div className="profile-box">
                                        <img src={ProfilePic} height="75px" width="75px" alt="User profile pic" />
                                        <h>UserName</h>
                                    </div>

                                    <div className="about-me">
                                        <h>About Me</h>
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
    
export default Profile;
