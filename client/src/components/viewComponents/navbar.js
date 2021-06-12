import { Link } from "react-router-dom";
import { useState } from "react";

import ColorLogo from "../../assets/main-logo.png";
import {ReactComponent as Search} from "../../assets/search-icon.svg"; // edit svg properties, change to camel case 
import {ReactComponent as Notification} from "../../assets/notification-icon.svg"; // edit svg properties, change to camel case 
import firebase from "../../firebase.js";

function Navbar(props) {
    const [loggedIn, setLoggedIn] = useState(false);
    

    async function handleLogout() { // logout user
        setLoggedIn(false);
    }

    async function handleSearch(){

    }
    
    async function showNotifications(){

    }
    
    return (
        <div>
            <nav>
                <span className="nav-start">
                    <img src={ColorLogo} alt="LingoThyme logo" height="50px"/>
                </span>
                <span></span>
                <span className="nav-center">
                    <p><div className="current-tab"> Hall</div></p>
                    <div className="break"></div>
                    <Link to="/schedule" style={{ textDecoration: 'none' }}>  {/* remove link styling */}
                            <p><div className="other-tab"> Schedule</div></p>
                    </Link>
                    <div className="break"></div>
                    <Link to="/academy" style={{ textDecoration: 'none' }}>  {/* remove link styling */}
                            <p><div className="other-tab"> Academy</div></p>
                    </Link>
                    <div className="break"></div>
                    <Link to="/profile" style={{ textDecoration: 'none' }}>  {/* remove link styling */}
                            <p><div className="other-tab"> Profile</div></p>
                    </Link>
                </span>

                <span className="nav-end">
                    <button onClick={() => handleSearch()}>
                        <Search />
                    </button>

                    <button onClick={() => showNotifications()}>
                        <Notification />
                    </button>

                    <Link to="/mainHall" style={{ textDecoration: 'none' }}>  {/* remove link styling */}
                        <button onClick={() => handleLogout()}>
                            <p>Logout</p>
                        </button>
                    </Link>
                </span>
            </nav>
        </div>
    );
}
    
export default Navbar;
    
    
    
    