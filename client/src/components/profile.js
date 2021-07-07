import { useState, useEffect } from "react";
import { Redirect } from "react-router-dom"; 
import firebase from "../firebase.js";
import axios from "axios";

import ProfilePic from "../assets/users/Profile1.webp";
import {ReactComponent as Edit} from "../assets/edit-icon.svg"; // taken from https://iconmonstr.com/edit-9-svg/, replace with custom icon later

import Navbar from "./viewComponents/navbar";


function Profile() {
    const [bool, setBool] = useState(true);
    //const [loggedIn, setLoggedIn] = useState(false);
    //const [phase, setPhase] = useState(1);
    const [user, setUser] = useState({ loggedIn: false });
    const [email, setEmail] = useState('');
    const [aboutMeText, setAboutMeText] = useState("");
    const [currentUser, setCurrentUser] = useState(undefined);
    const auth = firebase.auth();
    //setBool(loggedIn); // if logged in, render profile page, else redirect to /mainHall

    function onAuthStateChange(callback) {
        return firebase.auth().onAuthStateChanged(async user => {
            if (user) {
                console.log(user.email)
                callback({loggedIn: true});
                let userEmail = user.email;
                setEmail(userEmail);
                const res = await axios.post('/api/auth/getAboutMeText', {email: userEmail})
                setAboutMeText(res.data);
                console.log(aboutMeText);
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


    function handleEditClick(){
        
    }
    
    // TODO: make sure user cannot access profile page when not logged in
    //if(loggedIn){
    
    //var aboutMeText = axios.post('/api/auth/getAboutMeText', auth.currentUser.email);
    //console.log(aboutMeText);
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
                                        <Edit className="edit-icon" onclick={()=> handleEditClick}/>
                                        <div className="username"><h>UserName</h></div>
                                        
                                    </div>
                                    
                                </div>

                                <div className="about-me">
                                    <div className="about-me-inner">
                                        <Edit className="edit-icon" onclick={()=> handleEditClick}/>
                                        <div className="title"><h>About Me</h></div>
                                        <diV className="content"><p>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Neque aliquam vestibulum morbi blandit cursus. Dignissim convallis aenean et tortor at risus viverra adipiscing at. Varius vel pharetra vel turpis nunc eget lorem dolor. Suscipit tellus mauris a diam maecenas sed enim.
                                            </p></diV>
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
