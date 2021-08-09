import { useEffect, useState, useRef } from "react";
import { Redirect, useLocation, Link} from "react-router-dom"; 

import ColorLogo from "../assets/main-logo.png";

import User from "./viewComponents/users";
import {ReactComponent as Logo} from "../assets/main-logo.svg";
import {ReactComponent as Search} from "../assets/search-icon.svg"; // edit svg properties, change to camel case 
import {ReactComponent as Notification} from "../assets/notification-icon.svg"; // edit svg properties, change to camel case 
import firebase from "../firebase.js";
import Navbar from "./viewComponents/navbar";


function Schedule() {
    const [bool, setBool] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);
    const [phase, setPhase] = useState(1);

        return(
            <div>
                {
                    bool ?
                        <div className="MainHall">
                            <Navbar />
                            <div className="body">
                                <div className="canvas">
                                    <div>
                                        <h>Schedule page WIP</h> <div className="break"></div>
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
    
export default Schedule;
