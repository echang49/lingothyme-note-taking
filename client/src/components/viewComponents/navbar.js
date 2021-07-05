import { Link, Redirect, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import ColorLogo from "../../assets/main-logo.png";
import {ReactComponent as Search} from "../../assets/search-icon.svg"; // edit svg properties, change to camel case 
import {ReactComponent as Notification} from "../../assets/notification-icon.svg"; // edit svg properties, change to camel case 
import firebase from "../../firebase.js";
import ProfilePic from "../../assets/users/Profile1.webp";
import { Dropdown, Option } from "./dropdown.js";


function Navbar(props) {
    const [loggedIn, setLoggedIn] = useState(false);
    const location = useLocation().pathname; // current path (e.g. /mainHall)
    const [user, setUser] = useState({ loggedIn: false });
    const auth = firebase.auth();
    const [dropdownState, setDropdownState] = useState(false);

    async function handleSearch(){

    }
    
    async function showNotifications(){

    }

    const handleProfileDropdown = (e) => {
        console.log("e --> target --> value:" + e.target.value);
        // setDropdownState(e.target.value);
        console.log("handling profile click...!");
        setDropdownState(!dropdownState); // toggle menu state

        if(e.target.value === "Profile"){ // redirect to profile page
            console.log("e --> target --> value was:" + e.target.value);
            //location.href = "http://localhost:3000/profile";
            window.open('/profile', '_self');
            // <Redirect to="/profile" />

        }else if(e.target.value === "Logout"){ // logout user
            setUser({ loggedIn: false });
            return auth.signOut();
        }

    };
    var userName = "Carrot Grace";
    switch(location) { 
        case '/mainHall': 
            return (
                <div>
                    <nav>
                        <span className="nav-start">
                            <div className="logo">
                                <img src={ColorLogo} alt="LingoThyme logo" height="50px"/>
                            </div>
                        </span>
                        <span></span>
                        <span className="nav-center">
                            <Link to="/mainHall" style={{ textDecoration: 'none' }}>  {/* remove link styling */}
                                <p><div className="current-tab"> Hall</div></p>
                            </Link>
                            <div className="break"></div>
                            <Link to="/schedule" style={{ textDecoration: 'none' }}>  {/* remove link styling */}
                                    <p><div className="other-tab"> Schedule</div></p>
                            </Link>
                            <div className="break"></div>
                            <Link to="/academy" style={{ textDecoration: 'none' }}>  {/* remove link styling */}
                                    <p><div className="other-tab"> Academy</div></p>
                            </Link>
                        </span>
        
                        <span className="nav-end">
                            <button onClick={() => handleSearch()}>
                                <Search />
                            </button>
        
                            <button onClick={() => showNotifications()}>
                                <Notification />
                            </button>

                            <img src={ProfilePic} height="35px" width="35px" alt="User profile pic" />
                            <Dropdown onChange={handleProfileDropdown}>
                                <Option selected value="UserName" />
                                <Option value="Profile" />
                                <Option value="Logout" />
                            </Dropdown>
                        </span>
                    </nav>
                </div>
                
            );
        case '/schedule': 
            return (
                <div>
                    <nav>
                        <span className="nav-start">
                            <div className="logo">
                                <img src={ColorLogo} alt="LingoThyme logo" height="50px"/>
                            </div>
                        </span>
                        <span></span>
                        <span className="nav-center">
                            <Link to="/mainHall" style={{ textDecoration: 'none' }}>  {/* remove link styling */}
                                <p><div className="other-tab"> Hall</div></p>
                            </Link>
                            <div className="break"></div>
                            <Link to="/schedule" style={{ textDecoration: 'none' }}>  {/* remove link styling */}
                                    <p><div className="current-tab"> Schedule</div></p>
                            </Link>
                            <div className="break"></div>
                            <Link to="/academy" style={{ textDecoration: 'none' }}>  {/* remove link styling */}
                                    <p><div className="other-tab"> Academy</div></p>
                            </Link>
                        </span>
        
                        <span className="nav-end">
                            <button onClick={() => handleSearch()}>
                                <Search />
                            </button>
        
                            <button onClick={() => showNotifications()}>
                                <Notification />
                            </button>

                            <img src={ProfilePic} height="35px" width="35px" alt="User profile pic" />
                            <Dropdown onChange={handleProfileDropdown}>
                                <Option selected value="UserName" />
                                <Option value="Profile" />
                                <Option value="Logout" />
                            </Dropdown>

                            

                        </span>
                    </nav>
                </div>
            );
    
        case '/academy': 
            return (
                <div>
                    <nav>
                        <span className="nav-start">
                            <div className="logo">
                                <img src={ColorLogo} alt="LingoThyme logo" height="50px"/>
                            </div>
                        </span>
                        <span></span>
                        <span className="nav-center">
                            <Link to="/mainHall" style={{ textDecoration: 'none' }}>  {/* remove link styling */}
                                <p><div className="other-tab"> Hall</div></p>
                            </Link>
                            <div className="break"></div>
                            <Link to="/schedule" style={{ textDecoration: 'none' }}>  {/* remove link styling */}
                                    <p><div className="other-tab"> Schedule</div></p>
                            </Link>
                            <div className="break"></div>
                            <Link to="/academy" style={{ textDecoration: 'none' }}>  {/* remove link styling */}
                                    <p><div className="current-tab"> Academy</div></p>
                            </Link>
                        </span>
        
                        <span className="nav-end">
                            <button onClick={() => handleSearch()}>
                                <Search />
                            </button>
        
                            <button onClick={() => showNotifications()}>
                                <Notification />
                            </button>

                            <img src={ProfilePic} height="35px" width="35px" alt="User profile pic" />
                            <Dropdown onChange={handleProfileDropdown}>
                                <Option selected value="UserName" />
                                <Option value="Profile" />
                                <Option value="Logout" />
                            </Dropdown>
                        </span>
                    </nav>
                </div>
            );
            case '/profile': 
                return (
                    <div>
                        <nav>
                            <span className="nav-start">
                                <div className="logo">
                                    <img src={ColorLogo} alt="LingoThyme logo" height="50px"/>
                                </div>
                            </span>
                            <span></span>
                            <span className="nav-center">
                                <Link to="/mainHall" style={{ textDecoration: 'none' }}>  {/* remove link styling */}
                                    <p><div className="other-tab"> Hall</div></p>
                                </Link>
                                <div className="break"></div>
                                <Link to="/schedule" style={{ textDecoration: 'none' }}>  {/* remove link styling */}
                                        <p><div className="other-tab"> Schedule</div></p>
                                </Link>
                                <div className="break"></div>
                                <Link to="/academy" style={{ textDecoration: 'none' }}>  {/* remove link styling */}
                                        <p><div className="other-tab"> Academy</div></p>
                                </Link>
                            </span>
            
                            <span className="nav-end">
                                <button onClick={() => handleSearch()}>
                                    <Search />
                                </button>
            
                                <button onClick={() => showNotifications()}>
                                    <Notification />
                                </button>

                                <img src={ProfilePic} height="35px" width="35px" alt="User profile pic" />
                                <Dropdown onChange={handleProfileDropdown}>
                                    <Option selected value="UserName" />
                                    <Option value="Profile" />
                                    <Option value="Logout" />
                                </Dropdown>
                            </span>
                        </nav>
                    </div>
                );
    }
}




    
export default Navbar;
    
    
    
    