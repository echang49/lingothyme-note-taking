import { Link, Redirect, useHistory } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from 'axios'
import Logo from "../assets/main-logo.png";
import firebase from "../firebase.js";

function EditProfile(){
    const [bool, setBool] = useState(true);
    const [user, setUser] = useState({ loggedIn: false });
    const [userName, setUserName] = useState('loading');
    const [email, setEmail] = useState('loading');
    const userEmail = useRef("placeholder");
    const userNameInput = useRef("");
    const auth = firebase.auth();

    function onAuthStateChange(callback) {
        return firebase.auth().onAuthStateChanged(async user => {
            if (user) {
                callback({loggedIn: true}); // set user login state to true
                userEmail.current = user.email;
                console.log(userEmail.current);
                setEmail(userEmail.current);

                const res2 = await axios.post('/api/auth/getUsername', {email: user.email})
                setUserName(res2.data);
            } else {
                callback({loggedIn: false});
            }
        });
    }

    useEffect(() => {
        setEmail(userEmail.current);
        console.log("in use effect" + email);
    }, [userEmail.current]);

    useEffect(() => {
        const unsubscribe = onAuthStateChange(setUser);
        return () => {
          unsubscribe();
        };
    }, []);



    async function save(){
        setUserName(userNameInput.current.value);
        console.log("userName: " + userName);
        let data = {
            email: email,
            username: userNameInput.current.value
        }
        console.log("data.email: " + data.email + "data.username" + data.username);
        await axios.post('/api/auth/mainhall_edit_username', data);
        window.location.href="/profile";
    }

    return ( 
        <div>
            {
                bool ?
                    <div className="createRoom">
                        <img src={Logo} alt="LingoThyme Logo" height="100px"/>
                        <div className="flex-column">
                            <div className="input">
                                <label>New username:</label>
                                <textarea rows="1" type="text" ref={userNameInput} />
                                <p>{userNameInput.current.innerHTML}</p>
                            </div>

                            <div className="buttons">
                                <button className="primary-button" onClick={() => save()}>SAVE</button>
                                <Link to="/mainHall" className="secondary-button">CANCEL</Link>
                            </div>
                        </div>
                    </div>
                :
                <Redirect to="/" />
            }
        </div>
    
    );

}

export default EditProfile;