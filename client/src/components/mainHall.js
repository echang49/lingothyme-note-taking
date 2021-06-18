import { useEffect, useState, useRef } from "react";
import { Redirect, useLocation, Link} from "react-router-dom"; 

import ColorLogo from "../assets/main-logo.png";
import OngoingCard from "./viewComponents/ongoingCard"; 
import ScheduledCard from "./viewComponents/scheduledCard";
import Navbar from "./viewComponents/navbar"; 

import firebase from "../firebase.js";


function MainHall() {
    const nameInput = useRef(null);
    const [bool, setBool] = useState(true);
    const [user, setUser] = useState({ loggedIn: false });
    const emailInput = useRef(null);
    const passInput = useRef(null);
    const [phase, setPhase] = useState(1);
    const auth = firebase.auth();

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

    async function handleLogout() { 
        setUser({ loggedIn: false });
        return auth.signOut();
    }

    function sleep(ms) {
        console.log("sleeping for " + ms/1000 + "sec");
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
        
    }

    function onAuthStateChange(callback) {
        return firebase.auth().onAuthStateChanged(user => {
            if (user) {
                callback({loggedIn: true});
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

    //firebase WIP 3

    // const user = auth.currentUser;
    // if (user === null){
    //     sleep(500);
    // }
    if(user.loggedIn === null) { // TODO: add loading screen before render here
        return(
            <div>
                <p>delay render</p>
            </div>
        );
    }
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
    // else {
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
    //}

    //
}
    
export default MainHall;
