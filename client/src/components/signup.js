import { useEffect, useState, useRef } from "react";
import { Redirect, useLocation, Link} from "react-router-dom"; 

import ColorLogo from "../assets/main-logo.png";
import OngoingCard from "./viewComponents/ongoingCard"; // DELETE
import ScheduledCard from "./viewComponents/scheduledCard"; // DELETE

import {ReactComponent as Logo} from "../assets/main-logo.svg";
import firebase from "../firebase.js";


function SignUp() {
    const nameInput = useRef(null);
    const emailInput = useRef(null);
    const passInput = useRef(null);
    const confirmPassInput = useRef(null);
    const auth = firebase.auth();

    async function handleSubmit() { // signup
        let email = emailInput.current.value;
        let pass = passInput.current.value;
        let confirmPass = confirmPassInput.current.value;

        var actionCodeSettings = { // used for sending email verification link? 
            // URL you want to redirect back to. The domain (www.example.com) for this
            // URL must be in the authorized domains list in the Firebase Console.
            url: 'www.google.com',
            handleCodeInApp: true, // This must be true.
            iOS: { // WIP

            },
            android: { // WIP

            },
            dynamicLinkDomain: 'localhost:3000/mainHall'
          };

        if(pass === confirmPass){ // check to see if passwords match
            firebase.auth().createUserWithEmailAndPassword(email, pass)
            .catch(function(error) { 
                // if email or password not valid, throw error
                var errorCode = error.code;
                //var errorMessage = error.message;
                if (errorCode == 'auth/weak-password') {
                    alert('The password is too weak, please try again.');
                } else if(errorCode == 'auth/email-already-in-use') {
                    alert('This email is already in use.');
                } else if(errorCode == 'auth/invalid-email'){
                    alert('Email is invalid, please try again.');
                }else{
                    alert(errorCode);
                }
                console.log(error);
            }).then(() => {
                // if no errors thrown for signup, send user an email verification link, then send to mainHall
                firebase.auth().currentUser.sendEmailVerification(actionCodeSettings)
               .then(() => {
                   alert("A verification link has been sent to your email.");
                   <Redirect to="/mainHall" />
               }).catch((error) => {
                   
                   var errorCode = error.code;
                   var errorMessage = error.message;
                   alert("ErrorCode: " + errorCode + "error message: " + errorMessage);
                   // ...
               });
               alert("Verification link was not sent, sending to mainHall.");
               <Redirect to="/mainHall" />
           });
            
           
        }else{
            alert("passwords do not match, please try again");
        }
    }
    return(
        <div className="enterRoom center">
            <img src={ColorLogo} alt="LingoThyme Logo" height="250px"/>
            <div className="input">
                <label>Name:</label>
                <input type="name" ref={nameInput} />

                <label>Email:</label>
                <input type="email" ref={emailInput} />

                <label>Password:</label>
                <input type="password" ref={passInput} />

                <label>Confirm Password:</label>
                <input type="password" ref={confirmPassInput} />

                <div className="buttons">
                    <button className="primary-button" onClick={() => handleSubmit()} >SUBMIT</button> 
                    <Link className="secondary-button" to="/">CANCEL</Link>
                </div>

            </div>
        </div>
    );
}
    
export default SignUp;