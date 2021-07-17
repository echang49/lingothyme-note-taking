import { useEffect, useState, useRef } from "react";
import { Redirect, Link} from "react-router-dom"; 
import firebase from "../firebase.js";
import axios from "axios";

import ColorLogo from "../assets/main-logo.png";
import ProfilePic from "../assets/users/Profile1.webp";
import Login from "./login.js";
import {ReactComponent as Edit} from "../assets/edit-icon.svg"; // taken from https://iconmonstr.com/edit-9-svg/, replace with custom icon later

import Navbar from "./viewComponents/navbar";


function Profile() {
    const [bool, setBool] = useState(true);
    const [user, setUser] = useState({ loggedIn: false });
    const [userName, setUserName] = useState('loading');
    const [aboutMeText, setAboutMeText] = useState('loading');
    const userEmail = useRef("placeholder");
    const auth = firebase.auth();

    function onAuthStateChange(callback) {
        return firebase.auth().onAuthStateChanged(async user => {
            if (user) {
                callback({loggedIn: true}); // set user login state to true
                userEmail.current = user.email;

                const res = await axios.post('/api/auth/getAboutMeText', {email: user.email})
                setAboutMeText(res.data);

                const res2 = await axios.post('/api/auth/getUsername', {email: user.email})
                setUserName(res2.data);
            } else {
                callback({loggedIn: false});
            }
        });
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChange(setUser);
        return () => {
          unsubscribe();
        };
    }, []);

    async function handleProfileEdit(){
        window.location.href = "/profile/editProfile";

    }

    function handleAboutMeEdit(){
        window.location.href = "/profile/editAboutMe";
    }
    
    // TODO: add loading screen using react-loading package here so login screen isn't shown on page reload while logged in
    if(!user.loggedIn) { // user not logged in, prompt them to login or signup
        return <Login />
    }
    return( // user is logged in, display main hall
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
                                    <div className="profile-box-inner"> 
                                        <div className="profile-pic">
                                            <img src={ProfilePic} height="75px" width="75px" alt="User profile pic" />
                                        </div>
                                        <Edit className="edit-icon" onClick={() => handleProfileEdit()} />
                                        <div className="username"><h>{userName}</h></div>
                                        
                                    </div>
                                    
                                </div>

                                <div className="about-me">
                                    <div className="about-me-inner">
                                        <Edit className="edit-icon" onClick={() => handleAboutMeEdit()} />
                                        {/* <Edit className="edit-icon" onClick={() => window.location.href = "/mainHall/editAboutMe"}/> */}
                                        <div className="title"><h>About Me</h></div>
                                        <diV className="content">
                                            <p>{aboutMeText}</p>
                                        </diV>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                :
                    <Redirect to="/mainHall" />
            }
        </div>
    );     
}
    
export default Profile;
