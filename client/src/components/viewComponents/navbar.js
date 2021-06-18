import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import ColorLogo from "../../assets/main-logo.png";
import {ReactComponent as Search} from "../../assets/search-icon.svg"; // edit svg properties, change to camel case 
import {ReactComponent as Notification} from "../../assets/notification-icon.svg"; // edit svg properties, change to camel case 
import firebase from "../../firebase.js";
import ProfilePic from "../../assets/users/Profile1.webp";

function Navbar(props) {
    const [loggedIn, setLoggedIn] = useState(false);
    const location = useLocation().pathname; // current path (e.g. /mainHall)
    const [user, setUser] = useState({ loggedIn: false });
    const auth = firebase.auth();
    

    async function handleLogout() { // logout user
        setUser({ loggedIn: false });
        return auth.signOut();
    }

    async function handleSearch(){
        console.log("location: " + location);

    }
    
    async function showNotifications(){

    }
    
    switch(location) { // change current tab highlighting depending on current page user is on
        case '/mainHall': 
            return (
                <div>
                    <nav>
                        <span className="nav-start">
                            <img src={ColorLogo} alt="LingoThyme logo" height="50px"/>
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

                            <img src={ProfilePic} height="35px" width="35px" alt="User profile pic" />
                            <div className="center"><p>UserName</p></div>
                        </span>
                    </nav>
                </div>
            );
        case '/schedule': 
            return (
                <div>
                    <nav>
                        <span className="nav-start">
                            <img src={ColorLogo} alt="LingoThyme logo" height="50px"/>
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

                            <img src={ProfilePic} height="35px" width="35px" alt="User profile pic" />
                            <div className="center"><p>UserName</p></div>
                        </span>
                    </nav>
                </div>
            );
    
        case '/academy': 
            return (
                <div>
                    <nav>
                        <span className="nav-start">
                            <img src={ColorLogo} alt="LingoThyme logo" height="50px"/>
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

                            <img src={ProfilePic} height="35px" width="35px" alt="User profile pic" />
                            <div className="center"><p>UserName</p></div>
                        </span>
                    </nav>
                </div>
            );
            case '/profile': 
                return (
                    <div>
                        <nav>
                            <span className="nav-start">
                                <img src={ColorLogo} alt="LingoThyme logo" height="50px"/>
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
                                <div className="break"></div>
                                <Link to="/profile" style={{ textDecoration: 'none' }}>  {/* remove link styling */}
                                        <p><div className="current-tab"> Profile</div></p>
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
                                <div className="center"><p>UserName</p></div>
                            </span>
                        </nav>
                    </div>
                );
    }
}
    
export default Navbar;
    
    
    
    