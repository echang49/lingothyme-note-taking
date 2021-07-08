import { useEffect, useState, useRef } from "react";
import { Redirect, Link} from "react-router-dom"; 
import firebase from "../firebase.js";
import axios from "axios";

import ColorLogo from "../assets/main-logo.png";
import ProfilePic from "../assets/users/Profile1.webp";
import {ReactComponent as Edit} from "../assets/edit-icon.svg"; // taken from https://iconmonstr.com/edit-9-svg/, replace with custom icon later

import Navbar from "./viewComponents/navbar";


function Profile() {
    const [bool, setBool] = useState(true);
    const emailInput = useRef(null);
    const passInput = useRef(null);
    //const [loggedIn, setLoggedIn] = useState(false);
    //const [phase, setPhase] = useState(1);
    const [user, setUser] = useState({ loggedIn: false });
    const [aboutMeText, setAboutMeText] = useState("");
    const [userEmail, setUserEmail] = useState(undefined);
    const auth = firebase.auth();
    //setBool(loggedIn); // if logged in, render profile page, else redirect to /mainHall

    function onAuthStateChange(callback) {
        return firebase.auth().onAuthStateChanged(async user => {
            if (user) {
                callback({loggedIn: true}); // set user login state to true
                setUserEmail(user.email);
                //const res = await axios.post('/api/auth/getAboutMeText', {email: userEmail})
                const res = await axios.post('/api/auth/getAboutMeText', {email: user.email})
                console.log("res.data = " + res.data);
                setAboutMeText(res.data);  
                console.log("about me text: " + aboutMeText);
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

    // useEffect(() => {
    //     console.log("updating about me text...");
    //     axios.post('/api/auth/getAboutMeText', {email: userEmail})
    // }, [aboutMeText]);


    async function handleLogin() { 
        let email = emailInput.current.value;
        let pass = passInput.current.value;
        auth.signInWithEmailAndPassword(email, pass)
        .then(() => {
            setUser(auth.currentUser); 
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

    function handleProfileEdit(){
        console.log("handling profile edit");
        //axios.post('/api/auth/mainhall_editAboutme', {email: user.email, aboutMeText: "this is the replacement text"})
    }

    async function handleAboutMeEdit(){
        await setAboutMeText("this is the replacement text");
        console.log("handling aboutMe edit, saving text as: " + aboutMeText);
        await axios.post('/api/auth/mainhall_editAboutme', {email: userEmail, aboutMeText: aboutMeText});
    }

    // TODO: add loading screen using react-loading package here so login screen isn't shown on page reload while logged in
    if(!user.loggedIn) { // user not logged in, prompt them to login or signup
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
                                    <div className="profile-box-inner"> 
                                        <div className="profile-pic">
                                            <img src={ProfilePic} height="75px" width="75px" alt="User profile pic" />
                                        </div>
                                        <Edit className="edit-icon" onClick={() => handleProfileEdit()} />
                                        <div className="username"><h>UserName</h></div>
                                        
                                    </div>
                                    
                                </div>

                                <div className="about-me">
                                    <div className="about-me-inner">
                                        <Edit className="edit-icon" onClick={() => handleAboutMeEdit()} />
                                        <div className="title"><h>About Me</h></div>
                                        <diV className="content">
                                            <p>{aboutMeText}</p>
                                            <label>Edit:</label>
                                            <input type="text" ref={emailInput} />
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

    //}
        
}
    
export default Profile;
