import { Link } from "react-router-dom"; 
import { Redirect, useRef, useState } from "react";
import firebase from "../firebase.js";
import ColorLogo from "../assets/main-logo.png";

function Login(props){
    const emailInput = useRef(null);
    const passInput = useRef(null);
    const [user, setUser] = useState({ loggedIn: false });
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

export default Login;